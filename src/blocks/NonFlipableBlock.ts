import { AbstractBlock } from './AbstractBlock';
import { Point } from '../Point';
import { Color } from '../palette';

export abstract class NonFlipableBlock extends AbstractBlock {
  constructor(points: Array<Point>) {
    super(points);
  }
  signalFlipSuccess(): void {
  }
  requireFreeForFlip(): Array<Point> {
    return [];
  }
  giveFlipGroup(): Array<Point> {
    return [];
  }
}
