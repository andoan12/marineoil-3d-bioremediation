import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CameraPreset,
  InoculationDrop,
  Language,
  SimulationStep,
  StrainId,
  TelemetryData,
  ThemeMode,
} from './types/simulation';
import { BACTERIAL_STRAINS } from './data/strains';
import { CameraActionTrigger, MarineScene } from './components/canvas/MarineScene';
import { TopNavBar } from './components/hud/TopNavBar';
import { StepProgressTracker } from './components/hud/StepProgressTracker';
import { EnvironmentalHUD } from './components/hud/EnvironmentalHUD';
import { StepControlPanel } from './components/hud/StepControlPanel';
import { CameraControlBar } from './components/hud/CameraControlBar';

export const App: React.FC = () => {
  // Language & Theme State
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('biomaris_lang');
    return saved === 'vi' || saved === 'en' ? saved : 'en';
  });

  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('biomaris_theme');
    return saved === 'light' || saved === 'dark' || saved === 'system' ? saved : 'dark';
  });

  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : true
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const isDark = useMemo(() => {
    return themeMode === 'system' ? systemPrefersDark : themeMode === 'dark';
  }, [themeMode, systemPrefersDark]);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('biomaris_theme', themeMode);
  }, [isDark, themeMode]);

  const handleChangeLang = useCallback((newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('biomaris_lang', newLang);
  }, []);

  // Core 4-Step Simulation State
  const [step, setStep] = useState<SimulationStep>(1);
  const [spillIntensity, setSpillIntensity] = useState<number>(0.85);
  const [waveEnergy, setWaveEnergy] = useState<number>(0.75);
  const [showCrossSection, setShowCrossSection] = useState<boolean>(false);
  const [show3DLabels, setShow3DLabels] = useState<boolean>(true);

  // Step 2: Bacterial Inoculation State
  const [selectedStrain, setSelectedStrain] = useState<StrainId>('alcanivorax');
  const [nutrientBoost, setNutrientBoost] = useState<number>(1.4);
  const [drops, setDrops] = useState<InoculationDrop[]>([]);
  const sceneClockRef = useRef<number>(0);

  // Step 3: Enzymatic Biodegradation State
  const [enzymaticRate, setEnzymaticRate] = useState<number>(1.2);

  // Step 4: Cleanup Progress & Restoration State (0 to 100%)
  const [cleanupProgress, setCleanupProgress] = useState<number>(0);
  const [isPlayingRestoration, setIsPlayingRestoration] = useState<boolean>(false);
  const [simSpeed, setSimSpeed] = useState<number>(1);

  // Camera & Performance State
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [autoOrbit, setAutoOrbit] = useState<boolean>(false);
  const [cameraAction, setCameraAction] = useState<CameraActionTrigger | null>(null);
  const [fps, setFps] = useState<number>(60);

  // Keep a lightweight clock reference for drop timestamps matching R3F elapsed time
  useEffect(() => {
    const start = performance.now();
    const timer = window.setInterval(() => {
      sceneClockRef.current = (performance.now() - start) / 1000;
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  // Helper to spawn a bacterial inoculum plume
  const spawnInoculationDrop = useCallback(
    (position?: [number, number, number]) => {
      const targetPos: [number, number, number] = position ?? [
        (Math.random() - 0.5) * 2.8,
        0,
        (Math.random() - 0.5) * 2.8,
      ];
      const newDrop: InoculationDrop = {
        id: `drop-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        position: targetPos,
        timestamp: sceneClockRef.current,
        strainId: selectedStrain,
      };
      setDrops((prev) => [...prev, newDrop]);
    },
    [selectedStrain]
  );

  // Step transition handler with intelligent camera framing & automatic setup
  const handleSelectStep = useCallback(
    (targetStep: SimulationStep) => {
      setStep(targetStep);

      if (targetStep === 1) {
        setCameraPreset('overview');
        setIsPlayingRestoration(false);
      } else if (targetStep === 2) {
        setCameraPreset('surface');
        setIsPlayingRestoration(false);
      } else if (targetStep === 3) {
        // Ensure at least one bacterial inoculum plume is present when inspecting Step 3
        if (drops.length === 0) {
          spawnInoculationDrop([0, 0, 0]);
        }
        setCameraPreset('microscopic');
        setIsPlayingRestoration(false);
      } else if (targetStep === 4) {
        if (drops.length === 0) {
          spawnInoculationDrop([0, 0, 0]);
        }
        setCameraPreset('overview');
        setIsPlayingRestoration(true);
      }
    },
    [drops.length, spawnInoculationDrop]
  );

  // Gentle enzymatic progression during Step 3 (up to ~32% emulsification/mineralization)
  // and full cleanup progression during Step 4 (up to 100% restoration)
  useEffect(() => {
    const strainMultiplier = BACTERIAL_STRAINS[selectedStrain].degradationRateMultiplier;

    if (step === 3) {
      const interval = window.setInterval(() => {
        setCleanupProgress((prev) => {
          if (prev >= 32) return prev;
          return Math.min(32, prev + 0.18 * enzymaticRate * strainMultiplier);
        });
      }, 100);
      return () => window.clearInterval(interval);
    }

    if (step === 4 && isPlayingRestoration) {
      const interval = window.setInterval(() => {
        setCleanupProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingRestoration(false);
            return 100;
          }
          const delta = 0.35 * simSpeed * enzymaticRate * strainMultiplier * (nutrientBoost * 0.8);
          return Math.min(100, prev + delta);
        });
      }, 60);
      return () => window.clearInterval(interval);
    }
  }, [step, isPlayingRestoration, simSpeed, enzymaticRate, selectedStrain, nutrientBoost]);

  // Reset entire simulation back to Step 1 contaminated state
  const handleResetSimulation = useCallback(() => {
    setIsPlayingRestoration(false);
    setCleanupProgress(0);
    setDrops([]);
    setStep(1);
    setCameraPreset('overview');
  }, []);

  // Compute Real-Time Environmental & Bioremediation Telemetry
  const telemetry: TelemetryData = useMemo(() => {
    const cleanFraction = cleanupProgress / 100;
    const inoculated = drops.length > 0;
    const strainMult = BACTERIAL_STRAINS[selectedStrain].degradationRateMultiplier;

    // Initial baseline at 0% cleanup scaled by spillIntensity
    const baseTph = 1280 * spillIntensity;
    const tph = Math.max(2.4, baseTph * Math.pow(1 - cleanFraction * 0.992, 1.25));

    const baseToxicity = 84 * spillIntensity;
    const toxicity = Math.max(0.4, baseToxicity * Math.pow(1 - cleanFraction * 0.995, 1.35));

    const baseCod = 2150 * spillIntensity;
    const cod = Math.max(18, baseCod * (1 - cleanFraction * 0.96));

    // BOD5 rises slightly upon bacterial inoculation/emulsification before dropping sharply as oil is mineralized
    const bioActivityBump = inoculated ? Math.sin(cleanFraction * Math.PI) * 140 : 0;
    const baseBod5 = 680 * spillIntensity;
    const bod5 = Math.max(6, baseBod5 * (1 - cleanFraction * 0.97) + bioActivityBump);

    // Dissolved Oxygen: suppressed under thick oil slick (3.1 mg/L), dips slightly during peak aerobic oxidation, recovers to 7.9 mg/L
    const aerobicDip = inoculated ? Math.sin(cleanFraction * Math.PI) * 0.55 : 0;
    const dissolvedOxygen = Math.min(
      8.2,
      Math.max(2.6, 3.1 + cleanFraction * 4.85 - aerobicDip)
    );

    // Bacterial Density (log10 CFU/mL): baseline marine 3.2 -> blooms up to 8.6 during Step 2/3 -> settles to 4.1 at 100% cleanup
    let bacterialDensityLog = 3.2;
    if (inoculated) {
      const doseFactor = Math.min(1.4, 0.55 + drops.length * 0.22);
      const bloomBell = Math.sin(Math.min(0.92, Math.max(0.18, cleanFraction)) * Math.PI);
      bacterialDensityLog =
        4.2 + doseFactor * 2.2 * nutrientBoost * strainMult * (0.45 + 0.55 * bloomBell);
      if (cleanFraction > 0.92) {
        bacterialDensityLog = 4.1 + (1 - cleanFraction) * 20;
      }
    }

    // Biosurfactant Emulsification Index (E24 %)
    const biosurfactantIndex = inoculated
      ? Math.min(
          98,
          Math.max(18, (24 + drops.length * 14) * nutrientBoost * (1 - cleanFraction * 0.35))
        )
      : 4;

    const slickThickness = Math.max(0, 3.8 * spillIntensity * (1 - cleanFraction));
    const co2Produced = cleanFraction * 46.4 * spillIntensity;
    const h2oProduced = cleanFraction * 49.3 * spillIntensity;

    return {
      tph,
      toxicity,
      cod,
      bod5,
      dissolvedOxygen,
      bacterialDensityLog,
      biosurfactantIndex,
      slickThickness,
      co2Produced,
      h2oProduced,
      cleanupProgress,
    };
  }, [cleanupProgress, drops.length, nutrientBoost, selectedStrain, spillIntensity]);

  const handleTriggerCameraAction = useCallback((type: CameraActionTrigger['type']) => {
    setCameraAction({ type, nonce: Date.now() + Math.random() });
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden flex flex-col bg-slate-100 dark:bg-slate-950 select-none">
      {/* Fullscreen Interactive 3D WebGL Canvas */}
      <div className="absolute inset-0 z-0">
        <MarineScene
          step={step}
          cleanupProgress={cleanupProgress}
          spillIntensity={spillIntensity}
          waveEnergy={waveEnergy}
          showCrossSection={showCrossSection}
          show3DLabels={show3DLabels}
          lang={lang}
          isDark={isDark}
          drops={drops}
          selectedStrain={selectedStrain}
          nutrientBoost={nutrientBoost}
          enzymaticRate={enzymaticRate}
          cameraPreset={cameraPreset}
          autoOrbit={autoOrbit}
          cameraAction={cameraAction}
          onSurfaceInoculate={(pt) => spawnInoculationDrop(pt)}
          onFpsUpdate={setFps}
        />
      </div>

      {/* Top Navigation & Theme/Language Bar */}
      <TopNavBar
        lang={lang}
        onChangeLang={handleChangeLang}
        themeMode={themeMode}
        onChangeTheme={setThemeMode}
        fps={fps}
        show3DLabels={show3DLabels}
        onToggle3DLabels={() => setShow3DLabels((prev) => !prev)}
      />

      {/* 4-Step Interactive Progress Tracker */}
      <StepProgressTracker
        currentStep={step}
        onSelectStep={handleSelectStep}
        lang={lang}
        inoculated={drops.length > 0}
        cleanupProgress={cleanupProgress}
      />

      {/* Main HUD Overlay Workspace (Left Telemetry Panel + Right Step Control Panel) */}
      <main className="pointer-events-none flex-1 w-full px-3 sm:px-5 py-2 flex flex-col sm:flex-row items-start justify-between gap-3 overflow-hidden z-10">
        <EnvironmentalHUD
          telemetry={telemetry}
          step={step}
          lang={lang}
          inoculated={drops.length > 0}
        />

        <StepControlPanel
          step={step}
          onSelectStep={handleSelectStep}
          lang={lang}
          telemetry={telemetry}
          spillIntensity={spillIntensity}
          onChangeSpillIntensity={setSpillIntensity}
          waveEnergy={waveEnergy}
          onChangeWaveEnergy={setWaveEnergy}
          showCrossSection={showCrossSection}
          onToggleCrossSection={() => setShowCrossSection((prev) => !prev)}
          selectedStrain={selectedStrain}
          onSelectStrain={setSelectedStrain}
          nutrientBoost={nutrientBoost}
          onChangeNutrientBoost={setNutrientBoost}
          inoculationCount={drops.length}
          onReleaseBacteria={() => spawnInoculationDrop()}
          enzymaticRate={enzymaticRate}
          onChangeEnzymaticRate={setEnzymaticRate}
          cleanupProgress={cleanupProgress}
          onChangeCleanupProgress={(val) => {
            setIsPlayingRestoration(false);
            setCleanupProgress(val);
          }}
          isPlayingRestoration={isPlayingRestoration}
          onTogglePlayRestoration={() => {
            if (cleanupProgress >= 100) {
              setCleanupProgress(0);
              setIsPlayingRestoration(true);
            } else {
              setIsPlayingRestoration((prev) => !prev);
            }
          }}
          simSpeed={simSpeed}
          onChangeSimSpeed={setSimSpeed}
          onResetSimulation={handleResetSimulation}
        />
      </main>

      {/* Bottom Floating Camera Presets & Orbit Control Bar */}
      <footer className="pointer-events-none w-full pb-3 px-3 flex justify-center z-20">
        <CameraControlBar
          lang={lang}
          cameraPreset={cameraPreset}
          onSelectPreset={setCameraPreset}
          autoOrbit={autoOrbit}
          onToggleAutoOrbit={() => setAutoOrbit((prev) => !prev)}
          onTriggerCameraAction={handleTriggerCameraAction}
        />
      </footer>
    </div>
  );
};

export default App;
