import React from 'react';
import {
  Activity,
  Eye,
  EyeOff,
  Globe,
  Microscope,
  Monitor,
  Moon,
  Sun,
} from 'lucide-react';
import { Language, ThemeMode } from '../../types/simulation';
import { TRANSLATIONS } from '../../i18n/translations';

interface TopNavBarProps {
  lang: Language;
  onChangeLang: (lang: Language) => void;
  themeMode: ThemeMode;
  onChangeTheme: (mode: ThemeMode) => void;
  fps: number;
  show3DLabels: boolean;
  onToggle3DLabels: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  lang,
  onChangeLang,
  themeMode,
  onChangeTheme,
  fps,
  show3DLabels,
  onToggle3DLabels,
}) => {
  const t = TRANSLATIONS[lang];

  return (
    <header className="pointer-events-auto w-full px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-300 z-30">
      {/* Left: Brand & Laboratory Identity */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
          <Microscope className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              {t.appTitle}
            </h1>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold tracking-wider bg-cyan-500/10 text-cyan-700 dark:bg-cyan-400/15 dark:text-cyan-300 border border-cyan-500/20">
              {t.labBadge}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 leading-tight">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Right: Telemetry FPS, 3D Callouts Toggle, Dual-Language Switch, Theme Selector */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Real-time 60 FPS Performance Indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/70 text-xs font-mono">
          <Activity className="w-3.5 h-3.5 text-emerald-500" />
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            {fps}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-[10px]">
            {t.fpsLabel}
          </span>
        </div>

        {/* Toggle 3D Callout Labels */}
        <button
          type="button"
          onClick={onToggle3DLabels}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
            show3DLabels
              ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
          }`}
          title={t.labels3d}
        >
          {show3DLabels ? (
            <Eye className="w-3.5 h-3.5" />
          ) : (
            <EyeOff className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline">{t.labels3d}</span>
        </button>

        {/* Dual-Language Toggle Switch (English / Vietnamese) */}
        <div
          className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          role="group"
          aria-label="Language switcher"
        >
          <Globe className="w-3.5 h-3.5 ml-1.5 mr-1 text-slate-400 hidden sm:inline" />
          <button
            type="button"
            onClick={() => onChangeLang('en')}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === 'en'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => onChangeLang('vi')}
            className={`px-2 py-1 rounded-md text-xs font-semibold transition-all ${
              lang === 'vi'
                ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            VI
          </button>
        </div>

        {/* Theme Mode Switcher (Light / Dark / System) */}
        <div
          className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
          role="group"
          aria-label={t.theme.label}
        >
          <button
            type="button"
            onClick={() => onChangeTheme('light')}
            title={t.theme.light}
            className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
              themeMode === 'light'
                ? 'bg-white dark:bg-slate-900 text-amber-500 shadow-sm font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.theme.light}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTheme('dark')}
            title={t.theme.dark}
            className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
              themeMode === 'dark'
                ? 'bg-white dark:bg-slate-900 text-cyan-400 shadow-sm font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Moon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.theme.dark}</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTheme('system')}
            title={t.theme.system}
            className={`p-1.5 rounded-md text-xs transition-all flex items-center gap-1 ${
              themeMode === 'system'
                ? 'bg-white dark:bg-slate-900 text-emerald-500 dark:text-emerald-400 shadow-sm font-medium'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{t.theme.system}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
