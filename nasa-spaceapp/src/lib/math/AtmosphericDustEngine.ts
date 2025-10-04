// src/lib/math/AtmosphericDustEngine.ts



// Implementações padrão (mesmo diretório)
import { NeoAdapter } from "./NeoAdapter";
import { EnergyModel } from "./EnergyModel";
import { EjectaModel } from "./EjectaModel";
import { InjectionModel } from "./InjectionModel";
import { OpticsModel } from "./OpticsModel";
import { ResidenceModel } from "./ResidenceModel";
import { BlockTimeModel } from "./BlockTimeModel";
import { DustConfig, DustSummary, IBlockTimeModel, IEjectaModel, IEnergyModel, IInjectionModel, INeoAdapter, IOpticsModel, IResidenceModel, NeoLike } from "@/types/dusttype";

export class AtmosphericDustEngine {
  private readonly neo: INeoAdapter;
  private readonly energy: IEnergyModel;
  private readonly ejecta: IEjectaModel;
  private readonly injection: IInjectionModel;
  private readonly optics: IOpticsModel;
  private readonly residence: IResidenceModel;
  private readonly block: IBlockTimeModel;

  private readonly cfg: Required<DustConfig>;

  constructor(
    cfg: DustConfig = {},
    deps?: Partial<{
      neo: INeoAdapter;
      energy: IEnergyModel;
      ejecta: IEjectaModel;
      injection: IInjectionModel;
      optics: IOpticsModel;
      residence: IResidenceModel;
      block: IBlockTimeModel;
    }>
  ) {
    // defaults configuráveis
    this.cfg = {
      densityKgM3: cfg.densityKgM3 ?? 3000,
      oceanicImpact: cfg.oceanicImpact ?? true,
      kEjectaOceanic: cfg.kEjectaOceanic ?? 1e-9,
      kEjectaTerrestrial: cfg.kEjectaTerrestrial ?? 1e-8,
      fracCoarse: cfg.fracCoarse ?? 0.6,
      fracFine: cfg.fracFine ?? 0.35,
      fracAerosol: cfg.fracAerosol ?? 0.05,
      stratFraction: cfg.stratFraction ?? 0.8,
      distributeGlobally: cfg.distributeGlobally ?? true,
      opticalKPerKg: cfg.opticalKPerKg ?? 5.0,
      severeTau: cfg.severeTau ?? 1.0,
      partialTau: cfg.partialTau ?? 0.3,
      residenceBaseDays: cfg.residenceBaseDays ?? { coarse: 3, fine: 90, aerosol: 360 },
    };

    // injeta implementações
    this.neo = deps?.neo ?? new NeoAdapter();
    this.energy = deps?.energy ?? new EnergyModel();
    this.ejecta = deps?.ejecta ?? new EjectaModel(this.cfg.kEjectaOceanic, this.cfg.kEjectaTerrestrial);
    this.injection = deps?.injection ?? new InjectionModel();
    this.optics = deps?.optics ?? new OpticsModel();
    this.residence = deps?.residence ?? new ResidenceModel();
    this.block = deps?.block ?? new BlockTimeModel();
  }

  /** Pipeline completo a partir de um objeto NEO (objeto.txt parseado) */
  summarizeFromNEO(obj: NeoLike): DustSummary {
    const { diameterM, velocityMps } = this.neo.extract(obj);

    const E = this.energy.energyJ(diameterM, velocityMps, this.cfg.densityKgM3);
    const M = this.ejecta.totalMassKg(E, this.cfg.oceanicImpact);
    const Hkm = this.injection.injectionHeightKm(E);

    const parts = this.ejecta.partition(M, {
      fracCoarse: this.cfg.fracCoarse,
      fracFine: this.cfg.fracFine,
      fracAerosol: this.cfg.fracAerosol,
      stratFraction: this.cfg.stratFraction,
    });

    const burden = this.optics.columnBurdenKgM2(parts.aerosolStrat, this.cfg.distributeGlobally);
    const tau0 = this.optics.initialTau(burden, this.cfg.opticalKPerKg);

    const res = this.residence.scaledDays(Hkm, this.cfg.residenceBaseDays);
    const severeDays = this.block.timeToDropBelow(tau0, this.cfg.severeTau, res.aerosol);
    const partialDays = this.block.timeToDropBelow(tau0, this.cfg.partialTau, res.aerosol);

    return {
      diameterM,
      velocityMps,
      impactEnergyJ: E,
      ejectaMassKg: M,
      injectionHeightKm: Hkm,
      aerosolMassStratKg: parts.aerosolStrat,
      tau0,
      residenceDays: res,
      thresholds: { severeTau: this.cfg.severeTau, partialTau: this.cfg.partialTau },
      durationsDays: { severeBlock: severeDays, partialBlock: partialDays },
    };
  }
}
