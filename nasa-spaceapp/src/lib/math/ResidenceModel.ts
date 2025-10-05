import { IResidenceModel } from '@/types/dust';

export class ResidenceModel implements IResidenceModel {
    // 10 km = base. Acima disso, escala linear (cap a coarse).
    scaledDays(injectionKm: number, base: { coarse: number; fine: number; aerosol: number }) {
        const scale = Math.max(0.5, injectionKm / 10);
        return {
            coarse: base.coarse * Math.min(scale, 1.0), // poeira grossa cai rápido
            fine: base.fine * scale,
            aerosol: base.aerosol * scale,
        };
    }
}
