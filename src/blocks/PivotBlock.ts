import { AbstractBlock } from './AbstractBlock';
import { MoveSet } from './MoveSet';
import { Point } from '../Point';
import { Color } from '../palette';

export abstract class PivotBlock extends AbstractBlock {

  statePointer = 0;

  constructor(pivot: Point) {
    super([pivot]);
    this.blocks = this.giveMoveSet().nextState;
    this.signalFlipSuccess();
  }

  signalFlipSuccess(): void {
    this.statePointer++;
    if(this.statePointer == this.getStateFns().length) {
      this.statePointer = 0;
    }
  }

  giveMoveSet(): MoveSet {
    return this.getStateFns()[this.statePointer](this.blocks[0]);
  }

  abstract getStateFns(): ((point: Point) => MoveSet)[];
}
