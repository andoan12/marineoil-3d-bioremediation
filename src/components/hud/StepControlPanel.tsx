import React from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Droplets,
  FlaskConical,
  Layers,
  Microscope,
  Pause,
  Play,
  RotateCcw,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  Language,
  SimulationStep,
  StrainId,
  TelemetryData,
} from '../../types/simulation';
import { BACTERIAL_STRAINS } from '../../data/strains';
import { TRANSLATIONS } from '../../i18n/translations';

interface StepControlPanelProps {
  step: SimulationStep;
  onSelectStep: (step: SimulationStep) => void;
  lang: Language;
  telemetry: TelemetryData;
  // Step 1 props
  spillIntensity: number;
  onChangeSpillIntensity: (val: number) => void;
  waveEnergy: number;
  onChangeWaveEnergy: (val: number) => void;
  showCrossSection: boolean;
  onToggleCrossSection: () => void;
  // Step 2 props
  selectedStrain: StrainId;
  onSelectStrain: (strain: StrainId) => void;
  nutrientBoost: number;
  onChangeNutrientBoost: (val: number) => void;
  inoculationCount: number;
  onReleaseBacteria: () => void;
  // Step 3 props
  enzymaticRate: number;
  onChangeEnzymaticRate: (val: number) => void;
  // Step 4 props
  cleanupProgress: number;
  onChangeCleanupProgress: (val: number) => void;
  isPlayingRestoration: boolean;
  onTogglePlayRestoration: () => void;
  simSpeed: number;
  onChangeSimSpeed: (speed: number) => void;
  onResetSimulation: () => void;
}

export const StepControlPanel: React.FC<StepControlPanelProps> = ({
  step,
  onSelectStep,
  lang,
  telemetry,
  spillIntensity,
  onChangeSpillIntensity,
  waveEnergy,
  onChangeWaveEnergy,
  showCrossSection,
  onToggleCrossSection,
  selectedStrain,
  onSelectStrain,
  nutrientBoost,
  onChangeNutrientBoost,
  inoculationCount,
  onReleaseBacteria,
  enzymaticRate,
  onChangeEnzymaticRate,
  cleanupProgress,
  onChangeCleanupProgress,
  isPlayingRestoration,
  onTogglePlayRestoration,
  simSpeed,
  onChangeSimSpeed,
  onResetSimulation,
}) => {
  const t = TRANSLATIONS[lang];
  const stepInfo = t.steps[step];
  const currentStrain = BACTERIAL_STRAINS[selectedStrain];

  return (
    <section className="pointer-events-auto w-full sm:w-96 lg:w-[395px] rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-4 transition-colors duration-300 flex flex-col gap-3 max-h-[calc(100vh-180px)] overflow-y-auto">
      {/* Phase Badge & Title */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 mb-1.5">
          {stepInfo.badge}
        </div>
        <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white leading-snug">
          {stepInfo.title}
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
          {stepInfo.description}
        </p>
      </div>

      {/* Scientific Mechanism Highlight Box */}
      <div className="p-2.5 rounded-xl bg-slate-100/90 dark:bg-slate-800/70 border border-slate-200/70 dark:border-slate-700/60">
        <div className="text-[11px] font-semibold text-cyan-700 dark:text-cyan-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 shrink-0" />
          <span>{stepInfo.mechanismTitle}</span>
        </div>
        <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
          {stepInfo.mechanismDetail}
        </p>
      </div>

      {/* STEP 1 CONTROLS: OIL SPILL OVERVIEW */}
      {step === 1 && (
        <div className="space-y-3 pt-1 border-t border-slate-200/70 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.controls.step1.panelTitle}
          </div>

          {/* Spill Intensity Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {t.controls.step1.spillIntensity}
              </span>
              <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
                {Math.round(spillIntensity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.0}
              step={0.05}
              value={spillIntensity}
              onChange={(e) => onChangeSpillIntensity(parseFloat(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          {/* Wave Hydrodynamics Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {t.controls.step1.waveEnergy}
              </span>
              <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                {(waveEnergy * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0.2}
              max={1.5}
              step={0.05}
              value={waveEnergy}
              onChange={(e) => onChangeWaveEnergy(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          {/* Physical Slick Properties Readout */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {t.controls.step1.surfaceCoverage}
              </div>
              <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                {Math.round(spillIntensity * 88)}%
              </div>
            </div>
            <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {t.controls.step1.viscosityDamping}
              </div>
              <div className="text-sm font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                58% (High)
              </div>
            </div>
          </div>

          {/* Toggle Cross-Section Boundary Ring */}
          <button
            type="button"
            onClick={onToggleCrossSection}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              showCrossSection
                ? 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/40'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{t.controls.step1.inspectCrossSection}</span>
          </button>

          {/* Proceed to Step 2 CTA */}
          <button
            type="button"
            onClick={() => onSelectStep(2)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
          >
            <FlaskConical className="w-4 h-4" />
            <span>{t.controls.step1.proceedCta}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 2 CONTROLS: BACTERIAL INOCULATION */}
      {step === 2 && (
        <div className="space-y-3 pt-1 border-t border-slate-200/70 dark:border-slate-800">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {t.controls.step2.selectStrain}
          </div>

          {/* Strain Selector Cards */}
          <div className="grid grid-cols-1 gap-1.5">
            {(Object.keys(BACTERIAL_STRAINS) as StrainId[]).map((id) => {
              const st = BACTERIAL_STRAINS[id];
              const isSelected = selectedStrain === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelectStrain(id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-cyan-500/10 dark:bg-cyan-500/15 border-cyan-500/60 shadow-sm'
                      : 'bg-slate-50/80 dark:bg-slate-800/50 border-slate-200/70 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold italic text-slate-900 dark:text-white">
                      {st.scientificName}
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: st.color }}
                    />
                  </div>
                  <div className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                    {st.morphology[lang]}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Strain Biochemical Details */}
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 space-y-1 text-[11px]">
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t.controls.step2.targetLabel}:{' '}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {currentStrain.targetHydrocarbons[lang]}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t.controls.step2.enzymeLabel}:{' '}
              </span>
              <span className="text-cyan-700 dark:text-cyan-300 font-mono">
                {currentStrain.keyEnzyme[lang]}
              </span>
            </div>
            <div>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {t.controls.step2.surfactantLabel}:{' '}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                {currentStrain.biosurfactant[lang]}
              </span>
            </div>
          </div>

          {/* Nutrient Biostimulation Boost Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {t.controls.step2.nutrientBoost}
              </span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                {nutrientBoost.toFixed(1)}×
              </span>
            </div>
            <input
              type="range"
              min={1.0}
              max={2.0}
              step={0.1}
              value={nutrientBoost}
              onChange={(e) => onChangeNutrientBoost(parseFloat(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
            <p className="text-[10px] text-slate-500 dark:text-slate-400">
              {t.controls.step2.nutrientTooltip}
            </p>
          </div>

          {/* Release Bacterial Inoculum Action Button */}
          <button
            type="button"
            onClick={onReleaseBacteria}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 active:scale-[0.99] transition-all"
          >
            <Droplets className="w-4 h-4" />
            <span>
              {inoculationCount === 0
                ? t.controls.step2.releaseButton
                : t.controls.step2.releaseAnotherDose}
            </span>
          </button>

          <div className="flex items-center justify-between text-[11px] px-1">
            <span className="text-slate-500 dark:text-slate-400">
              {t.controls.step2.dosesReleased}:
            </span>
            <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">
              {inoculationCount} plumes ({inoculationCount * 48}×10⁶ CFU)
            </span>
          </div>

          <div className="text-[11px] text-cyan-700 dark:text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-2.5 py-1.5">
            {t.controls.step2.clickSurfaceHint}
          </div>

          {inoculationCount > 0 && (
            <button
              type="button"
              onClick={() => onSelectStep(3)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              <Microscope className="w-4 h-4" />
              <span>{t.controls.step2.proceedToMicro}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* STEP 3 CONTROLS: ENZYMATIC BIODEGRADATION ACTION */}
      {step === 3 && (
        <div className="space-y-3 pt-1 border-t border-slate-200/70 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <Microscope className="w-3.5 h-3.5" />
              {t.controls.step3.microscopeActive}
            </span>
          </div>

          {/* Chemical Reaction Equation Box */}
          <div className="p-2.5 rounded-xl bg-slate-900 text-white border border-cyan-500/40 shadow-inner">
            <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
              {t.controls.step3.reactionEquationTitle}
            </div>
            <div className="text-[11px] font-mono font-semibold text-amber-200 leading-relaxed break-words">
              {t.controls.step3.reactionEquationSub}
            </div>
          </div>

          {/* Enzymatic Turnover / Aeration Rate Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                {t.controls.step3.enzymaticActivity}
              </span>
              <span className="font-mono font-semibold text-cyan-600 dark:text-cyan-400">
                {(enzymaticRate * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={2.0}
              step={0.1}
              value={enzymaticRate}
              onChange={(e) => onChangeEnzymaticRate(parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
            />
          </div>

          {/* Byproducts & Biofilm Live Counters */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              {t.controls.step3.byproductsTitle}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-600 dark:text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  {t.controls.step3.co2Released}
                </div>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {telemetry.co2Produced.toFixed(1)} <span className="text-[10px] font-normal">mmol/L</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/25">
                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-sky-600 dark:text-sky-300">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  {t.controls.step3.h2oProduced}
                </div>
                <div className="text-sm font-mono font-bold text-slate-900 dark:text-white mt-1">
                  {telemetry.h2oProduced.toFixed(1)} <span className="text-[10px] font-normal">mmol/L</span>
                </div>
              </div>
            </div>
          </div>

          {/* Proceed to Step 4 Restoration CTA */}
          <button
            type="button"
            onClick={() => onSelectStep(4)}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.controls.step3.proceedToCleanup}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP 4 CONTROLS: CLEANUP PROGRESS & RESTORATION */}
      {step === 4 && (
        <div className="space-y-3 pt-1 border-t border-slate-200/70 dark:border-slate-800">
          {/* Dynamic Bioremediation Progress Bar */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/70 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {t.controls.step4.progressLabel}
              </span>
              <span className="text-base font-mono font-extrabold text-emerald-600 dark:text-emerald-400">
                {cleanupProgress.toFixed(1)}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-cyan-500 to-emerald-500 transition-all duration-150"
                style={{ width: `${Math.max(2, cleanupProgress)}%` }}
              />
            </div>

            {/* Manual Timeline Scrubber */}
            <div className="pt-1">
              <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                <span>{t.controls.step4.scrubTimeline}</span>
                <span className="font-mono">0% → 100%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                step={0.5}
                value={cleanupProgress}
                onChange={(e) => onChangeCleanupProgress(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>
          </div>

          {/* Play / Pause & Speed Multipliers */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onTogglePlayRestoration}
              className={`flex-1 py-2 px-3 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isPlayingRestoration
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-500'
              }`}
            >
              {isPlayingRestoration ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>{t.controls.step4.pauseSimulate}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{t.controls.step4.autoSimulate}</span>
                </>
              )}
            </button>

            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              {[1, 2, 4].map((spd) => (
                <button
                  key={spd}
                  type="button"
                  onClick={() => onChangeSimSpeed(spd)}
                  className={`px-2 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                    simSpeed === spd
                      ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  {spd}×
                </button>
              ))}
            </div>
          </div>

          {/* Restoration Summary Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {t.controls.step4.waterClarity}
              </div>
              <div className="text-sm font-mono font-bold text-cyan-600 dark:text-cyan-400 mt-0.5">
                {(12 + cleanupProgress * 0.87).toFixed(1)}%
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/50">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">
                {t.controls.step4.oilRemoved}
              </div>
              <div className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {(cleanupProgress * 0.994).toFixed(1)}%
              </div>
            </div>
          </div>

          {cleanupProgress >= 95 && (
            <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>{t.controls.step4.restoredCompleteMsg}</span>
            </div>
          )}

          {/* Reset Simulation Button */}
          <button
            type="button"
            onClick={onResetSimulation}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.controls.step4.resetSpill}</span>
          </button>
        </div>
      )}

      {/* Step Footer Navigation (Prev / Next) */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-200/70 dark:border-slate-800/80 mt-auto">
        <button
          type="button"
          disabled={step === 1}
          onClick={() => onSelectStep((step - 1) as SimulationStep)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-35 disabled:pointer-events-none transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{t.controls.prevStep}</span>
        </button>

        <span className="text-[11px] font-mono text-slate-400">
          {step} / 4
        </span>

        <button
          type="button"
          disabled={step === 4}
          onClick={() => onSelectStep((step + 1) as SimulationStep)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/10 disabled:opacity-35 disabled:pointer-events-none transition-colors"
        >
          <span>{t.controls.nextStep}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
