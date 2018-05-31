import {Block, getBlock} from './blocks';
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
    HARDDROP
}

enum BlockStatus {
  OCCUPIED = 'occupied',
  FREE  = 'free'
}

class BoardNode {

  x: number;
  y: number;
  domNode: HTMLElement;

  constructor(domNode: HTMLElement, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.domNode = domNode;
    this.domNode.id = this.identifier();
    this.domNode.style.backgroundColor = Palette.freeColor.hex;
  }

  identifier(): string {
    return this.x + '-' + this.y;
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

        this.board[i][c] = new BoardNode(node, i, c);

        rowElement.appendChild(node);
      }
      table.appendChild(rowElement);
    }

    container.appendChild(table);
    this.signalFreeze();
  }

  setOccupied(x: number, y: number, color: Color): void {
    this.board[x][y].setStatus(BlockStatus.OCCUPIED, color);
  }

  setFree(x: number, y: number): void {
    this.board[x][y].setStatus(BlockStatus.FREE, Palette.freeColor);
  }

  isFree(x: number, y: number): boolean {
    if(y < 0 || y >= WIDTH) {
      return false;
    }
    if(x >= HEIGHT) {
      return false;
    }
    return this.board[x][y].status() !== 'occupied';
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
        // Up
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

}
