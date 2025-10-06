export class Impact {
    private impactEnergyMt: number;

    /**
     * A classe é instanciada com a energia do impacto em megatons.
     * @param energyMegatons - A energia do evento de impacto em megatons.
     */
    constructor(energyMegatons: number) {
        this.impactEnergyMt = energyMegatons;
    }

    /**
     * Calcula o raio da área de devastação com base na energia do impacto,
     * usando o evento de Tunguska como análogo e uma escala por lei de potência.
     *
     * @returns {number} O raio da devastação em quilômetros.
     */
    get devastationRadiusKm(): number {
        const REFERENCE_ENERGY_MT = 12;

        const REFERENCE_AREA_SQ_KM = 2150;

        const energyRatio = this.impactEnergyMt / REFERENCE_ENERGY_MT;
        const scaledAreaSqKm = REFERENCE_AREA_SQ_KM * Math.pow(energyRatio, 2 / 3);

        const radius = Math.sqrt(scaledAreaSqKm / Math.PI);

        return radius;
    }
}
