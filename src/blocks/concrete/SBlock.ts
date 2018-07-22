import { PivotBlock } from '../PivotBlock';
import { MoveSet } from '../MoveSet';
import { Point } from '../../Point';

export class SBlock extends PivotBlock {

  constructor(startingPoint: Point) {
    super(startingPoint);
  }

  getStateFns(): ((point: Point) => MoveSet)[] {
    return [
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.right(), pivot.down(), pivot.down().left()],
          [pivot.right().up()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.up(), pivot.right(), pivot.right().down()],
          [pivot.right().up()]
        );
      }
    ]
  }

}
