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
        // --- Ponto de Referência (Evento de Tunguska) ---
        // Energia de referência do impacto de Tunguska em Megatons de TNT.
        const REFERENCE_ENERGY_MT = 12;
        // Área devastada por esse impacto de referência (em km²).
        const REFERENCE_AREA_SQ_KM = 2150;

        // --- Lógica de Escala por Lei de Potência (Mais precisa) ---
        // A área de devastação escala com a energia elevada à potência de 2/3.
        const energyRatio = this.impactEnergyMt / REFERENCE_ENERGY_MT;
        const scaledAreaSqKm = REFERENCE_AREA_SQ_KM * Math.pow(energyRatio, 2 / 3);

        // Calculamos o raio a partir da área escalonada (Área = PI * raio^2).
        const radius = Math.sqrt(scaledAreaSqKm / Math.PI);

        return radius;
    }
}
