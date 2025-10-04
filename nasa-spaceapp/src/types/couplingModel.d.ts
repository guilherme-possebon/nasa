import { AsteroidParamsTypes } from './asteroidParams';

export interface CouplingModel {
  coupledEnergyJ(params: AsteroidParamsTypes): number;
}
