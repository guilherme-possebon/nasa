// Data was extracted from the objeto.txt file.

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
        this.maxDiameterMeters = apiData.estimated_diameter.meters.estimated_diameter_max; // e.g., 68.24 meters
        // The API returns an array of close approaches, we'll use the first one.
        this.velocityKps = parseFloat(
            apiData.close_approach_data[0].relative_velocity.kilometers_per_second,
        ); // e.g., 7.97 kps
    }

    /**
     * Calculates the radius in which fires could be ignited by the thermal radiation of a hypothetical impact.
     * The calculation is based on the asteroid's kinetic energy.
     * @returns {number} The radius of potential fire spread in kilometers.
     */
    public getFireSpreadRadiusKm(): number {
        // --- Step 1: Define physical constants ---
        // Average density for a stony (S-type) asteroid in kg/m^3.
        const ASTEROID_DENSITY_KG_M3 = 2710;
        // Thermal radiation energy required to ignite forests, in Joules per square meter.
        const IGNITION_THRESHOLD_J_M2 = 400000;
        // The fraction of kinetic energy converted into thermal radiation (approximately 30%).
        const THERMAL_EFFICIENCY_FACTOR = 0.3;

        // --- Step 2: Calculate the asteroid's mass ---
        const radiusMeters = this.maxDiameterMeters / 2;
        const volumeM3 = (4 / 3) * Math.PI * Math.pow(radiusMeters, 3);
        const massKg = volumeM3 * ASTEROID_DENSITY_KG_M3;

        // --- Step 3: Calculate kinetic energy ---
        const velocityMps = this.velocityKps * 1000; // Convert km/s to m/s
        const kineticEnergyJoules = 0.5 * massKg * Math.pow(velocityMps, 2);

        // --- Step 4: Calculate the total thermal energy radiated ---
        const thermalEnergyJoules = kineticEnergyJoules * THERMAL_EFFICIENCY_FACTOR;

        // --- Step 5: Calculate the ignition radius ---
        // The formula for thermal flux is Flux = Energy / (4 * PI * R^2).
        // We rearrange it to solve for R: R = sqrt(Energy / (4 * PI * Flux)).
        const radiusMetersResult = Math.sqrt(
            thermalEnergyJoules / (4 * Math.PI * IGNITION_THRESHOLD_J_M2),
        );

        // Convert the final radius from meters to kilometers.
        return radiusMetersResult / 1000;
    }
}
