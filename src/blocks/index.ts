import * as concrete from './concrete/index';
import { Palette } from '../palette';
import { Point } from '../Point';

export { Block } from './Block';

export function blockFactory() {
  return new concrete.LineBlock(Palette.random(), new Point(0, 0));
}
