import { Color, Palette } from '../palette';
import { Point } from '../Point';
import { GameBoard } from '../main';
import { Block } from './Block';

/**
 * AbstractBlock
 */
export abstract class AbstractBlock implements Block {
  blocks: Array<Point>;
  color: Color;
  constructor(color: Color, blocks: Array<Point>) {
    this.color = color;
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
