export type SimulationStep = 1 | 2 | 3 | 4;

export type Language = 'en' | 'vi';

export type ThemeMode = 'light' | 'dark' | 'system';

export type StrainId = 'alcanivorax' | 'cycloclasticus' | 'marinobacter' | 'consortium';

export type CameraPreset = 'overview' | 'surface' | 'microscopic' | 'top';

export interface InoculationDrop {
  id: string;
  position: [number, number, number];
  timestamp: number;
  strainId: StrainId;
}

export interface TelemetryData {
  /** Total Petroleum Hydrocarbons (mg/L) */
  tph: number;
  /** Ecological Acute Toxicity Units (TU) */
  toxicity: number;
  /** Chemical Oxygen Demand (mg/L) */
  cod: number;
  /** 5-Day Biochemical Oxygen Demand (mg/L) */
  bod5: number;
  /** Dissolved Oxygen (mg/L) */
  dissolvedOxygen: number;
  /** Bacterial density (log10 CFU/mL) */
  bacterialDensityLog: number;
  /** Biosurfactant emulsification index (%) */
  biosurfactantIndex: number;
  /** Oil slick thickness (mm) */
  slickThickness: number;
  /** CO2 mineralized byproduct (mmol/L) */
  co2Produced: number;
  /** H2O produced byproduct (mmol/L) */
  h2oProduced: number;
  /** Overall cleanup restoration percentage (0 - 100) */
  cleanupProgress: number;
}
