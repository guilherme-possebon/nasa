// Tipos e Interfaces centrais

export type NeoLike = {
  estimated_diameter?: {
    kilometers?: {
      estimated_diameter_min?: number;
      estimated_diameter_max?: number;
    };
  };
  close_approach_data?: Array<{
    relative_velocity?: { kilometers_per_second?: string };
  }>;
};

export type DustSummary = {
  diameterM: number;
  velocityMps: number;
  impactEnergyJ: number;

  ejectaMassKg: number;
  injectionHeightKm: number;

  aerosolMassStratKg: number;
  tau0: number; // opacidade inicial

  residenceDays: { coarse: number; fine: number; aerosol: number };
  thresholds: { severeTau: number; partialTau: number };
  durationsDays: { severeBlock: number; partialBlock: number };
};

// Configurações globais
export type DustConfig = {
  densityKgM3?: number;
  oceanicImpact?: boolean;
  kEjectaOceanic?: number;
  kEjectaTerrestrial?: number;
  fracCoarse?: number;
  fracFine?: number;
  fracAerosol?: number;
  stratFraction?: number;
  distributeGlobally?: boolean;
  opticalKPerKg?: number;
  severeTau?: number;
  partialTau?: number;
  residenceBaseDays?: { coarse: number; fine: number; aerosol: number };
};

// Interfaces de cada “módulo”
export interface INeoAdapter {
  extract(obj: NeoLike): { diameterM: number; velocityMps: number };
}

export interface IEnergyModel {
  energyJ(diameterM: number, velocityMps: number, densityKgM3: number): number;
}

export interface IEjectaModel {
  totalMassKg(energyJ: number, oceanicImpact: boolean): number;
  partition(totalKg: number, cfg: RequiredPick<DustConfig,
    "fracCoarse" | "fracFine" | "fracAerosol" | "stratFraction">): {
    coarse: number; fine: number; aerosol: number; aerosolStrat: number;
  };
}

export interface IInjectionModel {
  injectionHeightKm(energyJ: number): number;
}

export interface IOpticsModel {
  columnBurdenKgM2(massStratKg: number, distributeGlobally: boolean): number;
  initialTau(columnBurdenKgM2: number, opticalKPerKg: number): number;
}

export interface IResidenceModel {
  scaledDays(injectionKm: number, base: { coarse: number; fine: number; aerosol: number }): {
    coarse: number; fine: number; aerosol: number;
  };
}

export interface IBlockTimeModel {
  timeToDropBelow(tau0: number, threshold: number, tauResDays: number): number;
}

// Utilitário: RequiredPick
export type RequiredPick<T, K extends keyof T> = Required<Pick<T, K>>;
