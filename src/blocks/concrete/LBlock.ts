import { PivotBlock } from '../PivotBlock';
import { MoveSet } from '../MoveSet';
import { Point } from '../../Point';

export class LBlock extends PivotBlock {

  constructor(startingPoint: Point) {
    super(startingPoint);
  }

  getStateFns(): ((point: Point) => MoveSet)[] {
    return [
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.left(), pivot.left().up(), pivot.right()],
          [pivot.right(), pivot.right().up()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.up(), pivot.up().right(), pivot.down()],
          [pivot.down(), pivot.down().right()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.right(), pivot.right().down(), pivot.left()],
          [pivot.left(), pivot.left().down()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.down(), pivot.down().left(), pivot.up()],
          [pivot.up(), pivot.up().left()]
        );
      },
    ]
  }

}
