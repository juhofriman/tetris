import { PivotBlock } from '../PivotBlock';
import { MoveSet } from '../MoveSet';
import { Point } from '../../Point';

export class InvertedSBlock extends PivotBlock {

  constructor(startingPoint: Point) {
    super(startingPoint);
  }

  getStateFns(): ((point: Point) => MoveSet)[] {
    return [
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.left(), pivot.down(), pivot.down().right()],
          [pivot.left().down()]
        );
      },
      (pivot: Point): MoveSet => {
        return new MoveSet(
          [pivot, pivot.down(), pivot.right(), pivot.right().up()],
          [pivot.down().left()]
        );
      }
    ]
  }

}
