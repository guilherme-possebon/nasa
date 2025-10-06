import { AsteroidParamsTypes } from './asteroidParams';

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
