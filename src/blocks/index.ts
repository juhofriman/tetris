import * as concrete from './concrete/index';
import { Palette } from '../palette';
import { Point } from '../Point';

export { Block } from './Block';

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// Implementation assumes that blocks are at most 4 points wide
const blockFns = [
  (width: number) => new concrete.LineBlock(new Point(Palette.random(), 0, getRandomInt(2, width - 4))),
  (width: number) => new concrete.BoxBlock(new Point(Palette.random(), 0, getRandomInt(2, width - 4))),
  (width: number) => new concrete.TBlock(new Point(Palette.random(), 0, getRandomInt(2, width - 4))),
  (width: number) => new concrete.LBlock(new Point(Palette.random(), 0, getRandomInt(2, width - 4))),
  (width: number) => new concrete.SBlock(new Point(Palette.random(), 0, getRandomInt(2, width - 4))),
  (width: number) => new concrete.InvertedSBlock(new Point(Palette.random(), 0, getRandomInt(2, width - 4))),
  (width: number) => new concrete.InvertedLBlock(new Point(Palette.random(), 0, getRandomInt(2, width - 4))),
];

export function blockFactory(width: number) {
  return blockFns[getRandomInt(0, blockFns.length - 1)](width);
  // return new concrete.InvertedLBlock(new Point(Palette.random(), 0, getRandomInt(2, width - 4)));
}
