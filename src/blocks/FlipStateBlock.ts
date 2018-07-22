import { AbstractBlock } from './AbstractBlock';
import { FlipState } from './FlipState';
import { Point } from '../Point';
import { Color } from '../palette';

export abstract class FlipStateBlock extends AbstractBlock {

  statePointer = 0;
  states: Array<FlipState>;

  constructor(points: Array<Point>, ...states: Array<FlipState>) {
    super(points);
    this.states = states;
  }

  signalFlipSuccess(): void {
    this.statePointer++;
    if(this.statePointer == this.states.length) {
      this.statePointer = 0;
    }
  }
  requireFreeForFlip(): Array<Point> {
    return this.states[this.statePointer].requireFree(this.blocks);
  }
  giveFlipGroup(): Array<Point> {
    return this.states[this.statePointer].genMoveSet(this.blocks);
  }
}
