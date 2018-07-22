import { Point } from '../../Point';
import { NonFlipableBlock } from '../NonFlipableBlock';
import { Color } from '../../palette';

export class BoxBlock extends NonFlipableBlock {
  constructor(startingPoint: Point) {
    super([startingPoint, startingPoint.right(), startingPoint.down(), startingPoint.down().right()]);
  }
}
