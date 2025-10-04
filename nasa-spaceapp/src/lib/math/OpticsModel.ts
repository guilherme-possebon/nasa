import { IOpticsModel } from "@/types/dusttype";

export class OpticsModel implements IOpticsModel {
  private static readonly R_EARTH_M = 6_371_000;

  columnBurdenKgM2(massStratKg: number, distributeGlobally: boolean): number {
    const area =
      (distributeGlobally ? 4 * Math.PI : 2 * Math.PI) *
      OpticsModel.R_EARTH_M ** 2;
    return massStratKg / area;
  }

  initialTau(columnBurdenKgM2: number, opticalKPerKg: number): number {
    return opticalKPerKg * columnBurdenKgM2;
  }
}
