import { IEnergyModel } from "@/types/dusttype";

export class EnergyModel implements IEnergyModel {
  energyJ(diameterM: number, velocityMps: number, densityKgM3: number): number {
    const r = diameterM / 2;
    const volume = (4 / 3) * Math.PI * r ** 3;
    const mass = volume * densityKgM3;
    return 0.5 * mass * velocityMps ** 2;
  }
}
