// src/lib/math/PropagationModel.ts

import { PropagationModel } from '@/types/propagationModel';

/** Heurística: H ~ H0 / sqrt(dist) ; c ~ sqrt(g*h) */
export class ShallowWaterPropagation implements PropagationModel {
  private static readonly g = 9.80665;

  waveHeightAt(distanceKm: number, initialHeightM: number, oceanDepthM: number): number {
    const d = Math.max(1e-3, distanceKm);
    const decay = 1 / Math.sqrt(d);
    return initialHeightM * decay;
  }

  travelTimeS(distanceKm: number, oceanDepthM: number): number {
    const c = Math.sqrt(ShallowWaterPropagation.g * Math.max(1, oceanDepthM)); // m/s
    return (distanceKm * 1000) / c;
  }
}
