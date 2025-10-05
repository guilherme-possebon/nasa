import { DustConfig, IEjectaModel, RequiredPick } from '@/types/dust';

export class EjectaModel implements IEjectaModel {
    constructor(
        private readonly kOceanic = 1e-9,
        private readonly kTerrestrial = 1e-8,
    ) {}

    totalMassKg(energyJ: number, oceanicImpact: boolean): number {
        const k = oceanicImpact ? this.kOceanic : this.kTerrestrial;
        return k * Math.pow(energyJ, 0.67);
        // modelo empírico simples
    }

    partition(
        totalKg: number,
        cfg: RequiredPick<DustConfig, 'fracCoarse' | 'fracFine' | 'fracAerosol' | 'stratFraction'>,
    ) {
        const coarse = totalKg * cfg.fracCoarse;
        const fine = totalKg * cfg.fracFine;
        const aerosol = totalKg * cfg.fracAerosol;
        const aerosolStrat = aerosol * cfg.stratFraction;
        return { coarse, fine, aerosol, aerosolStrat };
    }
}
