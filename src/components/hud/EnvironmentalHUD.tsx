import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Biohazard,
  CheckCircle,
  Droplet,
  Flame,
  Gauge,
  Info,
  Waves,
  Wind,
} from 'lucide-react';
import { Language, SimulationStep, TelemetryData } from '../../types/simulation';
import { TRANSLATIONS } from '../../i18n/translations';

interface EnvironmentalHUDProps {
  telemetry: TelemetryData;
  step: SimulationStep;
  lang: Language;
  inoculated: boolean;
}

type MetricKey =
  | 'tph'
  | 'toxicity'
  | 'cod'
  | 'bod5'
  | 'do'
  | 'bacteria'
  | 'slickThickness'
  | 'biosurfactant';

export const EnvironmentalHUD: React.FC<EnvironmentalHUDProps> = ({
  telemetry,
  step,
  lang,
  inoculated,
}) => {
  const t = TRANSLATIONS[lang];
  const [activeTooltip, setActiveTooltip] = useState<MetricKey | null>(null);

  // Determine overall status badge
  const getStatusBadge = () => {
    if (telemetry.cleanupProgress >= 90) {
      return {
        label: t.hud.statusRestored,
        color:
          'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
        dot: 'bg-emerald-500',
        Icon: CheckCircle,
      };
    }
    if (step === 3 || (telemetry.cleanupProgress > 8 && telemetry.cleanupProgress < 90)) {
      return {
        label: t.hud.statusBiodegrading,
        color: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
        dot: 'bg-cyan-400 animate-ping',
        Icon: Activity,
      };
    }
    if (inoculated || step === 2) {
      return {
        label: t.hud.statusInoculated,
        color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
        dot: 'bg-blue-400 animate-pulse',
        Icon: Droplet,
      };
    }
    return {
      label: t.hud.statusContaminated,
      color: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
      dot: 'bg-rose-500 animate-pulse',
      Icon: AlertTriangle,
    };
  };

  const status = getStatusBadge();

  const metricsList: Array<{
    key: MetricKey;
    value: string;
    barPercent: number;
    barColor: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    {
      key: 'tph',
      value: telemetry.tph.toFixed(0),
      barPercent: Math.min(100, (telemetry.tph / 1450) * 100),
      barColor:
        telemetry.tph > 600
          ? 'bg-rose-500'
          : telemetry.tph > 120
          ? 'bg-amber-500'
          : 'bg-emerald-500',
      icon: Flame,
    },
    {
      key: 'toxicity',
      value: telemetry.toxicity.toFixed(1),
      barPercent: Math.min(100, (telemetry.toxicity / 95) * 100),
      barColor:
        telemetry.toxicity > 50
          ? 'bg-rose-500'
          : telemetry.toxicity > 15
          ? 'bg-amber-500'
          : 'bg-emerald-500',
      icon: Biohazard,
    },
    {
      key: 'cod',
      value: telemetry.cod.toFixed(0),
      barPercent: Math.min(100, (telemetry.cod / 2400) * 100),
      barColor:
        telemetry.cod > 1000
          ? 'bg-amber-500'
          : telemetry.cod > 250
          ? 'bg-cyan-500'
          : 'bg-emerald-500',
      icon: Gauge,
    },
    {
      key: 'bod5',
      value: telemetry.bod5.toFixed(0),
      barPercent: Math.min(100, (telemetry.bod5 / 950) * 100),
      barColor:
        telemetry.bod5 > 450
          ? 'bg-amber-500'
          : telemetry.bod5 > 120
          ? 'bg-cyan-500'
          : 'bg-emerald-500',
      icon: Activity,
    },
    {
      key: 'do',
      value: telemetry.dissolvedOxygen.toFixed(2),
      barPercent: Math.min(100, (telemetry.dissolvedOxygen / 8.5) * 100),
      barColor:
        telemetry.dissolvedOxygen < 3.5
          ? 'bg-rose-500'
          : telemetry.dissolvedOxygen < 5.5
          ? 'bg-amber-500'
          : 'bg-emerald-500',
      icon: Wind,
    },
    {
      key: 'bacteria',
      value: `10^${telemetry.bacterialDensityLog.toFixed(1)}`,
      barPercent: Math.min(100, ((telemetry.bacterialDensityLog - 3) / 6.0) * 100),
      barColor: 'bg-cyan-500',
      icon: Droplet,
    },
    {
      key: 'slickThickness',
      value: telemetry.slickThickness.toFixed(2),
      barPercent: Math.min(100, (telemetry.slickThickness / 4.5) * 100),
      barColor: telemetry.slickThickness > 1.0 ? 'bg-amber-500' : 'bg-emerald-500',
      icon: Waves,
    },
    {
      key: 'biosurfactant',
      value: telemetry.biosurfactantIndex.toFixed(0),
      barPercent: Math.min(100, telemetry.biosurfactantIndex),
      barColor: 'bg-teal-500',
      icon: Activity,
    },
  ];

  return (
    <aside className="pointer-events-auto w-full sm:w-80 lg:w-[330px] rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl p-3.5 transition-colors duration-300 flex flex-col gap-2.5 max-h-[calc(100vh-180px)] overflow-y-auto">
      {/* Header */}
      <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200/70 dark:border-slate-800/80">
        <div>
          <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white tracking-tight">
            {t.hud.telemetryTitle}
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {t.hud.telemetrySubtitle}
          </p>
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-mono font-bold border shrink-0 ${status.color}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
          <span>{status.label}</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
        {metricsList.map((item) => {
          const meta = t.hud.metrics[item.key];
          const Icon = item.icon;
          const isOpen = activeTooltip === item.key;

          return (
            <div
              key={item.key}
              className="relative p-2.5 rounded-xl bg-slate-50/90 dark:bg-slate-800/55 border border-slate-200/60 dark:border-slate-700/50 hover:border-cyan-500/40 transition-all"
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span className="text-[11px] font-medium text-slate-700 dark:text-slate-300 truncate">
                    {meta.label}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTooltip(isOpen ? null : item.key)}
                  onMouseEnter={() => setActiveTooltip(item.key)}
                  onMouseLeave={() => setActiveTooltip(null)}
                  className="text-slate-400 hover:text-cyan-500 dark:hover:text-cyan-300 transition-colors p-0.5"
                  aria-label={meta.label}
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-baseline justify-between gap-2 mb-1.5">
                <span className="text-sm sm:text-base font-mono font-bold text-slate-900 dark:text-white">
                  {item.value}
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                  {meta.unit}
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700/80 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${item.barColor}`}
                  style={{ width: `${Math.max(3, item.barPercent)}%` }}
                />
              </div>

              {/* Scientific Metric Tooltip */}
              {isOpen && (
                <div className="mt-2 p-2 rounded-lg bg-slate-900 dark:bg-slate-950 text-slate-200 text-[11px] leading-relaxed border border-cyan-500/30 shadow-md">
                  {meta.tooltip}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
