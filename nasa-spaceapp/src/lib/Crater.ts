export default class Crater {
    private _diameter: number;
    private _radius: number;
    private _volume: number;
    private _mass: number;
    private _velocityMs: number;
    private _energy: number;
    private _tnt: number;
    private _borderRadius: number;

    constructor(diameter: number, velocity: number, density: number) {
        this._diameter = diameter;
        this._radius = this._diameter / 2;
        this._volume = (4 / 3) * Math.PI * Math.pow(this._radius, 3);
        this._mass = this._volume * density;
        this._velocityMs = velocity;
        this._energy = 0.5 * this._mass * Math.pow(this._velocityMs, 2);
        this._tnt = this._energy / 4.184e9;
        this._borderRadius = 100 * Math.pow(this._tnt, 1 / 3);
    }

    public get radius(): number {
        return this._radius;
    }

    public get volume(): number {
        return this._volume;
    }

    public get mass(): number {
        return this._mass;
    }

    public get velocityMs(): number {
        return this._velocityMs;
    }

    public get energy(): number {
        return this.energy;
    }

    public get tnt(): number {
        return this._tnt;
    }

    public get borderRadius(): number {
        return this._borderRadius;
    }
}
