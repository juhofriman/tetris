import {GameBoard} from './main';
import {Color, Palette} from './palette';

export interface Block {
  init(board: GameBoard): void
  drop(board: GameBoard): void
  hardDrop(board: GameBoard): void;
  left(board: GameBoard): void
  right(board: GameBoard): void
  canDrop(board: GameBoard): boolean
  canMoveLeft(board: GameBoard): boolean
  canMoveRight(board: GameBoard): boolean
}

export function getBlock(): Block {
  return new OneBlock(0, 5);
}

class OneBlock implements Block {

  x: number;
  y: number;
  color: Color;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.color = Palette.random();
  }

  init(board: GameBoard): void {
    board.setOccupied(this.x, this.y, this.color);
  }

  drop(board: GameBoard): void {
    if(this.canDrop(board)) {
      board.setFree(this.x, this.y);
      this.x++;
      board.setOccupied(this.x, this.y, this.color);
    } else {
      board.signalFreeze();
    }
  }

  hardDrop(board: GameBoard): void {
    var c = this.x;
    do {
      c++;
    } while(board.isFree(c, this.y))
    board.setFree(this.x, this.y);
    board.setOccupied(c-1, this.y, this.color);
    board.signalFreeze();
  }

  left(board: GameBoard): void {
    if(this.canMoveLeft(board)) {
      board.setFree(this.x, this.y);
      this.y--;
      board.setOccupied(this.x, this.y, this.color);
    }
  }

  right(board: GameBoard): void {
    if(this.canMoveRight(board)) {
      board.setFree(this.x, this.y);
      this.y++;
      board.setOccupied(this.x, this.y, this.color);
    }
  }

  canDrop(board: GameBoard): boolean {
    return board.isFree(this.x + 1, this.y);
  }

  canMoveLeft(board: GameBoard): boolean {
    return board.isFree(this.x, this.y - 1);
  }

  canMoveRight(board: GameBoard): boolean {
    return board.isFree(this.x, this.y + 1);
  }
}
