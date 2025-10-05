import { IInjectionModel } from '@/types/dust';

/** Heurística suave: mapeia log10(E) para 10..50 km */
export class InjectionModel implements IInjectionModel {
    constructor(
        private readonly minKm = 10,
        private readonly maxKm = 50,
    ) {}

    injectionHeightKm(energyJ: number): number {
        const log = Math.max(12, Math.min(24, Math.log10(energyJ + 1)));
        return this.minKm + ((log - 12) / (24 - 12)) * (this.maxKm - this.minKm);
    }
}
