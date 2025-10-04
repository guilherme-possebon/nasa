// src/lib/tsunami/types.ts
// Centraliza interfaces e tipos usados no módulo de tsunami.

import { AsteroidParamsTypes } from "./AsteroidParamsTypes";



export interface TsunamiInput {
  asteroid: AsteroidParamsTypes;
  oceanDepthM: number;
  impactLat: number;
  impactLon: number;
  beachSlope?: number;
}

export interface TsunamiPointQuery {
  lat: number;
  lon: number;
}

export interface TsunamiPointResult {
  distanceKm: number;
  arrivalTimeS: number;
  waveHeightM: number;
  runupM?: number;
}


