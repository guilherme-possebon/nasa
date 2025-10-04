import { AsteroidParamsTypes } from "./AsteroidParamsTypes";

export interface CouplingModel {
  coupledEnergyJ(params: AsteroidParamsTypes): number;
}