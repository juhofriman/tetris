import { AbstractBlock } from './AbstractBlock';
import { Point } from '../Point';
import { Color } from '../palette';
import { MoveSet } from './MoveSet';

export abstract class NonFlipableBlock extends AbstractBlock {
  constructor(points: Array<Point>) {
    super(points);
  }
  signalFlipSuccess(): void {
  }
  giveMoveSet(): MoveSet {
    return new MoveSet([], []);
  }
}
