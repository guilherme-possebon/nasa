export default class Crater {
    // Impactor properties
    private _diameter: number; // m
    private _radius: number; // m
    private _volume: number; // m^3
    private _mass: number; // kg
    private _velocityMs: number; // m/s
    private _energy: number; // Joules
    private _tnt: number; // kilotons

    // Impact results
    private _blastRadius: number; // m (what was previously borderRadius)
    private _craterDiameter: number; // m (the new physical crater size)

    constructor(diameter: number, velocity: number, density: number) {
        // Impactor Calculations
        this._diameter = diameter;
        this._radius = this._diameter / 2;
        this._volume = (4 / 3) * Math.PI * Math.pow(this._radius, 3);
        this._mass = this._volume * density;
        this._velocityMs = velocity;
        this._energy = 0.5 * this._mass * Math.pow(this._velocityMs, 2);
        this._tnt = this._energy / 4.184e9;

        // --- Result Calculations ---

        // 1. Blast Radius (kept for reference, this is not the crater)
        this._blastRadius = 100 * Math.pow(this._tnt, 1 / 3);

        // 2. Physical Crater Diameter Calculation
        // This uses a scaling law for impacts into competent rock.
        const targetDensity = 2750; // kg/m^3 for typical crustal rock
        const gravity = 9.81; // m/s^2 on Earth

        // Assumes a 45-degree impact angle, which is a common average for models
        const impactAngle = 45 * (Math.PI / 180);

        this._craterDiameter =
            1.161 *
            Math.pow(density / targetDensity, 1 / 3) *
            Math.pow(this._diameter, 0.78) *
            Math.pow(this._velocityMs, 0.44) *
            Math.pow(gravity, -0.22) *
            Math.pow(Math.sin(impactAngle), 1 / 3);
    }

    // --- Public Getters ---

    public get mass(): number {
        return this._mass;
    }

    public get tnt(): number {
        return this._tnt;
    }

    /**
     * The radius of the thermal/blast effect, in meters.
     */
    public get blastRadius(): number {
        return this._blastRadius;
    }

    /**
     * The diameter of the physical transient crater, in meters.
     */
    public get craterDiameter(): number {
        return this._craterDiameter;
    }

    /**
     * The radius of the physical transient crater, in meters.
     */
    public get craterRadius(): number {
        return this._craterDiameter / 2;
    }
}
