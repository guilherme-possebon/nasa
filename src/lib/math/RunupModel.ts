// src/lib/math/RunupModel.ts

import { RunupModel } from '@/types/runupModel';

/** Relação empírica simples: run-up ~ k * H0 / sqrt(slope) */
export class SimpleRunupModel implements RunupModel {
  runupM(waveHeightOffshoreM: number, beachSlope: number): number {
    const slope = Math.max(1e-4, beachSlope);
    const k = 1.1;
    return (k * waveHeightOffshoreM) / Math.sqrt(slope);
  }
}
