// As informações foram extraídas do arquivo objeto.txt

class TremorCalculator {
    private maxDiameterMeters: number;
    private asteroidName: string;

    // A classe é instanciada com as informações da API
    constructor(apiData: {
        name: string,
        estimated_diameter: {
            meters: {
                estimated_diameter_max: number
            }
        }
    }) {
        this.maxDiameterMeters = apiData.estimated_diameter.meters.estimated_diameter_max; // 
        this.asteroidName = apiData.name; // 
    }

    /**
     * Calcula o raio máximo de tremores com base em análogos de impacto (Tunguska).
     * O método usa um valor de área pré-definido (2150 km²) para análogos
     * de asteroides com diâmetro entre 50 e 70 metros.
     *
     * @returns {number} O raio em quilômetros.
     */
    public getTremorRadiusKm(): number {
        // Verifica se o diâmetro está na faixa do análogo de Tunguska
        if (this.maxDiameterMeters > 50 && this.maxDiameterMeters < 70) {
            const TUNGUSKA_AREA_SQ_KM = 2150;
            const radius = Math.sqrt(TUNGUSKA_AREA_SQ_KM / Math.PI);
            console.log(`Cálculo de raio para o asteroide ${this.asteroidName} concluído.`);
            return radius; // Retorna aproximadamente 26.16 km
        } else {
            // Lógica para outros tamanhos poderia ser implementada aqui
            console.log("Diâmetro fora da faixa do análogo de Tunguska.");
            return 0;
        }
    }
}