export interface PropagationModel {
  waveHeightAt(distanceKm: number, initialHeightM: number, oceanDepthM: number): number;
  travelTimeS(distanceKm: number, oceanDepthM: number): number;
}