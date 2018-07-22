import { Point } from '../../Point';
import { NonFlipableBlock } from '../NonFlipableBlock';
import { Color } from '../../palette';

/**
 * Super block is for dropping all blocks in board.
 */
export class SuperBlock extends NonFlipableBlock {
  constructor(points: Point[]) {
    super(points);
  }
}
