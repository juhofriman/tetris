import { FlipStateBlock } from '../FlipStateBlock';
import { FlipState } from '../FlipState';
import { Point } from '../../Point';
import { Color } from '../../palette';

export class LineBlock extends FlipStateBlock {
  constructor(color: Color, startingPoint: Point) {
    super(color,
      [startingPoint, startingPoint.right(), startingPoint.right().right(), startingPoint.right().right().right()],
      new FlipState(
        (points: Array<Point>) => {
          return [points[0].up(), points[2].down(), points[3].down()];
        },
        (points: Array<Point>) => {
          return [points[1].up(), points[1], points[1].down(), points[1].down().down()]
        }),
      new FlipState(
        (points: Array<Point>) => {
          return [points[0].left(), points[2].right(), points[3].right()];
        },
        (points: Array<Point>) => {
          return [points[1].left(), points[1], points[1].right(), points[1].right().right()]
        })
    );
  }
}
