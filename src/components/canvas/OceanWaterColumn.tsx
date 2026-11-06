import React, { useMemo, useRef } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Language, SimulationStep } from '../../types/simulation';
import { TRANSLATIONS } from '../../i18n/translations';

interface OceanWaterColumnProps {
  step: SimulationStep;
  cleanupProgress: number; // 0 to 100
  spillIntensity: number; // 0.4 to 1.0
  waveEnergy: number; // 0.2 to 1.5
  showCrossSection: boolean;
  show3DLabels: boolean;
  lang: Language;
  isDark: boolean;
  inoculationCount: number;
  onSurfaceClick?: (point: [number, number, number]) => void;
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uWaveEnergy;
  uniform float uOilCoverage;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vElevation;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Viscous oil slick dampens high-frequency capillary waves
    float damping = mix(1.0, 0.42, uOilCoverage);
    float amp = 0.14 * uWaveEnergy * damping;

    float w1 = sin(pos.x * 1.15 + uTime * 1.45) * cos(pos.y * 0.95 + uTime * 1.15);
    float w2 = sin(pos.x * 2.4 - uTime * 1.9 + pos.y * 1.7) * 0.45 * damping;
    float w3 = cos(pos.x * 4.2 + pos.y * 3.8 - uTime * 2.6) * 0.15 * (1.0 - uOilCoverage * 0.75);

    float elevation = (w1 + w2 + w3) * amp;
    pos.z += elevation;
    vElevation = elevation;

    // Approximate analytical normal for smooth specular reflections
    float dx = (
      1.15 * cos(position.x * 1.15 + uTime * 1.45) * cos(position.y * 0.95 + uTime * 1.15) +
      2.4 * 0.45 * damping * cos(position.x * 2.4 - uTime * 1.9 + position.y * 1.7)
    ) * amp;
    float dy = (
      -0.95 * sin(position.x * 1.15 + uTime * 1.45) * sin(position.y * 0.95 + uTime * 1.15) +
      1.7 * 0.45 * damping * cos(position.x * 2.4 - uTime * 1.9 + position.y * 1.7)
    ) * amp;

    vec3 computedNormal = normalize(vec3(-dx, -dy, 1.0));
    vNormal = normalMatrix * computedNormal;

    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uOilCoverage;
  uniform float uSpillIntensity;
  uniform float uShowBoundary;
  varying vec2 vUv;
  varying vec3 vWorldPosition;
  varying vec3 vNormal;
  varying float vElevation;

  // Hash & 2D value noise for realistic oil slick shape and biodegradation fragmentation
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.05 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 centered = (vUv - 0.5) * 2.0;
    float dist = length(centered);

    // Organic slick shape with fbm perturbation
    float n = fbm(vUv * 4.5 + vec2(uTime * 0.03, -uTime * 0.02));
    float microNoise = fbm(vUv * 12.0 - vec2(uTime * 0.05));

    // Radial slick boundary that shrinks and fragments as cleanup progresses
    float maxRadius = mix(0.0, 0.94 * uSpillIntensity, uOilCoverage);
    float slickField = maxRadius - dist + (n - 0.45) * 0.38;

    // Biodegradation fragmentation holes inside the slick when uOilCoverage < 0.85
    float bioPores = smoothstep(0.0, 0.85, 1.0 - uOilCoverage) * (microNoise - 0.35) * 0.55;
    slickField -= bioPores;

    float oilMask = smoothstep(-0.04, 0.08, slickField) * clamp(uOilCoverage * 1.15, 0.0, 1.0);

    // Clean ocean water color (rich marine cyan-azure with wave crest highlights)
    vec3 deepWater = vec3(0.02, 0.33, 0.52);
    vec3 shallowCyan = vec3(0.06, 0.68, 0.82);
    float crestFactor = smoothstep(-0.12, 0.15, vElevation);
    vec3 waterColor = mix(deepWater, shallowCyan, crestFactor * 0.75 + 0.25);

    // Glossy dark crude oil color with subtle thin-film iridescence near edges
    vec3 coreCrude = vec3(0.035, 0.038, 0.048);
    vec3 amberEdge = vec3(0.16, 0.10, 0.05);
    float edgeBand = smoothstep(0.0, 0.22, slickField) * (1.0 - smoothstep(0.22, 0.48, slickField));

    // Subtle petroleum thin-film sheen (scientific optical interference)
    vec3 sheenColor = vec3(
      0.14 + 0.08 * sin(n * 14.0 + uTime * 0.4),
      0.22 + 0.09 * sin(n * 14.0 + 2.1),
      0.28 + 0.10 * sin(n * 14.0 + 4.2)
    );

    vec3 oilColor = mix(amberEdge, coreCrude, smoothstep(0.05, 0.35, slickField));
    oilColor = mix(oilColor, sheenColor, edgeBand * 0.55);

    // Fresnel & specular highlight for glossy petroleum & water surface
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 norm = normalize(vNormal);
    vec3 lightDir = normalize(vec3(6.0, 12.0, 8.0));
    vec3 halfVec = normalize(lightDir + viewDir);

    float specPower = mix(48.0, 140.0, oilMask);
    float spec = pow(max(dot(norm, halfVec), 0.0), specPower);
    float fresnel = pow(1.0 - max(dot(norm, viewDir), 0.0), 3.0);

    vec3 finalColor = mix(waterColor, oilColor, oilMask);
    finalColor += vec3(0.85, 0.94, 1.0) * spec * mix(0.45, 0.95, oilMask);
    finalColor += vec3(0.12, 0.35, 0.48) * fresnel * (1.0 - oilMask * 0.65);

    // Optional cross-section boundary highlight ring
    if (uShowBoundary > 0.5 && oilMask > 0.05 && oilMask < 0.92) {
      finalColor = mix(finalColor, vec3(0.13, 0.83, 0.93), 0.45);
    }

    float alpha = mix(0.84, 0.98, oilMask);
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export const OceanWaterColumn: React.FC<OceanWaterColumnProps> = ({
  step,
  cleanupProgress,
  spillIntensity,
  waveEnergy,
  showCrossSection,
  show3DLabels,
  lang,
  inoculationCount,
  onSurfaceClick,
}) => {
  const t = TRANSLATIONS[lang];
  const surfaceMaterialRef = useRef<THREE.ShaderMaterial>(null);
  const hydrosolRef = useRef<THREE.InstancedMesh>(null);

  const oilCoverage = useMemo(() => {
    return Math.max(0, 1 - cleanupProgress / 100);
  }, [cleanupProgress]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uWaveEnergy: { value: waveEnergy },
      uOilCoverage: { value: oilCoverage },
      uSpillIntensity: { value: spillIntensity },
      uShowBoundary: { value: showCrossSection ? 1.0 : 0.0 },
    }),
    []
  );

  // Subtle underwater marine hydrosol / dissolved oxygen micro-bubbles
  const hydrosolParticles = useMemo(() => {
    const count = 90;
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        x: (Math.random() - 0.5) * 9.2,
        y: -0.4 - Math.random() * 3.6,
        z: (Math.random() - 0.5) * 9.2,
        speed: 0.08 + Math.random() * 0.14,
        scale: 0.02 + Math.random() * 0.028,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return items;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const elapsed = state.clock.getElapsedTime();
    if (surfaceMaterialRef.current) {
      surfaceMaterialRef.current.uniforms.uTime.value = elapsed;
      surfaceMaterialRef.current.uniforms.uWaveEnergy.value = THREE.MathUtils.lerp(
        surfaceMaterialRef.current.uniforms.uWaveEnergy.value,
        waveEnergy,
        0.08
      );
      surfaceMaterialRef.current.uniforms.uOilCoverage.value = THREE.MathUtils.lerp(
        surfaceMaterialRef.current.uniforms.uOilCoverage.value,
        oilCoverage,
        0.08
      );
      surfaceMaterialRef.current.uniforms.uSpillIntensity.value = THREE.MathUtils.lerp(
        surfaceMaterialRef.current.uniforms.uSpillIntensity.value,
        spillIntensity,
        0.08
      );
      surfaceMaterialRef.current.uniforms.uShowBoundary.value = showCrossSection ? 1.0 : 0.0;
    }

    if (hydrosolRef.current) {
      for (let i = 0; i < hydrosolParticles.length; i++) {
        const p = hydrosolParticles[i];
        const yPos = -3.8 + ((p.y + 3.8 + elapsed * p.speed) % 3.5);
        const xDrift = p.x + Math.sin(elapsed * 0.6 + p.phase) * 0.12;
        const zDrift = p.z + Math.cos(elapsed * 0.5 + p.phase) * 0.12;
        dummy.position.set(xDrift, yPos, zDrift);
        dummy.scale.setScalar(p.scale);
        dummy.updateMatrix();
        hydrosolRef.current.setMatrixAt(i, dummy.matrix);
      }
      hydrosolRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  // Water body color transitions from murky polluted slate-teal to crystal clear azure
  const waterBodyColor = useMemo(() => {
    const polluted = new THREE.Color('#082f44');
    const clean = new THREE.Color('#0891b2');
    return polluted.lerp(clean, cleanupProgress / 100).getStyle();
  }, [cleanupProgress]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    if (step === 2 && onSurfaceClick) {
      e.stopPropagation();
      onSurfaceClick([e.point.x, e.point.y, e.point.z]);
    }
  };

  return (
    <group>
      {/* Top Ocean + Oil Slick Surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        onPointerDown={handlePointerDown}
      >
        <planeGeometry args={[10, 10, 128, 128]} />
        <shaderMaterial
          ref={surfaceMaterialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Thick Cross-Section Rim of the Oil Layer (visible on close inspection or when cross-section is enabled) */}
      {oilCoverage > 0.03 && (
        <mesh position={[0, -0.04 * oilCoverage, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0, 4.4 * spillIntensity * Math.sqrt(oilCoverage), 64]} />
          <meshStandardMaterial
            color="#0b0f17"
            roughness={0.15}
            metalness={0.6}
            transparent
            opacity={showCrossSection ? 0.85 : 0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Volumetric Marine Water Column Box */}
      <mesh position={[0, -2.2, 0]}>
        <boxGeometry args={[10, 4.4, 10]} />
        <meshPhysicalMaterial
          color={waterBodyColor}
          transmission={0.68}
          opacity={0.78}
          transparent
          roughness={0.18}
          ior={1.333}
          depthWrite={false}
        />
      </mesh>

      {/* Benthic Laboratory Tank Floor Grid */}
      <mesh position={[0, -4.41, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          color={cleanupProgress > 60 ? '#0d4a63' : '#072232'}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <gridHelper
        args={[10, 20, '#0ea5e9', '#0369a1']}
        position={[0, -4.39, 0]}
      />

      {/* Laboratory Glass Containment Frame */}
      <lineSegments position={[0, -2.2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(10.04, 4.44, 10.04)]} />
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </lineSegments>

      {/* Subtle Suspended Marine Particulates / Dissolved O2 Micro-Bubbles */}
      <instancedMesh ref={hydrosolRef} args={[undefined, undefined, hydrosolParticles.length]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial
          color={cleanupProgress > 50 ? '#bae6fd' : '#64748b'}
          transparent
          opacity={0.45}
        />
      </instancedMesh>

      {/* 3D Scientific Callout Badges */}
      {show3DLabels && step !== 3 && (
        <>
          {oilCoverage > 0.15 ? (
            <Html position={[-2.2, 0.45, -1.5]} center distanceFactor={14}>
              <div className="pointer-events-none select-none px-2.5 py-1.5 rounded-lg bg-slate-900/85 border border-amber-500/40 text-white shadow-lg backdrop-blur-md whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  {t.sceneLabels.oilSlickLayer}
                </div>
                <div className="text-[10px] text-slate-300 font-mono">
                  {t.sceneLabels.oilSlickSub} • {(oilCoverage * 4.2 * spillIntensity).toFixed(2)} mm
                </div>
              </div>
            </Html>
          ) : (
            <Html position={[-1.8, 0.45, -1.2]} center distanceFactor={14}>
              <div className="pointer-events-none select-none px-2.5 py-1.5 rounded-lg bg-emerald-950/85 border border-emerald-400/50 text-white shadow-lg backdrop-blur-md whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {t.sceneLabels.cleanMarineWater}
                </div>
                <div className="text-[10px] text-emerald-200/90 font-mono">
                  {t.sceneLabels.cleanMarineWaterSub}
                </div>
              </div>
            </Html>
          )}

          <Html position={[3.4, -2.3, 3.4]} center distanceFactor={15}>
            <div className="pointer-events-none select-none px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/35 text-white shadow-lg backdrop-blur-md whitespace-nowrap">
              <div className="text-[11px] font-semibold text-cyan-300">
                {t.sceneLabels.waterColumn}
              </div>
              <div className="text-[10px] text-slate-300 font-mono">
                {t.sceneLabels.waterColumnSub}
              </div>
            </div>
          </Html>

          {inoculationCount > 0 && step === 2 && (
            <Html position={[1.2, 0.65, 1.1]} center distanceFactor={14}>
              <div className="pointer-events-none select-none px-2.5 py-1.5 rounded-lg bg-cyan-950/90 border border-cyan-400/50 text-white shadow-lg backdrop-blur-md whitespace-nowrap">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  {t.sceneLabels.inoculumPlume}
                </div>
                <div className="text-[10px] text-cyan-100/90 font-mono">
                  {t.sceneLabels.inoculumPlumeSub}
                </div>
              </div>
            </Html>
          )}
        </>
      )}
    </group>
  );
};
