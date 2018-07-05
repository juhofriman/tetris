import { GameBoard} from './GameBoard';
import { KeyboardSignal } from './KeyboardSignal';

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
