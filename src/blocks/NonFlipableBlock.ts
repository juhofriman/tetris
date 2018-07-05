import { AbstractBlock } from './AbstractBlock';
import { Point } from '../Point';
import { Color } from '../palette';

export abstract class NonFlipableBlock extends AbstractBlock {
  constructor(color: Color, points: Array<Point>) {
    super(color, points);
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
