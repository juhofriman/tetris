import { Block, blockFactory } from './blocks/index';
import { SuperBlock } from './blocks/concrete/SuperBlock';
import { BoardNode } from './BoardNode';
import { BlockStatus } from './BlockStatus';
import { Point } from './Point';
import { Palette, Color } from './palette';
import { KeyboardSignal } from './KeyboardSignal';

class BufferCmd {
  from: Point;
  to: Point;
}

export class GameBoard {

  /** DOM container */
  container: HTMLElement;
  /** Width of the board */
  WIDTH: number;
  /** Height of the board */
  HEIGHT : number;
  /** Currently controlled block instance */
  control: Block;
  /** Board nodes */
  board: BoardNode[][] = new Array<BoardNode[]>();
  /** Move buffer - regitesters all moving points */
  currentMoveBuffer: Array<BufferCmd> = new Array<BufferCmd>();
  /** Points */
  points: number = 0;
  /** done? */
  done: boolean = false;

  /**
   * Constructs game board and hooks it to the DOM
   */
  constructor(containerId: string, width: number, height: number) {
    this.HEIGHT = height;
    this.WIDTH = width;
    this.container = document.getElementById(containerId);
    const table = document.createElement('table');

    for(var i:number = 0; i < this.HEIGHT; i++) {

      var rowElement = document.createElement('tr');
      this.board[i] = new Array<BoardNode>();
      for(var c:number = 0; c < this.WIDTH; c++) {
        var block = this.board[i][c];
        var node = document.createElement('td');

        this.board[i][c] = new BoardNode(node, new Point(Palette.freeColor, i, c));

        rowElement.appendChild(node);
      }
      table.appendChild(rowElement);
    }
    const points = document.createElement('div');
    points.id = 'points';
    points.innerText = '' + this.points;
    this.container.appendChild(points);

    this.container.appendChild(table);
    this.signalFreeze();
  }

  /**
   * Sets point occupied in board with given color
   */
  setOccupied(point: Point): void {
    if(point.x < 0) {
      return;
    }
    this.board[point.x][point.y].setOccupied(point);
  }

  /**
   * Sets point free in board
   */
  setFree(point: Point): void {
    if(point.x < 0) {
      return;
    }
    this.board[point.x][point.y].setFree();
  }

  /**
   * Registers move for point to be executed with move()
   */
  registerMove(from: Point, to: Point): Point {
    this.currentMoveBuffer.push({from: from, to: to})
    return to;
  }

  /**
   * Executes and flushes move buffer
   */
  move(): void {
    for(let a of this.currentMoveBuffer) {
      this.setFree(a.from);
    }
    for(let a of this.currentMoveBuffer) {
      this.setOccupied(a.to);
    }
    this.currentMoveBuffer = new Array<BufferCmd>();
  }

  /**
   * Checks if point is free in board
   */
  isFree(point: Point): boolean {
    if(point.y < 0 || point.y >= this.WIDTH) {
      return false;
    }
    if(point.x < 0 || point.x >= this.HEIGHT) {
      return false;
    }
    return this.board[point.x][point.y].status() !== BlockStatus.OCCUPIED;
  }

  private isAllOccupiedInRow(rowIndex: number): boolean {
    for(let row of this.board[rowIndex]) {
      if(row.status() !== BlockStatus.OCCUPIED) {
        return false;
      }
    }
    return true;
  }

  givePoints(row: number): void {
    this.points += 100 * (this.HEIGHT - row + 1);
    document.getElementById('points').innerText = '' + this.points;
  }

  checkOccupiedRows(): void {
    let dropIndex = -1;
    for(let rowIndex = 0; rowIndex < this.board.length; rowIndex++) {
      if(this.isAllOccupiedInRow(rowIndex)) {
        for(let row of this.board[rowIndex]) {
          row.setStatus(BlockStatus.FREE, Palette.freeColor);
        }
        dropIndex = rowIndex;
      }
    }

    if(dropIndex > -1) {
      const points: Point[] = new Array<Point>();
      for(let rowIndex = 0; rowIndex < dropIndex; rowIndex++) {
        for(let block of this.board[rowIndex]) {
          if(block.status() === BlockStatus.OCCUPIED) {
            points.push(block.point);
          }
        }
      }
      if(points.length > 0) {
        const superBlock = new SuperBlock(points);
        superBlock.init(this);
        superBlock.hardDrop(this);
      }
      this.givePoints(dropIndex);
    }
  }

  checkGameEnd(): void {
    for(let block of this.board[0]) {
      if(block.status() === BlockStatus.OCCUPIED) {
        this.control = null;
        this.done = true;
        const gameOver = document.createElement('div');
        gameOver.innerText = 'Game over. Replay by reloading page.';
        this.container.appendChild(gameOver);
        break;
      }
    }
  }

  /**
   * Signals freeze for currently controlled block and inits new block
   */
  signalFreeze(): void {
    this.checkOccupiedRows();
    this.control = blockFactory(this.WIDTH);
    this.checkGameEnd();
    if(!this.done) {
      this.control.init(this);
    }
  }

  /**
   * Runs a single iteration
   */
  run(): boolean {
    if(!this.done) {
      this.control.drop(this);
    }
    return this.done;
  }

  /**
   * Emits command for currently controlled block
   */
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
