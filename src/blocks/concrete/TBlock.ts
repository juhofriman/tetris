import { PivotBlock } from '../PivotBlock';
import { MoveSet } from '../MoveSet';
import { Point } from '../../Point';

export class TBlock extends PivotBlock {

  constructor(startingPoint: Point) {
    super(startingPoint);
  }

  getStateFns(): ((point: Point) => MoveSet)[] {
    return [
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.left(), pivot.right(), pivot.down()],
          [pivot.down().left(), pivot.right().down(), pivot.right().up()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.left(), pivot.down(), pivot.up()],
          [pivot.down().left(), pivot.left().up(), pivot.down().right()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.left(), pivot.up(), pivot.right()],
          [pivot.down().left(), pivot.up().left(), pivot.right().up()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.up(), pivot.right(), pivot.down()],
          [pivot.left().up(), pivot.up().right(), pivot.right().down()]
        );
      },
    ]
  }

}
