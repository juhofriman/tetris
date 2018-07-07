import * as concrete from './concrete/index';
import { Palette } from '../palette';
import { Point } from '../Point';

export { Block } from './Block';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Implementation assumes that blocks are at most 4 points wide
const blockFns = [
  (width: number) => new concrete.LineBlock(Palette.random(), new Point(0, getRandomInt(0, width - 4))),
  (width: number) => new concrete.BoxBlock(Palette.random(), new Point(0, getRandomInt(0, width - 4))),
];

export function blockFactory(width: number) {
  return blockFns[getRandomInt(0, blockFns.length - 1)](width);
}
