import { AbstractBlock } from './AbstractBlock';
import { Point } from '../Point';
import { Color } from '../palette';

class TestBlock extends AbstractBlock {
  constructor(blocks: Array<Point>) {
    super({hex: "#479030"}, blocks);
  }
  requireFreeForFlip(): Array<Point> {
    return null;
  }
  giveFlipGroup(): Array<Point> {
    return null;
  }
  signalFlipSuccess(): void {

  }
}

describe('AbstractBlock.ts', () => {
  it('Should give the rightmost blocks', () => {
    expect(new TestBlock([new Point(1, 1)]).rightmost())
      .toEqual([new Point(1, 1)]);
    expect(new TestBlock([new Point(1, 1), new Point(1, 5)]).rightmost())
      .toEqual([new Point(1, 5)]);
    const rightmostMultiple = new TestBlock([new Point(1, 1), new Point(1, 5), new Point(2, 5)]).rightmost();
    expect(rightmostMultiple.length).toEqual(2);
    expect(rightmostMultiple).toContainEqual(new Point(1, 5));
    expect(rightmostMultiple).toContainEqual(new Point(2, 5));
  });
  it('Should give the leftmost blocks', () => {
    expect(new TestBlock([new Point(1, 1)]).leftmost())
      .toEqual([new Point(1, 1)]);
    expect(new TestBlock([new Point(1, 1), new Point(1, 5)]).leftmost())
      .toEqual([new Point(1, 1)]);
    const leftMostMultiple = new TestBlock([new Point(1, 1), new Point(2, 1), new Point(2, 1)]).rightmost();
    expect(leftMostMultiple.length).toEqual(2);
    expect(leftMostMultiple).toContainEqual(new Point(1, 1));
    expect(leftMostMultiple).toContainEqual(new Point(2, 1));
  });
  it('Should give the downmost blocks', () => {
    expect(new TestBlock([new Point(1, 1)]).downmost())
      .toEqual([new Point(1, 1)]);
    expect(new TestBlock([new Point(1, 1), new Point(2, 1)]).downmost())
      .toEqual([new Point(2, 1)]);
    const downMostMultiple = new TestBlock([new Point(1, 1), new Point(2, 1), new Point(2, 1)]).downmost();
    expect(downMostMultiple.length).toEqual(1);
    expect(downMostMultiple).toContainEqual(new Point(2, 1));
  });
});
