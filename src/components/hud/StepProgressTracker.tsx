import React, { useState } from 'react';
import {
  CheckCircle2,
  Droplets,
  FlaskConical,
  Info,
  Microscope,
  Sparkles,
} from 'lucide-react';
import { Language, SimulationStep } from '../../types/simulation';
import { TRANSLATIONS } from '../../i18n/translations';

interface StepProgressTrackerProps {
  currentStep: SimulationStep;
  onSelectStep: (step: SimulationStep) => void;
  lang: Language;
  inoculated: boolean;
  cleanupProgress: number;
}

const STEP_ICONS: Record<SimulationStep, React.ComponentType<{ className?: string }>> = {
  1: Droplets,
  2: FlaskConical,
  3: Microscope,
  4: Sparkles,
};

export const StepProgressTracker: React.FC<StepProgressTrackerProps> = ({
  currentStep,
  onSelectStep,
  lang,
  cleanupProgress,
}) => {
  const t = TRANSLATIONS[lang];
  const [tooltipStep, setTooltipStep] = useState<SimulationStep | null>(null);

  const steps: SimulationStep[] = [1, 2, 3, 4];

  return (
    <div className="pointer-events-auto relative w-full max-w-4xl mx-auto px-3 pt-2 z-20">
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2.5 p-1.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-lg">
        {steps.map((s) => {
          const Icon = STEP_ICONS[s];
          const isActive = currentStep === s;
          const isCompleted = currentStep > s || (s === 4 && cleanupProgress >= 99);
          const stepInfo = t.steps[s];

          return (
            <div key={s} className="relative">
              <div
                onClick={() => onSelectStep(s)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') onSelectStep(s);
                }}
                className={`group w-full flex items-center justify-between gap-1.5 px-2.5 py-2 rounded-xl text-left transition-all cursor-pointer border ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/15 dark:from-cyan-500/20 dark:to-blue-500/20 border-cyan-500/50 text-slate-900 dark:text-white shadow-sm'
                    : isCompleted
                    ? 'bg-emerald-500/5 dark:bg-emerald-500/10 border-emerald-500/25 text-slate-700 dark:text-slate-200 hover:bg-emerald-500/15'
                    : 'bg-slate-50/70 dark:bg-slate-800/50 border-transparent text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                        : isCompleted
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-slate-200/70 dark:bg-slate-700/70 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isCompleted && !isActive ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      0{s}
                    </div>
                    <div className="text-xs font-semibold truncate">
                      {stepInfo.shortTitle}
                    </div>
                  </div>
                </div>

                {/* Scientific Tooltip Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltipStep(tooltipStep === s ? null : s);
                  }}
                  onMouseEnter={() => setTooltipStep(s)}
                  onMouseLeave={() => setTooltipStep(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors shrink-0"
                  aria-label="Step scientific info"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Scientific Phase Tooltip Popover */}
              {tooltipStep === s && (
                <div className="absolute left-0 right-0 sm:w-72 top-full mt-2 p-3 rounded-xl bg-slate-900/95 dark:bg-slate-950/95 text-white border border-cyan-500/40 shadow-xl backdrop-blur-md z-40 pointer-events-none">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 mb-1">
                    {stepInfo.badge}
                  </div>
                  <div className="text-xs font-bold mb-1">{stepInfo.title}</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                    {stepInfo.tooltip}
                  </p>
                  <div className="pt-1.5 border-t border-slate-800">
                    <div className="text-[10px] font-semibold text-emerald-400">
                      {stepInfo.mechanismTitle}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-normal mt-0.5">
                      {stepInfo.mechanismDetail}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
