// src/lib/math/CouplingModel.ts

import { AsteroidParamsTypes } from '@/types/asteroidParams';
import { CouplingModel } from '@/types/couplingModel';

/** Energia acoplada simples: KE * eficiência */
export class SimpleCouplingModel implements CouplingModel {
  coupledEnergyJ(params: AsteroidParamsTypes): number {
    const r = params.diameterM / 2;
    const volume = (4 / 3) * Math.PI * r * r * r;
    const mass = params.densityKgM3 * volume;
    const ke = 0.5 * mass * params.velocityMps * params.velocityMps;
    const eff = Math.max(0, Math.min(1, params.couplingEfficiency ?? 0.3));
    return ke * eff;
  }
}
