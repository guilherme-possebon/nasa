// src/lib/math/CavityModel.ts

import { CavityModel } from '@/types/cavityModel';

export class HeuristicCavityModel implements CavityModel {
  private static readonly rhoWater = 1000; // kg/m³
  private static readonly g = 9.80665; // m/s²
  private static readonly cavityK = 0.9; // escala
  private static readonly depthLimiter = 5; // limita cavidade a ~5× profundidade

  cavityRadiusM(coupledEnergyJ: number, oceanDepthM: number): number {
    const base = Math.cbrt(
      coupledEnergyJ / (HeuristicCavityModel.rhoWater * HeuristicCavityModel.g),
    );
    return Math.min(
      HeuristicCavityModel.cavityK * base,
      HeuristicCavityModel.depthLimiter * oceanDepthM,
    );
  }

  initialWaveHeightM(cavityRadiusM: number, oceanDepthM: number): number {
    // fração da menor escala (cavidade vs profundidade)
    return 0.25 * Math.min(cavityRadiusM, oceanDepthM);
  }
}
