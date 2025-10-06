export default class Crater {
    private _diameter: number;
    private _radius: number;
    private _volume: number;
    private _mass: number;
    private _velocityMs: number;
    private _energy: number;
    private _tnt: number;

    private _blastRadius: number;
    private _craterDiameter: number;

    constructor(diameter: number, velocity: number, density: number) {
        this._diameter = diameter;
        this._radius = this._diameter / 2;
        this._volume = (4 / 3) * Math.PI * Math.pow(this._radius, 3);
        this._mass = this._volume * density;
        this._velocityMs = velocity;
        this._energy = 0.5 * this._mass * Math.pow(this._velocityMs, 2);
        this._tnt = this._energy / 4.184e9;

        this._blastRadius = 100 * Math.pow(this._tnt, 1 / 3);

        const targetDensity = 2750;
        const gravity = 9.81;

        const impactAngle = 45 * (Math.PI / 180);

        this._craterDiameter =
            1.161 *
            Math.pow(density / targetDensity, 1 / 3) *
            Math.pow(this._diameter, 0.78) *
            Math.pow(this._velocityMs, 0.44) *
            Math.pow(gravity, -0.22) *
            Math.pow(Math.sin(impactAngle), 1 / 3);
    }

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
