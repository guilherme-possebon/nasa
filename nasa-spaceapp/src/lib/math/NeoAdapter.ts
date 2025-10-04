import { INeoAdapter, NeoLike } from "@/types/dusttype";

export class NeoAdapter implements INeoAdapter {
  extract(obj: NeoLike): { diameterM: number; velocityMps: number } {
    const kmMin = obj.estimated_diameter?.kilometers?.estimated_diameter_min ?? 0;
    const kmMax = obj.estimated_diameter?.kilometers?.estimated_diameter_max ?? kmMin;
    const diameterM = ((kmMin + kmMax) / 2) * 1000;

    const vStr = obj.close_approach_data?.[0]?.relative_velocity?.kilometers_per_second ?? "0";
    const velocityMps = parseFloat(vStr) * 1000;

    return { diameterM, velocityMps };
  }
}
