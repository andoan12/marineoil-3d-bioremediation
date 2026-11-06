import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { InoculationDrop, SimulationStep, StrainId } from '../../types/simulation';
import { BACTERIAL_STRAINS } from '../../data/strains';

interface BacterialInoculationSystemProps {
  drops: InoculationDrop[];
  selectedStrain: StrainId;
  nutrientBoost: number; // 1.0 to 2.0
  step: SimulationStep;
  cleanupProgress: number;
}

export const BacterialInoculationSystem: React.FC<BacterialInoculationSystemProps> = ({
  drops,
  selectedStrain,
  nutrientBoost,
  step,
  cleanupProgress,
}) => {
  const swarmMeshRef = useRef<THREE.InstancedMesh>(null);
  const fallingDropletsRef = useRef<THREE.InstancedMesh>(null);
  const rippleGroupRef = useRef<THREE.Group>(null);

  const strainColor = BACTERIAL_STRAINS[selectedStrain].color;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate chemotactic bacterial cells per drop (up to 240 cells total for 60fps)
  const maxCells = 240;
  const cellSeeds = useMemo(() => {
    const arr = [];
    for (let i = 0; i < maxCells; i++) {
      arr.push({
        angle: Math.random() * Math.PI * 2,
        radiusSpeed: 0.25 + Math.random() * 0.65,
        depthOffset: -0.04 - Math.random() * 0.55,
        wiggleSpeed: 2.0 + Math.random() * 3.0,
        phase: Math.random() * Math.PI * 2,
        scale: 0.65 + Math.random() * 0.55,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const now = state.clock.getElapsedTime();

    // Update chemotactic bacterial swarm below the oil slick
    if (swarmMeshRef.current) {
      if (drops.length === 0 || cleanupProgress >= 99.5) {
        swarmMeshRef.current.count = 0;
      } else {
        const activeCells = Math.min(maxCells, drops.length * 48);
        swarmMeshRef.current.count = activeCells;

        for (let i = 0; i < activeCells; i++) {
          const dropIndex = i % drops.length;
          const drop = drops[dropIndex];
          const seed = cellSeeds[i];

          const age = Math.max(0, now - drop.timestamp);
          // Fall phase (0 to 0.7s) then radial chemotactic dispersion along oil slick
          if (age < 0.7) {
            const fallProgress = age / 0.7;
            const y = THREE.MathUtils.lerp(2.4, 0.02, fallProgress);
            const spread = fallProgress * 0.22;
            dummy.position.set(
              drop.position[0] + Math.cos(seed.angle) * spread,
              y + (i % 5) * 0.08,
              drop.position[2] + Math.sin(seed.angle) * spread
            );
            dummy.rotation.set(0.2, seed.angle, 0.1);
            dummy.scale.setScalar(0.038 * seed.scale);
          } else {
            const swimTime = age - 0.7;
            const maxSpread = 1.65 * Math.sqrt(nutrientBoost);
            const currentRadius = Math.min(
              maxSpread,
              0.18 + swimTime * seed.radiusSpeed * 0.45
            );
            const currentAngle = seed.angle + Math.sin(now * 0.8 + seed.phase) * 0.25;

            const x = drop.position[0] + Math.cos(currentAngle) * currentRadius;
            const z = drop.position[2] + Math.sin(currentAngle) * currentRadius;
            const y =
              seed.depthOffset +
              Math.sin(now * seed.wiggleSpeed + seed.phase) * 0.05;

            dummy.position.set(x, y, z);
            dummy.rotation.set(
              Math.PI / 2 + Math.sin(now * 3 + seed.phase) * 0.2,
              currentAngle + Math.PI / 2,
              0
            );
            // Population density scales down gently when oil is fully mineralized at end of Step 4
            const fadeOut =
              step === 4 ? Math.max(0.2, 1 - (cleanupProgress / 100) * 0.75) : 1.0;
            dummy.scale.setScalar(0.036 * seed.scale * fadeOut);
          }

          dummy.updateMatrix();
          swarmMeshRef.current.setMatrixAt(i, dummy.matrix);
        }
        swarmMeshRef.current.instanceMatrix.needsUpdate = true;
      }
    }

    // Update falling bio-carrier droplets during initial 0.85s after release
    if (fallingDropletsRef.current) {
      let dropletIdx = 0;
      for (let d = 0; d < drops.length; d++) {
        const age = now - drops[d].timestamp;
        if (age >= 0 && age < 0.95) {
          const progress = age / 0.95;
          for (let k = 0; k < 8; k++) {
            if (dropletIdx >= 64) break;
            const offsetAngle = (k / 8) * Math.PI * 2 + d;
            const radial = 0.08 * (1 + progress);
            const y = 2.6 * (1 - progress * progress) - 0.15 * (k % 3);
            dummy.position.set(
              drops[d].position[0] + Math.cos(offsetAngle) * radial,
              Math.max(0.0, y),
              drops[d].position[2] + Math.sin(offsetAngle) * radial
            );
            dummy.scale.setScalar(0.055 * (1 - progress * 0.4));
            dummy.updateMatrix();
            fallingDropletsRef.current.setMatrixAt(dropletIdx, dummy.matrix);
            dropletIdx++;
          }
        }
      }
      fallingDropletsRef.current.count = dropletIdx;
      fallingDropletsRef.current.instanceMatrix.needsUpdate = true;
    }

    // Animate surface biosurfactant dispersion rings
    if (rippleGroupRef.current) {
      rippleGroupRef.current.children.forEach((child, idx) => {
        const drop = drops[idx];
        if (!drop) return;
        const age = Math.max(0, now - drop.timestamp - 0.65);
        if (age <= 0) {
          child.visible = false;
        } else {
          child.visible = true;
          const cycle = (age * 0.55) % 1.0;
          const scale = 0.25 + cycle * 2.1 * Math.sqrt(nutrientBoost);
          child.scale.set(scale, scale, 1);
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.opacity = Math.max(0, (1 - cycle) * 0.55 * (1 - cleanupProgress / 110));
          }
        }
      });
    }
  });

  return (
    <group>
      {/* Falling Inoculum Bio-Carrier Stream */}
      <instancedMesh ref={fallingDropletsRef} args={[undefined, undefined, 64]}>
        <sphereGeometry args={[1, 10, 10]} />
        <meshStandardMaterial
          color={strainColor}
          emissive={strainColor}
          emissiveIntensity={0.65}
          transparent
          opacity={0.9}
        />
      </instancedMesh>

      {/* Chemotactic Rod-Shaped Bacteria Swarm Under the Slick */}
      <instancedMesh ref={swarmMeshRef} args={[undefined, undefined, maxCells]}>
        <capsuleGeometry args={[0.7, 1.8, 6, 10]} />
        <meshStandardMaterial
          color={strainColor}
          emissive={strainColor}
          emissiveIntensity={0.45}
          roughness={0.25}
        />
      </instancedMesh>

      {/* Biosurfactant Interfacial Dispersion Rings */}
      <group ref={rippleGroupRef}>
        {drops.map((drop) => (
          <mesh
            key={drop.id}
            position={[drop.position[0], 0.04, drop.position[2]]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <ringGeometry args={[0.78, 0.92, 48]} />
            <meshBasicMaterial
              color={strainColor}
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};
