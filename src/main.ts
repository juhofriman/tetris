const WIDTH = 20;
const HEIGHT = 40;
const EMPTY = 'E';

class Block {

  x: number;
  y: number;
  domNode: HTMLElement;

  constructor(domNode: HTMLElement, x: number, y: number) {
    this.x = x;
    this.y = y;
    this.domNode = domNode;
    this.domNode.id = this.identifier();
  }

  identifier(): string {
    return this.x + '-' + this.y;
  }

  setClass(clazz: string): void {
    this.domNode.className = clazz;
  }
}

class GameBoard {

  board: Block[][] = new Array<Block[]>();

  /**
   * Constructs game board and hooks it to the DOM
   */
  constructor(containerId: string) {

    const container = document.getElementById(containerId);
    const table = document.createElement('table');

    for(var i:number = 0; i < HEIGHT; i++) {

      var rowElement = document.createElement('tr');
      this.board[i] = new Array<Block>();
      for(var c:number = 0; c < WIDTH; c++) {
        var block = this.board[i][c];
        var node = document.createElement('td');

        this.board[i][c] = new Block(node, i, c);

        rowElement.appendChild(node);
      }
      table.appendChild(rowElement);
    }

    container.appendChild(table);
  }

  handleChange(x: number, y: number, message: string): void {
    this.board[x][y].setClass(message)
  }

}

const game = new GameBoard('game');

class OneBlock {

  x: number;
  y: number;

  constructor( x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  drop(board: GameBoard): void {
    board.handleChange(this.x, this.y, '');
    this.x++;
    board.handleChange(this.x, this.y, 'occupied');
  }

  left(board: GameBoard): void {
    board.handleChange(this.x, this.y, '');
    this.y--;
    board.handleChange(this.x, this.y, 'occupied');
  }

  right(board: GameBoard): void {
    board.handleChange(this.x, this.y, '');
    this.y++;
    board.handleChange(this.x, this.y, 'occupied');
  }
}

const block = new OneBlock(0, 5);

(function loop() {
  block.drop(game);

  setTimeout(loop, 500);
})();

document.onkeydown = function(e: KeyboardEvent) {


    if (e.keyCode == 38) {
        console.log('up');

    }
    else if (e.keyCode == 40) {
        console.log('down');
    }
    else if (e.keyCode == 37) {
       console.log('left');
       block.left(game);

    }
    else if (e.keyCode == 39) {
       console.log('right');
       block.right(game);
    }

}



/* Draws the game state
const draw = (game) => {
  let element = document.getElementById('game');
  let gameView = '';
  game.forEach((line) => {
    line.forEach((block) => {
      if(block === EMPTY) {
        gameView += ' ';
      } else {
        gameView += block;
      }
    });
    gameView += "\n";
  });
  element.innerHTML = gameView;
}

const initGame = () => {
  return R.repeat(R.repeat(EMPTY, WIDTH), HEIGHT);
}

const newObject = () => {
  return {
    coords: [[0, 15], [0, 16], [0, 17], [0, 18]],
    character: '*',
    freeze: (game) => {

    },
    switch: () => {
      if(R.uniq(R.map(R.nth(0), this.coords)).length === 1) {
        let pivot = R.nth(1, R.nth(1, this.coords));
        let row  = R.nth(0, R.nth(0, this.coords));
        this.coords = [
          [row-1, pivot],
          [row, pivot],
          [row+1, pivot],
          [row+2, pivot]
        ];
      } else {
        let pivot = R.nth(1, R.nth(1, this.coords));
        let row  = R.nth(0, R.nth(1, this.coords));
        this.coords = [
          [row, pivot-1],
          [row, pivot],
          [row, pivot+1],
          [row, pivot+2]
        ];
      }

    }
  }
}

let control = newObject();

let game = null;

const move = (game) => {
  return mapIndexed((row, rowNbr) => {
    return mapIndexed((block, blockNbr) => {
      if(R.contains([rowNbr, blockNbr], control.coords)) {
        return control.character;
      }
      return EMPTY;
    }, row);
  }, game);
}

const drop = () => {
  control = R.evolve({coords: R.map((coords) => { return [R.inc(R.nth(0, coords)), R.nth(1, coords)]})}, control);
}


const loop = () => {
  drop();
  game = move(game);
  draw(game);
  setTimeout(() => {
    loop();
  }, 500);
}

game = initGame();
loop();

document.onkeydown = (ev) => {

    let e = ev || window.event;

    if (e.keyCode == '38') {
        console.log('up');
        control.switch();
    }
    else if (e.keyCode == '40') {
        console.log('down');
    }
    else if (e.keyCode == '37') {
       console.log('left');
       control = R.evolve({coords: R.map((coords) => { return [R.nth(0, coords), R.dec(R.nth(1, coords))]})}, control);
       game = move(game);
       draw(game);
    }
    else if (e.keyCode == '39') {
       console.log('right');
       control = R.evolve({coords: R.map((coords) => { return [R.nth(0, coords), R.inc(R.nth(1, coords))]})}, control);
       game = move(game);
       draw(game);
    }

}*/
