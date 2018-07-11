import { Color, Palette } from '../palette';
import { Point } from '../Point';
import { GameBoard } from '../GameBoard';
import { Block } from './Block';

/**
 * AbstractBlock
 */
export abstract class AbstractBlock implements Block {

  /** Points in this block */
  blocks: Array<Point>;
  /** Color for this block */
  color: Color;

  constructor(color: Color, blocks: Array<Point>) {
    this.color = color;
    this.blocks = blocks;
  }

  /**
   * Should return an array of required free points
   * for flip
   */
  abstract requireFreeForFlip(): Array<Point>;

  /**
   * Should return an array of points after flip
   */
  abstract giveFlipGroup(): Array<Point>;

  /**
   * Hook for signaling succesfull flip
   */
  abstract signalFlipSuccess(): void;

  /**
   * Hooks block to gameboard
   */
  init(board: GameBoard): void {
    for(let point of this.blocks) {
      board.setOccupied(point, this.color);
    }
  }

  /**
   * Executes flip for block
   */
  flip(board: GameBoard): void {
    const requireFree = this.requireFreeForFlip();

    for(let point of requireFree) {
      if(!board.isFree(point)) {
        return;
      }
    }
    const flipGroup = this.giveFlipGroup();

    for(let point of flipGroup) {
      if(this.blocks.indexOf(point) == -1 && !board.isFree(point)) {
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

  /**
   * Executes drop for block
   */
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

  /**
   * Executes hard drop for block
   */
  hardDrop(board: GameBoard): void {
    while(this.canDrop(board)) {
      this.blocks = this.blocks.map((point) => {
        return board.registerMove(point, point.down(), this.color);
      });
      board.move();
    }
    board.signalFreeze();
  }

  /**
   * Executes left move for block
   */
  left(board: GameBoard): void {
    if(this.canMoveLeft(board)){
      this.blocks = this.blocks.map((point) => {
        return board.registerMove(point, point.left(), this.color);
      });
      board.move();
    }
  }

  /**
   * Executes right move for block
   */
  right(board: GameBoard): void {
    if(this.canMoveRight(board)) {
      this.blocks = this.blocks.map((point) => {
        return board.registerMove(point, point.right(), this.color);
      });
      board.move();
    }
  }

  /**
   * Utility method for returning array with unique elements
   */
  private uniqueArray(source: Array<number>): Array<number> {
    const result: number[] = [];
    for (let index = 0; index < source.length; index++) {
      let el = source[index];
      if (result.indexOf(el) == -1) result.push(el);
    }
    return result;
  }

  /**
   * Returns an array of the leftmost points in this block
   */
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

  /**
   * Returns an array of the rightmost points in this block
   */
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

  /**
   * Returns an array of the downmost points in this block
   */
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

  /**
   * Can this block drop?
   */
  canDrop(board: GameBoard): boolean {
    for(let point of this.downmost()) {
      if(!board.isFree(point.down())) {
        return false;
      }
    }
    return true;
  }

  /**
   * Can this block move left?
   */
  canMoveLeft(board: GameBoard): boolean {
    for(let point of this.leftmost()) {
      if(!board.isFree(point.left())) {
        return false;
      }
    }
    return true;
  }

  /**
   * Can this block move right?
   */
  canMoveRight(board: GameBoard): boolean {
    for(let point of this.rightmost()) {
      if(!board.isFree(point.right())) {
        return false;
      }
    }
    return true;
  }
}
