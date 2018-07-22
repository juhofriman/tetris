import { PivotBlock } from '../PivotBlock';
import { MoveSet } from '../MoveSet';
import { Point } from '../../Point';

export class InvertedLBlock extends PivotBlock {

  constructor(startingPoint: Point) {
    super(startingPoint);
  }

  getStateFns(): ((point: Point) => MoveSet)[] {
    return [
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.left(), pivot.right(), pivot.right().up()],
          [pivot.right()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.up(), pivot.down(), pivot.down().right()],
          []
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.right(), pivot.left(), pivot.left().down()],
          []
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.down(), pivot.up(), pivot.up().left()],
          []
        );
      },
    ]
  }

}
