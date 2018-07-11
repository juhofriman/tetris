import { Point } from '../../Point';
import { NonFlipableBlock } from '../NonFlipableBlock';
import { Color } from '../../palette';

export class SuperBlock extends NonFlipableBlock {
  constructor(color: Color, points: Point[]) {
    super(color, points);
  }
}
