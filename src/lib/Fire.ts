class FireCalculator {
    private maxDiameterMeters: number;
    private velocityKps: number;

    /**
     * The class is instantiated with the data returned from the API.
     * It requires diameter and velocity to calculate the impact's kinetic energy.
     * @param apiData - The object containing asteroid data.
     */
    constructor(apiData: {
        estimated_diameter: {
            meters: {
                estimated_diameter_max: number;
            };
        };
        close_approach_data: {
            relative_velocity: {
                kilometers_per_second: string;
            };
        }[];
    }) {
        this.maxDiameterMeters = apiData.estimated_diameter.meters.estimated_diameter_max;

        this.velocityKps = parseFloat(
            apiData.close_approach_data[0].relative_velocity.kilometers_per_second,
        );
    }

    /**
     * Calculates the radius in which fires could be ignited by the thermal radiation of a hypothetical impact.
     * The calculation is based on the asteroid's kinetic energy.
     * @returns {number} The radius of potential fire spread in kilometers.
     */
    public getFireSpreadRadiusKm(): number {
        const ASTEROID_DENSITY_KG_M3 = 2710;

        const IGNITION_THRESHOLD_J_M2 = 400000;

        const THERMAL_EFFICIENCY_FACTOR = 0.3;

        const radiusMeters = this.maxDiameterMeters / 2;
        const volumeM3 = (4 / 3) * Math.PI * Math.pow(radiusMeters, 3);
        const massKg = volumeM3 * ASTEROID_DENSITY_KG_M3;

        const velocityMps = this.velocityKps * 1000;
        const kineticEnergyJoules = 0.5 * massKg * Math.pow(velocityMps, 2);

        const thermalEnergyJoules = kineticEnergyJoules * THERMAL_EFFICIENCY_FACTOR;

        const radiusMetersResult = Math.sqrt(
            thermalEnergyJoules / (4 * Math.PI * IGNITION_THRESHOLD_J_M2),
        );

        return radiusMetersResult / 1000;
    }
}
