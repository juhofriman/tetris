import { PivotBlock } from '../PivotBlock';
import { MoveSet } from '../MoveSet';
import { Point } from '../../Point';
import { Color } from '../../palette';

export class LineBlock extends PivotBlock {
  constructor(startingPoint: Point) {
    super(startingPoint);
  }

  getStateFns(): ((point: Point) => MoveSet)[] {
    return [
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.left(), pivot.right(), pivot.right().right()],
          [pivot.up().left(), pivot.down().right(), pivot.down().right().right(), pivot.down().down().right()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.up(), pivot.down(), pivot.down().down()],
          [pivot.left().up(), pivot.right().down(), pivot.right().right().down(), pivot.right().down().down()]
        );
      }
    ]
  }
}
