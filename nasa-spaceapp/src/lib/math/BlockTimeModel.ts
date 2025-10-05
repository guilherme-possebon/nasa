import { IBlockTimeModel } from '@/types/dust';

export class BlockTimeModel implements IBlockTimeModel {
    timeToDropBelow(tau0: number, threshold: number, tauResDays: number): number {
        if (tau0 <= threshold) return 0;
        return tauResDays * Math.log(tau0 / threshold);
    }
}
