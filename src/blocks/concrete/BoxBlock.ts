import { Point } from '../../Point';
import { NonFlipableBlock } from '../NonFlipableBlock';
import { Color } from '../../palette';

export class BoxBlock extends NonFlipableBlock {
  constructor(color: Color, startingPoint: Point) {
    super(color,  [startingPoint, startingPoint.right(), startingPoint.down(), startingPoint.down().right()]);
  }
}
