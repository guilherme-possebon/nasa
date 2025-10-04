// src/lib/tsunami/TsunamiEngine.ts
import { GeoUtils } from "../math/GeoUtils";
import {

  TsunamiInput,
  TsunamiPointQuery,
  TsunamiPointResult,
} from "../../types/types";
import { CouplingModel } from "@/types/CouplingModelType";
import { CavityModel } from "@/types/CavityModelTypes";
import { PropagationModel } from "@/types/PropagationModelTypes";
import { RunupModel } from "@/types/RunupModelTypes";

export class TsunamiEngine {
  constructor(
    private coupling: CouplingModel,
    private cavity: CavityModel,
    private propagation: PropagationModel,
    private runup: RunupModel | null = null
  ) {}

  simulatePoint(input: TsunamiInput, query: TsunamiPointQuery): TsunamiPointResult {
    // 1) energia acoplada
    const E = this.coupling.coupledEnergyJ(input.asteroid);

    // 2) cavidade + altura inicial
    const Rc = this.cavity.cavityRadiusM(E, input.oceanDepthM);
    const H0 = this.cavity.initialWaveHeightM(Rc, input.oceanDepthM);

    // 3) distância geodésica
    const distanceKm = GeoUtils.haversineKm(input.impactLat, input.impactLon, query.lat, query.lon);

    // 4) propagação
    const H = this.propagation.waveHeightAt(distanceKm, H0, input.oceanDepthM);
    const tArr = this.propagation.travelTimeS(distanceKm, input.oceanDepthM);

    // 5) run-up (opcional)
    let runupM: number | undefined = undefined;
    if (this.runup && input.beachSlope != null) {
      runupM = this.runup.runupM(H, input.beachSlope);
    }

    return { distanceKm, arrivalTimeS: tArr, waveHeightM: H, runupM };
  }
}
