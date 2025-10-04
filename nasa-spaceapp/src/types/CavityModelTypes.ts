export interface CavityModel {
  cavityRadiusM(coupledEnergyJ: number, oceanDepthM: number): number;
  initialWaveHeightM(cavityRadiusM: number, oceanDepthM: number): number;
}