import { Point } from '../Point';

export class FlipState {
  requireFree: (state: Array<Point>) => Array<Point>;
  genMoveSet: (state: Array<Point>) => Array<Point>;
  constructor(requireFree: (state: Array<Point>) => Array<Point>, genMoveSet: (state: Array<Point>) => Array<Point>) {
    this.requireFree = requireFree;
    this.genMoveSet = genMoveSet;
  }
}
