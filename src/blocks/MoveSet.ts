import { Point } from '../Point'

export class MoveSet {

  readonly nextState: Point[];
  readonly requireFree: Point[]

  constructor(nextState: Point[], requiredFree: Point[]) {
    this.nextState = nextState;
    this.requireFree = requiredFree;
  }
}