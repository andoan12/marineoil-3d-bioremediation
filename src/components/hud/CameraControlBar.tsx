import React from 'react';
import {
  Camera,
  Compass,
  Microscope,
  Orbit,
  RotateCcw,
  RotateCw,
  Waves,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { CameraPreset, Language } from '../../types/simulation';
import { TRANSLATIONS } from '../../i18n/translations';
import { CameraActionTrigger } from '../canvas/MarineScene';

interface CameraControlBarProps {
  lang: Language;
  cameraPreset: CameraPreset;
  onSelectPreset: (preset: CameraPreset) => void;
  autoOrbit: boolean;
  onToggleAutoOrbit: () => void;
  onTriggerCameraAction: (type: CameraActionTrigger['type']) => void;
}

export const CameraControlBar: React.FC<CameraControlBarProps> = ({
  lang,
  cameraPreset,
  onSelectPreset,
  autoOrbit,
  onToggleAutoOrbit,
  onTriggerCameraAction,
}) => {
  const t = TRANSLATIONS[lang];

  const presets: Array<{
    id: CameraPreset;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'overview', label: t.camera.overview, icon: Camera },
    { id: 'surface', label: t.camera.surface, icon: Waves },
    { id: 'microscopic', label: t.camera.microscopic, icon: Microscope },
    { id: 'top', label: t.camera.topDown, icon: Compass },
  ];

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-1.5 z-20">
      <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl">
        {/* Camera Preset Selector */}
        <div className="flex items-center gap-1 pr-1.5 border-r border-slate-200 dark:border-slate-700">
          {presets.map((p) => {
            const Icon = p.icon;
            const active = cameraPreset === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => onSelectPreset(p.id)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Camera Manipulation Controls (Rotate, Zoom, Auto-Orbit, Reset) */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onTriggerCameraAction('rotateLeft')}
            title={t.camera.rotateLeft}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onTriggerCameraAction('rotateRight')}
            title={t.camera.rotateRight}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onTriggerCameraAction('zoomIn')}
            title={t.camera.zoomIn}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onTriggerCameraAction('zoomOut')}
            title={t.camera.zoomOut}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onToggleAutoOrbit}
            title={t.camera.autoOrbit}
            className={`px-2 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 transition-all ${
              autoOrbit
                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Orbit className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.camera.autoOrbit}</span>
          </button>
          <button
            type="button"
            onClick={() => onTriggerCameraAction('reset')}
            title={t.camera.resetView}
            className="px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {t.camera.resetView}
          </button>
        </div>
      </div>

      {/* Subtle Interaction Hint */}
      <div className="hidden sm:block text-[11px] px-3 py-0.5 rounded-full bg-slate-900/65 text-slate-200 backdrop-blur-md">
        {t.camera.interactionHint}
      </div>
    </div>
  );
};
