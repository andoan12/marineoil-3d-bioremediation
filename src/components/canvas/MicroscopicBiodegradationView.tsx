import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Language, SimulationStep, StrainId } from '../../types/simulation';
import { BACTERIAL_STRAINS } from '../../data/strains';
import { TRANSLATIONS } from '../../i18n/translations';

interface MicroscopicBiodegradationViewProps {
  step: SimulationStep;
  selectedStrain: StrainId;
  enzymaticRate: number; // 0.5 to 2.0
  cleanupProgress: number; // 0 to 100
  show3DLabels: boolean;
  lang: Language;
}

interface DropletConfig {
  id: number;
  position: [number, number, number];
  baseRadius: number;
  bacteriaCount: number;
  phaseOffset: number;
}

const OIL_DROPLETS: DropletConfig[] = [
  { id: 0, position: [0, -0.65, 0], baseRadius: 0.42, bacteriaCount: 18, phaseOffset: 0 },
  { id: 1, position: [-0.95, -0.52, 0.45], baseRadius: 0.26, bacteriaCount: 11, phaseOffset: 1.4 },
  { id: 2, position: [0.92, -0.78, -0.35], baseRadius: 0.30, bacteriaCount: 13, phaseOffset: 2.7 },
  { id: 3, position: [0.48, -0.45, 0.78], baseRadius: 0.21, bacteriaCount: 9, phaseOffset: 4.1 },
  { id: 4, position: [-0.62, -0.88, -0.65], baseRadius: 0.24, bacteriaCount: 10, phaseOffset: 5.2 },
];

export const MicroscopicBiodegradationView: React.FC<MicroscopicBiodegradationViewProps> = ({
  step,
  selectedStrain,
  enzymaticRate,
  cleanupProgress,
  show3DLabels,
  lang,
}) => {
  const t = TRANSLATIONS[lang];
  const strain = BACTERIAL_STRAINS[selectedStrain];

  const dropletsGroupRef = useRef<THREE.Group>(null);
  const bacteriaMeshRef = useRef<THREE.InstancedMesh>(null);
  const enzymeSparkMeshRef = useRef<THREE.InstancedMesh>(null);
  const co2GroupRef = useRef<THREE.Group>(null);
  const h2oGroupRef = useRef<THREE.Group>(null);
  const alkaneChainGroupRef = useRef<THREE.Group>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate spherical Fibonacci attachment points for bacteria colonizing each oil droplet
  const attachedBacteriaSeeds = useMemo(() => {
    const seeds: Array<{
      dropletIdx: number;
      normal: THREE.Vector3;
      tangent: THREE.Vector3;
      phase: number;
      isDividing: boolean;
    }> = [];

    OIL_DROPLETS.forEach((droplet, dIdx) => {
      const n = droplet.bacteriaCount;
      const goldenRatio = (1 + Math.sqrt(5)) / 2;
      for (let i = 0; i < n; i++) {
        const theta = (2 * Math.PI * i) / goldenRatio;
        const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
        const nx = Math.cos(theta) * Math.sin(phi);
        const ny = Math.sin(theta) * Math.sin(phi);
        const nz = Math.cos(phi);
        const normal = new THREE.Vector3(nx, ny, nz).normalize();
        const up = Math.abs(ny) < 0.9 ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(1, 0, 0);
        const tangent = new THREE.Vector3().crossVectors(normal, up).normalize();
        seeds.push({
          dropletIdx: dIdx,
          normal,
          tangent,
          phase: i * 0.73 + dIdx * 1.9,
          isDividing: i % 3 === 0,
        });
      }
    });
    return seeds;
  }, []);

  // Pre-generate rising CO2 and H2O molecular byproduct trajectories
  const byproductSeeds = useMemo(() => {
    const items = [];
    for (let i = 0; i < 18; i++) {
      const droplet = OIL_DROPLETS[i % OIL_DROPLETS.length];
      items.push({
        origin: droplet.position,
        offsetAngle: (i / 18) * Math.PI * 2,
        radialSpread: 0.16 + (i % 4) * 0.08,
        speed: 0.28 + (i % 5) * 0.06,
        phase: i * 0.55,
        rotSpeed: 0.8 + (i % 3) * 0.5,
      });
    }
    return items;
  }, []);

  // Visibility and scale factor: prominent in Step 3 (and visible as subcutaneous micelles in Steps 2 & 4)
  const isVisible = step >= 2;
  const dropletShrinkFactor = Math.max(0.12, 1 - (cleanupProgress / 100) * 0.85);

  useFrame((state) => {
    if (!isVisible) return;
    const elapsed = state.clock.getElapsedTime();

    // 1. Animate emulsified oil droplets (subtle organic pulsation + shrinking as cleanup progresses)
    if (dropletsGroupRef.current) {
      dropletsGroupRef.current.children.forEach((child, idx) => {
        const cfg = OIL_DROPLETS[idx];
        if (!cfg) return;
        const pulse = 1 + Math.sin(elapsed * 2.2 * enzymaticRate + cfg.phaseOffset) * 0.035;
        const radius = cfg.baseRadius * dropletShrinkFactor * pulse;
        child.scale.setScalar(radius);
        child.position.set(
          cfg.position[0],
          cfg.position[1] + Math.sin(elapsed * 1.1 + cfg.phaseOffset) * 0.03,
          cfg.position[2]
        );
      });
    }

    // 2. Animate colonizing rod-shaped bacteria + binary fission multiplication on droplet surfaces
    if (bacteriaMeshRef.current && enzymeSparkMeshRef.current) {
      let bIdx = 0;
      let eIdx = 0;

      attachedBacteriaSeeds.forEach((seed) => {
        const cfg = OIL_DROPLETS[seed.dropletIdx];
        const currentDropletRadius = cfg.baseRadius * dropletShrinkFactor;
        const dropletY = cfg.position[1] + Math.sin(elapsed * 1.1 + cfg.phaseOffset) * 0.03;
        const center = new THREE.Vector3(cfg.position[0], dropletY, cfg.position[2]);

        // Bacterial cell positioned right on the oil-water interface
        const surfacePos = center
          .clone()
          .addScaledVector(seed.normal, currentDropletRadius + 0.035);

        // Subtle chemotactic & enzymatic wiggle along the tangent plane
        const wiggle = Math.sin(elapsed * 3.5 * enzymaticRate + seed.phase) * 0.018;
        surfacePos.addScaledVector(seed.tangent, wiggle);

        dummy.position.copy(surfacePos);
        // Orient bacterium tangent/radial to the oil globule surface
        const lookTarget = surfacePos.clone().add(seed.tangent);
        dummy.lookAt(lookTarget);
        dummy.scale.set(0.028, 0.028, 0.055);
        dummy.updateMatrix();
        bacteriaMeshRef.current!.setMatrixAt(bIdx++, dummy.matrix);

        // Binary fission daughter cell multiplying next to parent cell when enzymaticRate is active
        if (seed.isDividing && bIdx < attachedBacteriaSeeds.length * 2) {
          const divisionCycle = (Math.sin(elapsed * 1.8 * enzymaticRate + seed.phase) + 1) * 0.5;
          const separation = 0.03 + divisionCycle * 0.055;
          const daughterPos = surfacePos.clone().addScaledVector(seed.tangent, separation);
          dummy.position.copy(daughterPos);
          dummy.lookAt(daughterPos.clone().add(seed.tangent));
          dummy.scale.set(
            0.024 * (0.6 + 0.4 * divisionCycle),
            0.024 * (0.6 + 0.4 * divisionCycle),
            0.048 * (0.6 + 0.4 * divisionCycle)
          );
          dummy.updateMatrix();
          bacteriaMeshRef.current!.setMatrixAt(bIdx++, dummy.matrix);
        }

        // Enzymatic AlkB Hydroxylase active site glow between bacterium and oil core
        if (eIdx < attachedBacteriaSeeds.length) {
          const enzymePos = center
            .clone()
            .addScaledVector(seed.normal, currentDropletRadius + 0.012);
          dummy.position.copy(enzymePos);
          const sparkPulse =
            0.016 *
            (0.6 + 0.4 * Math.sin(elapsed * 6.0 * enzymaticRate + seed.phase * 2.0));
          dummy.scale.setScalar(sparkPulse);
          dummy.updateMatrix();
          enzymeSparkMeshRef.current!.setMatrixAt(eIdx++, dummy.matrix);
        }
      });

      bacteriaMeshRef.current.count = bIdx;
      bacteriaMeshRef.current.instanceMatrix.needsUpdate = true;
      enzymeSparkMeshRef.current.count = eIdx;
      enzymeSparkMeshRef.current.instanceMatrix.needsUpdate = true;
    }

    // 3. Animate internal hydrocarbon alkane chain cleavage inside primary droplet
    if (alkaneChainGroupRef.current) {
      alkaneChainGroupRef.current.rotation.y = elapsed * 0.45 * enzymaticRate;
      alkaneChainGroupRef.current.rotation.z = Math.sin(elapsed * 0.7) * 0.25;
      alkaneChainGroupRef.current.scale.setScalar(dropletShrinkFactor);
    }

    // 4. Animate rising CO2 and H2O molecular byproducts
    const animateByproductGroup = (group: THREE.Group | null, phaseShift: number) => {
      if (!group) return;
      group.children.forEach((mol, i) => {
        const seed = byproductSeeds[i % byproductSeeds.length];
        const cycle = ((elapsed * seed.speed * enzymaticRate + seed.phase + phaseShift) % 1.0);
        const angle = seed.offsetAngle + elapsed * 0.35;
        const radius = seed.radialSpread * (0.5 + cycle * 1.1);

        const x = seed.origin[0] + Math.cos(angle) * radius;
        const z = seed.origin[2] + Math.sin(angle) * radius;
        const y = seed.origin[1] + 0.15 + cycle * 0.95;

        mol.position.set(x, y, z);
        mol.rotation.set(
          elapsed * seed.rotSpeed,
          elapsed * seed.rotSpeed * 0.8,
          seed.phase
        );
        // Smooth fade-in at droplet surface and fade-out as it dissolves in seawater
        const scaleEnv = Math.sin(cycle * Math.PI) * (step === 3 ? 1.0 : 0.65);
        mol.scale.setScalar(Math.max(0.001, scaleEnv));
      });
    };

    animateByproductGroup(co2GroupRef.current, 0);
    animateByproductGroup(h2oGroupRef.current, 0.5);
  });

  if (!isVisible) return null;

  return (
    <group>
      {/* Emulsified Crude Oil Globules + Biosurfactant Micelle Corona */}
      <group ref={dropletsGroupRef}>
        {OIL_DROPLETS.map((d) => (
          <group key={d.id} position={d.position}>
            {/* Core Hydrophobic Petroleum Globule */}
            <mesh>
              <sphereGeometry args={[1, 32, 32]} />
              <meshPhysicalMaterial
                color="#14100c"
                emissive="#291a09"
                emissiveIntensity={0.35}
                roughness={0.18}
                metalness={0.35}
                clearcoat={1.0}
                clearcoatRoughness={0.12}
              />
            </mesh>
            {/* Outer Translucent Glycolipid Biosurfactant Micelle Shell */}
            <mesh scale={1.08}>
              <sphereGeometry args={[1, 24, 24]} />
              <meshBasicMaterial
                color={strain.color}
                wireframe
                transparent
                opacity={step === 3 ? 0.22 : 0.1}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Hydrocarbon Alkane Chain (C16H34 Hexadecane backbone) inside main droplet */}
      <group ref={alkaneChainGroupRef} position={[0, -0.65, 0]}>
        {[-0.22, -0.13, -0.04, 0.05, 0.14, 0.23].map((xOffset, idx) => (
          <mesh
            key={idx}
            position={[
              xOffset,
              (idx % 2 === 0 ? 1 : -1) * 0.045,
              Math.sin(idx) * 0.04,
            ]}
          >
            <sphereGeometry args={[0.042, 12, 12]} />
            <meshStandardMaterial
              color="#f59e0b"
              emissive="#d97706"
              emissiveIntensity={0.4}
              roughness={0.3}
            />
          </mesh>
        ))}
      </group>

      {/* Colonizing Rod-Shaped Bacteria Biofilm (Instanced) */}
      <instancedMesh
        ref={bacteriaMeshRef}
        args={[undefined, undefined, attachedBacteriaSeeds.length * 2]}
      >
        <capsuleGeometry args={[0.45, 1.35, 8, 12]} />
        <meshStandardMaterial
          color={strain.color}
          emissive={strain.secondaryColor}
          emissiveIntensity={0.55}
          roughness={0.2}
          metalness={0.1}
        />
      </instancedMesh>

      {/* AlkB Hydroxylase Enzymatic Oxidation Sites (Instanced) */}
      <instancedMesh
        ref={enzymeSparkMeshRef}
        args={[undefined, undefined, attachedBacteriaSeeds.length]}
      >
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#fde047" transparent opacity={0.85} />
      </instancedMesh>

      {/* Harmless Mineralization Byproducts: CO2 Molecules (Linear O=C=O) */}
      <group ref={co2GroupRef}>
        {byproductSeeds.slice(0, 10).map((_, idx) => (
          <group key={`co2-${idx}`}>
            {/* Central Carbon Atom */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.026, 10, 10]} />
              <meshStandardMaterial color="#334155" roughness={0.3} />
            </mesh>
            {/* Two Oxygen Atoms */}
            <mesh position={[-0.042, 0, 0]}>
              <sphereGeometry args={[0.022, 10, 10]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#dc2626"
                emissiveIntensity={0.35}
              />
            </mesh>
            <mesh position={[0.042, 0, 0]}>
              <sphereGeometry args={[0.022, 10, 10]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#dc2626"
                emissiveIntensity={0.35}
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* Harmless Mineralization Byproducts: H2O Molecules (Bent H-O-H) */}
      <group ref={h2oGroupRef}>
        {byproductSeeds.slice(0, 12).map((_, idx) => (
          <group key={`h2o-${idx}`}>
            {/* Central Oxygen Atom */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.025, 10, 10]} />
              <meshStandardMaterial
                color="#38bdf8"
                emissive="#0284c7"
                emissiveIntensity={0.4}
              />
            </mesh>
            {/* Two Hydrogen Atoms at ~104.5 deg */}
            <mesh position={[-0.028, 0.022, 0]}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[0.028, 0.022, 0]}>
              <sphereGeometry args={[0.016, 8, 8]} />
              <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.3} />
            </mesh>
          </group>
        ))}
      </group>

      {/* 3D Microscopic Callouts for Step 3 */}
      {show3DLabels && step === 3 && (
        <>
          <Html position={[-0.55, -0.68, 0.35]} center distanceFactor={5.5}>
            <div className="pointer-events-none select-none px-2.5 py-1.5 rounded-lg bg-slate-950/90 border border-amber-500/50 text-white shadow-xl backdrop-blur-md whitespace-nowrap">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                {t.sceneLabels.oilDropletMicelle}
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                {t.sceneLabels.oilDropletMicelleSub}
              </div>
            </div>
          </Html>

          <Html position={[0.58, -0.52, 0.25]} center distanceFactor={5.5}>
            <div className="pointer-events-none select-none px-2.5 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-400/50 text-white shadow-xl backdrop-blur-md whitespace-nowrap">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                {t.sceneLabels.alcanivoraxBiofilm}
              </div>
              <div className="text-[10px] text-cyan-100/90 font-mono">
                {t.sceneLabels.alcanivoraxBiofilmSub}
              </div>
            </div>
          </Html>

          <Html position={[0.12, -0.08, -0.15]} center distanceFactor={5.5}>
            <div className="pointer-events-none select-none px-2.5 py-1.5 rounded-lg bg-emerald-950/90 border border-emerald-400/50 text-white shadow-xl backdrop-blur-md whitespace-nowrap">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce" />
                {t.sceneLabels.byproductsCloud}
              </div>
              <div className="text-[10px] text-emerald-100/90 font-mono">
                {t.sceneLabels.byproductsCloudSub}
              </div>
            </div>
          </Html>
        </>
      )}
    </group>
  );
};
