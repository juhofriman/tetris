import { GameBoard } from './main';
import { Color, Palette } from './palette';
import { Point } from './Point';

// Sort of a block factory
export function getBlock(): Block {
  return new SBlock();
  // const x = Math.random();
  // if(x < 0.3) {
  //     return new LineBlock();
  // }
  // if(x > 0.9) {
  //     return new SBlock();
  // }
  // return new BoxBlock(0, 2);
}


export interface Block {
  init(board: GameBoard): void;
  flip(board: GameBoard): void;
  drop(board: GameBoard): void;
  hardDrop(board: GameBoard): void;
  left(board: GameBoard): void;
  right(board: GameBoard): void;
}

/**
 * AbstractBlock
 */
abstract class AbstractBlock implements Block {
  blocks: Array<Point>;
  color: Color = Palette.random();
  constructor(blocks: Array<Point>) {
    this.blocks = blocks;
  }
  abstract requireFreeForFlip(): Array<Point>;
  abstract giveFlipGroup(): Array<Point>;
  abstract signalFlipSuccess(): void;
  flip(board: GameBoard): void {
    const requireFree = this.requireFreeForFlip();

    for(let point of requireFree) {
      if(!board.isFree(point)) {
        console.log('Not free from require');
        console.log(point);
        return;
      }
    }
    const flipGroup = this.giveFlipGroup();

    for(let point of flipGroup) {
      if(this.blocks.indexOf(point) == -1 && !board.isFree(point)) {
        console.log("Not free for flip group");
        console.log(point);
        return;
      }
    }
    var i = 0;
    for(let point of flipGroup) {
      this.blocks[i] = board.registerMove(this.blocks[i], point, this.color);
      i++;
    }
    board.move();
    this.signalFlipSuccess();
  }
  uniqueArray(source: Array<number>): Array<number> {
    const result: number[] = [];

    for (let index = 0; index < source.length; index++) {
      let el = source[index];
      if (result.indexOf(el) == -1) result.push(el);
    }
    return result;
  }
  leftmost(): Array<Point> {
    const rows = this.uniqueArray(this.blocks.map((point) => point.x));
    const leftmosts = new Array<Point>();
    rows.forEach((row) => {
      const pointsInRow = this.blocks.filter((point => {
        return point.x == row;
      }));

      var min: Point = null;
      pointsInRow.forEach((point) => {
        if(min == null || point.y < min.y) {
          min = point;
        }
      });
      leftmosts.push(min);
    });
    return leftmosts;
  }
  rightmost(): Array<Point> {
    const rows = this.uniqueArray(this.blocks.map((point) => point.x));
    const leftmosts = new Array<Point>();
    rows.forEach((row) => {
      const pointsInRow = this.blocks.filter((point => {
        return point.x == row;
      }));

      var min: Point = null;
      pointsInRow.forEach((point) => {
        if(min == null || point.y > min.y) {
          min = point;
        }
      });
      leftmosts.push(min);
    });
    return leftmosts;
  }
  downmost(): Array<Point> {
    const rows = this.uniqueArray(this.blocks.map((point) => point.y));
    const leftmosts = new Array<Point>();
    rows.forEach((row) => {
      const pointsInRow = this.blocks.filter((point => {
        return point.y == row;
      }));

      var min: Point = null;
      pointsInRow.forEach((point) => {
        if(min == null || point.x > min.x) {
          min = point;
        }
      });
      leftmosts.push(min);
    });
    return leftmosts;
  }
  init(board: GameBoard): void {
    for(let point of this.blocks) {
      board.setOccupied(point, this.color);
    }
  }
  drop(board: GameBoard): void {
    if(this.canDrop(board)) {
      this.blocks = this.blocks.map((point) => {
        return board.registerMove(point, point.down(), this.color);
      });
      board.move();
    } else {
      board.signalFreeze();
    }
  }
  hardDrop(board: GameBoard): void {}
  left(board: GameBoard): void {
    if(this.canMoveLeft(board)){
      this.blocks = this.blocks.map((point) => {
        return board.registerMove(point, point.left(), this.color);
      });
      board.move();
    }
  }
  right(board: GameBoard): void {
    if(this.canMoveRight(board)) {
      this.blocks = this.blocks.map((point) => {
        return board.registerMove(point, point.right(), this.color);
      });
      board.move();
    }
  }
  bottomPoints(): Array<Point> {
    return new Array();
  }
  rightPoints(): Array<Point> {
    return new Array();
  }
  canDrop(board: GameBoard): boolean {
    for(let point of this.downmost()) {
      if(!board.isFree(point.down())) {
        return false;
      }
    }
    return true;
  }
  canMoveLeft(board: GameBoard): boolean {
    for(let point of this.leftmost()) {
      if(!board.isFree(point.left())) {
        return false;
      }
    }
    return true;
  }
  canMoveRight(board: GameBoard): boolean {
    for(let point of this.rightmost()) {
      if(!board.isFree(point.right())) {
        return false;
      }
    }
    return true;
  }
}

class SolitaBlock extends AbstractBlock {
  constructor() {
    super([
      new Point(0, 6),
      new Point(1, 6),
      new Point(0, 5),
      new Point(1, 5),
      new Point(2, 5),
      new Point(3, 5),
      new Point(2, 4),
      new Point(3, 4)]
    );
  }
  signalFlipSuccess(): void {

  }
  requireFreeForFlip(): Array<Point> {
    return null;
  }
  giveFlipGroup(): Array<Point> {
    return null;
  }
}


class FlipState {
  requireFree: (state: Array<Point>) => Array<Point>;
  genMoveSet: (state: Array<Point>) => Array<Point>;
  constructor(requireFree: (state: Array<Point>) => Array<Point>, genMoveSet: (state: Array<Point>) => Array<Point>) {
    this.requireFree = requireFree;
    this.genMoveSet = genMoveSet;
  }
}

abstract class FlipStateBlock extends AbstractBlock {

  statePointer = 0;
  states: Array<FlipState>;

  constructor(generator: (startingPoint : Point) => Array<Point>, ...states: Array<FlipState>) {
    super(generator(new Point(0, 0)));
    this.states = states;
  }

  signalFlipSuccess(): void {
    this.statePointer++;
    if(this.statePointer == this.states.length) {
      this.statePointer = 0;
    }
  }
  requireFreeForFlip(): Array<Point> {
    return this.states[this.statePointer].requireFree(this.blocks);
  }
  giveFlipGroup(): Array<Point> {
    return this.states[this.statePointer].genMoveSet(this.blocks);
  }
}

abstract class NonFlipableBlock extends AbstractBlock {
  constructor(generator: (startingPoint : Point) => Array<Point>) {
    super(generator(new Point(0, 0)));
  }
  signalFlipSuccess(): void {
  }
  requireFreeForFlip(): Array<Point> {
    return [];
  }
  giveFlipGroup(): Array<Point> {
    return [];
  }
}

class LineBlock extends FlipStateBlock {
  constructor() {
    super(
      (point: Point) => {
        return [point, point.right(), point.right().right(), point.right().right().right()];
      }
    ,
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


class OneBlock extends NonFlipableBlock {
  constructor(x: number, y: number) {
    super((point: Point) => {
      return [point];
    });
  }
}

class BoxBlock extends NonFlipableBlock {
  constructor(x: number, y: number) {
    super((point: Point) => {
      return [point, point.right(), point.down(), point.down().right()];
    });
  }
}

class SBlock extends FlipStateBlock {
  constructor() {
    super(
      (point: Point) => {
        return [point.right(), point.down(), point.down().right(), point.down().down()];
      }
    ,
    new FlipState(
      (points: Array<Point>) => {
          return [];
      },
      (points: Array<Point>) => {
          return [points[1].left(), points[1], points[1].down(), points[1].down().right()]
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
