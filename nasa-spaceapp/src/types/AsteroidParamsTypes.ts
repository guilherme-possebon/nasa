export interface AsteroidParamsTypes {
  diameterM: number;
  densityKgM3: number;
  velocityMps: number;
  impactAngleDeg?: number;
  couplingEfficiency?: number; // 0..1
}