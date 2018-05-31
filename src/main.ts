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

interface Color {
  readonly hex: string;
}

class Palette {
  static freeColor: Color = {hex: '#ddd'}
  static colors: Color[] = [
    {hex: "#479030"},
    {hex: "#1B5209"},
    {hex: "#205211"},
    {hex: "#7ACE60"},
    {hex: "#89CE73"},
    {hex: "#226765"},
    {hex: "#063B39"},
    {hex: "#0C3B39"},
    {hex: "#459491"},
    {hex: "#529491"},
    {hex: "#8AA236"},
    {hex: "#4A5D0A"},
    {hex: "#4C5D13"},
    {hex: "#CCE86C"},
    {hex: "#D1E882"}]

  static random(): Color {
    return this.colors[Math.floor(Math.random() * this.colors.length)]
  }
}

interface Block {
  init(board: GameBoard): void
  drop(board: GameBoard): void
  hardDrop(board: GameBoard): void;
  left(board: GameBoard): void
  right(board: GameBoard): void
  canDrop(board: GameBoard): boolean
  canMoveLeft(board: GameBoard): boolean
  canMoveRight(board: GameBoard): boolean
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

class GameBoard {

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
    this.control = new OneBlock(0, 5);
    this.control.init(this);
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
    this.control = new OneBlock(0, 5);
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
