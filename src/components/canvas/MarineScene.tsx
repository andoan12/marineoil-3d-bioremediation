import React, { useEffect, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import {
  CameraPreset,
  InoculationDrop,
  Language,
  SimulationStep,
  StrainId,
} from '../../types/simulation';
import { OceanWaterColumn } from './OceanWaterColumn';
import { BacterialInoculationSystem } from './BacterialInoculationSystem';
import { MicroscopicBiodegradationView } from './MicroscopicBiodegradationView';

export interface CameraActionTrigger {
  type: 'rotateLeft' | 'rotateRight' | 'zoomIn' | 'zoomOut' | 'reset';
  nonce: number;
}

interface MarineSceneProps {
  step: SimulationStep;
  cleanupProgress: number;
  spillIntensity: number;
  waveEnergy: number;
  showCrossSection: boolean;
  show3DLabels: boolean;
  lang: Language;
  isDark: boolean;
  drops: InoculationDrop[];
  selectedStrain: StrainId;
  nutrientBoost: number;
  enzymaticRate: number;
  cameraPreset: CameraPreset;
  autoOrbit: boolean;
  cameraAction: CameraActionTrigger | null;
  onSurfaceInoculate: (point: [number, number, number]) => void;
  onFpsUpdate: (fps: number) => void;
}

const CAMERA_PRESET_VECTORS: Record<
  CameraPreset,
  { position: [number, number, number]; target: [number, number, number] }
> = {
  overview: {
    position: [7.8, 5.2, 8.2],
    target: [0, -0.8, 0],
  },
  surface: {
    position: [5.4, 1.35, 5.4],
    target: [0, -0.15, 0],
  },
  microscopic: {
    position: [1.35, -0.32, 1.55],
    target: [0, -0.65, 0],
  },
  top: {
    position: [0.01, 10.5, 0.01],
    target: [0, 0, 0],
  },
};

const CameraRigController: React.FC<{
  cameraPreset: CameraPreset;
  autoOrbit: boolean;
  cameraAction: CameraActionTrigger | null;
  onFpsUpdate: (fps: number) => void;
}> = ({ cameraPreset, autoOrbit, cameraAction, onFpsUpdate }) => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const desiredPos = useRef(new THREE.Vector3(...CAMERA_PRESET_VECTORS.overview.position));
  const desiredTarget = useRef(new THREE.Vector3(...CAMERA_PRESET_VECTORS.overview.target));
  const isTransitioning = useRef(false);

  // FPS measurement refs
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const preset = CAMERA_PRESET_VECTORS[cameraPreset];
    desiredPos.current.set(...preset.position);
    desiredTarget.current.set(...preset.target);
    isTransitioning.current = true;
  }, [cameraPreset]);

  useEffect(() => {
    if (!cameraAction || !controlsRef.current) return;
    const controls = controlsRef.current;
    const offset = new THREE.Vector3().subVectors(camera.position, controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);

    if (cameraAction.type === 'rotateLeft') {
      spherical.theta += Math.PI / 7;
      offset.setFromSpherical(spherical);
      desiredPos.current.copy(controls.target).add(offset);
      desiredTarget.current.copy(controls.target);
      isTransitioning.current = true;
    } else if (cameraAction.type === 'rotateRight') {
      spherical.theta -= Math.PI / 7;
      offset.setFromSpherical(spherical);
      desiredPos.current.copy(controls.target).add(offset);
      desiredTarget.current.copy(controls.target);
      isTransitioning.current = true;
    } else if (cameraAction.type === 'zoomIn') {
      spherical.radius = Math.max(1.2, spherical.radius * 0.78);
      offset.setFromSpherical(spherical);
      desiredPos.current.copy(controls.target).add(offset);
      desiredTarget.current.copy(controls.target);
      isTransitioning.current = true;
    } else if (cameraAction.type === 'zoomOut') {
      spherical.radius = Math.min(18.0, spherical.radius * 1.25);
      offset.setFromSpherical(spherical);
      desiredPos.current.copy(controls.target).add(offset);
      desiredTarget.current.copy(controls.target);
      isTransitioning.current = true;
    } else if (cameraAction.type === 'reset') {
      const preset = CAMERA_PRESET_VECTORS[cameraPreset];
      desiredPos.current.set(...preset.position);
      desiredTarget.current.set(...preset.target);
      isTransitioning.current = true;
    }
  }, [cameraAction, camera, cameraPreset]);

  useFrame((_, delta) => {
    // Track FPS smoothly every 500ms
    frameCount.current += 1;
    const now = performance.now();
    if (now - lastTime.current >= 500) {
      const currentFps = Math.min(60, Math.round((frameCount.current * 1000) / (now - lastTime.current)));
      onFpsUpdate(currentFps);
      frameCount.current = 0;
      lastTime.current = now;
    }

    if (isTransitioning.current && controlsRef.current) {
      const stepFactor = Math.min(1, delta * 5.5);
      camera.position.lerp(desiredPos.current, stepFactor);
      controlsRef.current.target.lerp(desiredTarget.current, stepFactor);
      controlsRef.current.update();

      if (
        camera.position.distanceTo(desiredPos.current) < 0.03 &&
        controlsRef.current.target.distanceTo(desiredTarget.current) < 0.03
      ) {
        isTransitioning.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      rotateSpeed={0.75}
      zoomSpeed={0.9}
      minDistance={1.0}
      maxDistance={20.0}
      maxPolarAngle={Math.PI * 0.85}
      autoRotate={autoOrbit}
      autoRotateSpeed={0.85}
      onStart={() => {
        isTransitioning.current = false;
      }}
    />
  );
};

export const MarineScene: React.FC<MarineSceneProps> = ({
  step,
  cleanupProgress,
  spillIntensity,
  waveEnergy,
  showCrossSection,
  show3DLabels,
  lang,
  isDark,
  drops,
  selectedStrain,
  nutrientBoost,
  enzymaticRate,
  cameraPreset,
  autoOrbit,
  cameraAction,
  onSurfaceInoculate,
  onFpsUpdate,
}) => {
  return (
    <div className="relative w-full h-full">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [7.8, 5.2, 8.2], fov: 44, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={[isDark ? '#030812' : '#e2f1f8']} />
        <fog attach="fog" args={[isDark ? '#030812' : '#e2f1f8', 16, 36]} />

        {/* Scientific Laboratory & Solar Photic Zone Lighting */}
        <ambientLight intensity={isDark ? 0.65 : 0.95} />
        <directionalLight
          position={[8, 15, 9]}
          intensity={isDark ? 1.45 : 1.75}
          color="#f8fafc"
        />
        <directionalLight
          position={[-7, -6, -5]}
          intensity={0.55}
          color="#0ea5e9"
        />
        <pointLight
          position={[0, -0.65, 0]}
          intensity={step === 3 ? 1.6 : 0.6}
          distance={5}
          color="#22d3ee"
        />

        <CameraRigController
          cameraPreset={cameraPreset}
          autoOrbit={autoOrbit}
          cameraAction={cameraAction}
          onFpsUpdate={onFpsUpdate}
        />

        {/* 3D Miniature Ocean Water Column & Crude Oil Slick */}
        <OceanWaterColumn
          step={step}
          cleanupProgress={cleanupProgress}
          spillIntensity={spillIntensity}
          waveEnergy={waveEnergy}
          showCrossSection={showCrossSection}
          show3DLabels={show3DLabels}
          lang={lang}
          isDark={isDark}
          inoculationCount={drops.length}
          onSurfaceClick={onSurfaceInoculate}
        />

        {/* Step 2 & 3 Bacterial Inoculation Dispersion System */}
        <BacterialInoculationSystem
          drops={drops}
          selectedStrain={selectedStrain}
          nutrientBoost={nutrientBoost}
          step={step}
          cleanupProgress={cleanupProgress}
        />

        {/* Step 3 & 4 Microscopic Enzymatic Biodegradation & Molecular Byproducts */}
        <MicroscopicBiodegradationView
          step={step}
          selectedStrain={selectedStrain}
          enzymaticRate={enzymaticRate}
          cleanupProgress={cleanupProgress}
          show3DLabels={show3DLabels}
          lang={lang}
        />
      </Canvas>
    </div>
  );
};
