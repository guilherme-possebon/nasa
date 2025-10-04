export default class Crater {
  private _radius: number;
  private _volume: number;
  private _mass: number;
  private _velocityMs: number;
  private _energy: number;
  private _tnt: number;
  private _borderRadius: number;

  constructor(diameter: number, velocity: number, density: number) {
    this._radius = diameter * 100;
    this._volume = (4 / 3) * Math.PI * Math.pow(this._radius, 3);
    this._mass = density * this._volume;
    this._velocityMs = velocity * 1000;
    this._energy = 0.5 * this._mass * this._velocityMs * this._velocityMs;
    this._tnt = this._energy / 4.184e9;
    this._borderRadius = diameter * 100;
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
