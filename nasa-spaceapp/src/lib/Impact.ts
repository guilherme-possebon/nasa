// As informações foram extraídas do arquivo objeto.txt

class Impact {
  private impactEnergyMt: number;
  private impactName: string;

  /**
   * A classe é instanciada com a energia do impacto em megatons.
   * @param impactData - Objeto contendo o nome e a energia do evento.
   */
  constructor(impactData: { name: string; energyMegatons: number }) {
    this.impactName = impactData.name;
    this.impactEnergyMt = impactData.energyMegatons;
  }

  /**
   * Calcula o raio da área de devastação com base na energia do impacto,
   * usando o evento de Tunguska como análogo.
   *
   * @returns {number} O raio da devastação em quilômetros.
   */
  get devastationRadiusKm(): number {
    // --- Ponto de Referência (Evento de Tunguska) ---
    // Energia de referência do impacto de Tunguska em Megatons de TNT.
    const REFERENCE_ENERGY_MT = 12;
    // Área devastada por esse impacto de referência (em km²).
    const REFERENCE_AREA_SQ_KM = 2150;

    // --- Lógica de Escala Direta ---
    // A nova área é proporcional à razão entre a nova energia e a energia de referência.
    const scaledAreaSqKm = REFERENCE_AREA_SQ_KM * (this.impactEnergyMt / REFERENCE_ENERGY_MT);

    // Calculamos o raio a partir da área escalonada.
    const radius = Math.sqrt(scaledAreaSqKm / Math.PI);

    console.log(`Cálculo de raio para o evento "${this.impactName}" concluído.`);
    return radius;
  }
}
