import { AbstractBlock } from './AbstractBlock';
import { Point } from '../Point';
import { Color, Palette } from '../palette';
import { GameBoard } from '../GameBoard';

class TestBlock extends AbstractBlock {
  constructor(blocks: Array<Point>) {
    super(blocks);
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

describe('AbstractBlock.ts search methods', () => {
  it('Should give the rightmost blocks', () => {
    expect(new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]).rightmost())
      .toEqual([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    expect(new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1), new Point(Palette.fromHex('#aaa'), 1, 5)]).rightmost())
      .toEqual([new Point(Palette.fromHex('#aaa'), 1, 5)]);
    const rightmostMultiple = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1), new Point(Palette.fromHex('#aaa'), 1, 5), new Point(Palette.fromHex('#aaa'), 2, 5)]).rightmost();
    expect(rightmostMultiple.length).toEqual(2);
    expect(rightmostMultiple).toContainEqual(new Point(Palette.fromHex('#aaa'), 1, 5));
    expect(rightmostMultiple).toContainEqual(new Point(Palette.fromHex('#aaa'), 2, 5));
  });
  it('Should give the leftmost blocks', () => {
    expect(new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]).leftmost())
      .toEqual([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    expect(new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1), new Point(Palette.fromHex('#aaa'), 1, 5)]).leftmost())
      .toEqual([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    const leftMostMultiple = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1), new Point(Palette.fromHex('#aaa'), 2, 1), new Point(Palette.fromHex('#aaa'), 2, 1)]).rightmost();
    expect(leftMostMultiple.length).toEqual(2);
    expect(leftMostMultiple).toContainEqual(new Point(Palette.fromHex('#aaa'), 1, 1));
    expect(leftMostMultiple).toContainEqual(new Point(Palette.fromHex('#aaa'), 2, 1));
  });
  it('Should give the downmost blocks', () => {
    expect(new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]).downmost())
      .toEqual([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    expect(new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1), new Point(Palette.fromHex('#aaa'), 2, 1)]).downmost())
      .toEqual([new Point(Palette.fromHex('#aaa'), 2, 1)]);
    const downMostMultiple = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1), new Point(Palette.fromHex('#aaa'), 2, 1), new Point(Palette.fromHex('#aaa'), 2, 1)]).downmost();
    expect(downMostMultiple.length).toEqual(1);
    expect(downMostMultiple).toContainEqual(new Point(Palette.fromHex('#aaa'), 2, 1));
  });

  it('xxx', () => {
    const Mock = jest.fn<GameBoard>(() => ({
      setOccupied: jest.fn(),
    }));
    const mock = new Mock();

    new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]).init(mock);
    expect(mock.setOccupied).toHaveBeenCalled();
  });
});

describe('AbstractBlock.ts GameBoard interactions', () => {

  const GameBoardMock = jest.fn<GameBoard>(() => ({
    setOccupied: jest.fn(),
    registerMove: (from: Point, to: Point, color: Color) => {
      return to;
    },
    isFree: (point: Point) => true,
    move: () => {},
    signalFreeze: jest.fn()
  }));

  let gameboardMock: GameBoard;

  beforeEach(() => {
    gameboardMock = new GameBoardMock();
  });

  it('Calls setOccupied() for gameboard when block is hooked to the gameboard', () => {
    new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]).init(gameboardMock);
    expect(gameboardMock.setOccupied).toHaveBeenCalledTimes(1);
  });

  it('Calls setOccupied() for every point in block', () => {
    new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1), new Point(Palette.fromHex('#aaa'), 1, 2), new Point(Palette.fromHex('#aaa'), 1, 3), new Point(Palette.fromHex('#aaa'), 1, 4)]).init(gameboardMock);
    expect(gameboardMock.setOccupied).toHaveBeenCalledTimes(4);
  });

  it('drop() should drop points in block', () => {
    const block = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    block.init(gameboardMock);
    block.drop(gameboardMock);
    expect(block.blocks[0]).toEqual(new Point(Palette.fromHex('#aaa'), 1, 1).down());
  });

  it('drop() should signalFreeze if point is not free', () => {
    const block = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    gameboardMock.isFree = () => false;
    block.init(gameboardMock);
    block.drop(gameboardMock);
    expect(gameboardMock.signalFreeze).toHaveBeenCalled();
  });

  it('hardDrop() should drop points until canDrop()', () => {
    const block = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    // Return canMove false after three calls
    let callCount = 0;
    gameboardMock.isFree = () => {
      callCount++;
      return callCount != 4;
    };
    block.init(gameboardMock);
    block.hardDrop(gameboardMock);
    expect(block.blocks[0]).toEqual(new Point(Palette.fromHex('#aaa'), 1, 1).down().down().down());
    // Hmmm...
    // expect(gameboardMock.signalFreeze).toHaveBeenCalled();
  });


  it('left() should move points left', () => {
    const block = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    block.init(gameboardMock);
    block.left(gameboardMock);
    expect(block.blocks[0]).toEqual(new Point(Palette.fromHex('#aaa'), 1, 1).left());
  });

  it('left() should not move if point is not free', () => {
    const block = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    gameboardMock.isFree = () => false;
    block.init(gameboardMock);
    block.left(gameboardMock);
    expect(block.blocks[0]).toEqual(new Point(Palette.fromHex('#aaa'), 1, 1));
  });

  it('right() should move points left', () => {
    const block = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    block.init(gameboardMock);
    block.right(gameboardMock);
    expect(block.blocks[0]).toEqual(new Point(Palette.fromHex('#aaa'), 1, 1).right());
  });

  it('right() should not move if point is not free', () => {
    const block = new TestBlock([new Point(Palette.fromHex('#aaa'), 1, 1)]);
    gameboardMock.isFree = () => false;
    block.init(gameboardMock);
    block.right(gameboardMock);
    expect(block.blocks[0]).toEqual(new Point(Palette.fromHex('#aaa'), 1, 1));
  });
});
