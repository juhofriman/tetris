import { Block, blockFactory } from './blocks/index';
import { BoardNode } from './BoardNode';
import { BlockStatus } from './BlockStatus';
import { Point } from './Point';
import { Palette, Color } from './palette';
import { KeyboardSignal } from './KeyboardSignal';

class BufferCmd {
  from: Point;
  to: Point;
  color: Color;
}

export class GameBoard {

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

  /**
   * Constructs game board and hooks it to the DOM
   */
  constructor(containerId: string, width: number, height: number) {
    this.HEIGHT = height;
    this.WIDTH = width;
    const container = document.getElementById(containerId);
    const table = document.createElement('table');

    for(var i:number = 0; i < this.HEIGHT; i++) {

      var rowElement = document.createElement('tr');
      this.board[i] = new Array<BoardNode>();
      for(var c:number = 0; c < this.WIDTH; c++) {
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

  /**
   * Sets point occupied in board with given color
   */
  setOccupied(point: Point, color: Color): void {
    if(point.x < 0) {
      return;
    }
    this.board[point.x][point.y].setStatus(BlockStatus.OCCUPIED, color);
  }

  /**
   * Sets point free in board
   */
  setFree(point: Point): void {
    if(point.x < 0) {
      return;
    }
    this.board[point.x][point.y].setStatus(BlockStatus.FREE, Palette.freeColor);
  }

  /**
   * Registers move for point to be executed with move()
   */
  registerMove(from: Point, to: Point, color: Color): Point {
    this.currentMoveBuffer.push({from: from, to: to, color: color})
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
      this.setOccupied(a.to, a.color);
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
    if(point.x >= this.HEIGHT) {
      return false;
    }
    return this.board[point.x][point.y].status() !== BlockStatus.OCCUPIED;
  }

  /**
   * Signals freeze for currently controlled block and inits new block
   */
  signalFreeze(): void {
    this.control = blockFactory(this.WIDTH);
    this.control.init(this);
  }

  /**
   * Runs a single iteration
   */
  run(): void {
    this.control.drop(this);
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
