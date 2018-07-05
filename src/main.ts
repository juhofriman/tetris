import { Block, getBlock} from './blocks';
import { Point } from './Point';
import {Color, Palette} from './palette'

const WIDTH = 15;
const HEIGHT = 20;
const EMPTY = 'E';

enum KeyboardSignal {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    FLIP,
    DROP,
    HARDDROP,
    NEWBLOCK
}

enum BlockStatus {
  OCCUPIED = 'occupied',
  FREE  = 'free'
}

class BufferCmd {
  from: Point;
  to: Point;
  color: Color;
}

class BoardNode {

  point: Point;
  domNode: HTMLElement;

  constructor(domNode: HTMLElement, point: Point) {
    this.point = point;
    this.domNode = domNode;
    this.domNode.id = this.identifier();
    this.domNode.style.backgroundColor = Palette.freeColor.hex;
  }

  identifier(): string {
    return this.point.identifier();
  }

  setStatus(status: BlockStatus, color: Color): void {
    this.domNode.className = status.toString();
    this.domNode.style.backgroundColor = color.hex;
  }

  status(): string {
    return this.domNode.className;
  }
}

export class GameBoard {

  control: Block;

  board: BoardNode[][] = new Array<BoardNode[]>();

  currentMoveBuffer: Array<BufferCmd> = new Array<BufferCmd>();

  /**
   * Constructs game board and hooks it to the DOM
   */
  constructor(containerId: string) {

    const container = document.getElementById(containerId);
    const table = document.createElement('table');

    for(var i:number = 0; i < HEIGHT; i++) {

      var rowElement = document.createElement('tr');
      this.board[i] = new Array<BoardNode>();
      for(var c:number = 0; c < WIDTH; c++) {
        var block = this.board[i][c];
        var node = document.createElement('td');

        this.board[i][c] = new BoardNode(node, new Point(i, c));

        rowElement.appendChild(node);
      }
      table.appendChild(rowElement);
    }

    container.appendChild(table);
    this.signalFreeze();
  }

  setOccupied(point: Point, color: Color): void {
    if(point.x < 0) {
      return;
    }
    this.board[point.x][point.y].setStatus(BlockStatus.OCCUPIED, color);
  }

  setFree(point: Point): void {
    if(point.x < 0) {
      return;
    }
    this.board[point.x][point.y].setStatus(BlockStatus.FREE, Palette.freeColor);
  }



  registerMove(from: Point, to: Point, color: Color): Point {
    this.currentMoveBuffer.push({from: from, to: to, color: color})
    return to;
  }

  move(): void {
    for(let a of this.currentMoveBuffer) {
      this.setFree(a.from);
    }
    for(let a of this.currentMoveBuffer) {
      this.setOccupied(a.to, a.color);
    }
    this.currentMoveBuffer = new Array<BufferCmd>();
  }

  isFree(point: Point): boolean {
    if(point.y < 0 || point.y >= WIDTH) {
      return false;
    }
    if(point.x >= HEIGHT) {
      return false;
    }
    return this.board[point.x][point.y].status() !== 'occupied';
  }

  signalFreeze(): void {
    this.control = getBlock();
    this.control.init(this);
  }

  run(): void {
    this.control.drop(this);
  }

  emit(signal: KeyboardSignal): void {
    switch(signal) {
      case KeyboardSignal.LEFT: this.control.left(this); break;
      case KeyboardSignal.RIGHT: this.control.right(this); break;
      case KeyboardSignal.HARDDROP: this.control.hardDrop(this); break;
      case KeyboardSignal.DROP: this.control.drop(this); break;
      case KeyboardSignal.FLIP: this.control.flip(this); break;
      case KeyboardSignal.NEWBLOCK: this.signalFreeze(); break;
    }
  }
}

const game = new GameBoard('game');

function gameLoop() {
  game.run();
  setTimeout(gameLoop, 500);

};
setTimeout(gameLoop, 1000);

document.onkeydown = function(e: KeyboardEvent) {

    if (e.keyCode == 38) {
        game.emit(KeyboardSignal.FLIP);
    }
    else if (e.keyCode == 40) {
        game.emit(KeyboardSignal.DROP);
    }
    else if (e.keyCode == 37) {
       game.emit(KeyboardSignal.LEFT);

    }
    else if (e.keyCode == 39) {
       game.emit(KeyboardSignal.RIGHT);
    }
    else if (e.keyCode == 32) {
       game.emit(KeyboardSignal.HARDDROP);
    }
    else if (e.keyCode == 78) {
      game.emit(KeyboardSignal.NEWBLOCK);
    }

}
