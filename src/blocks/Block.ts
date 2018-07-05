import { GameBoard} from '../GameBoard';

export interface Block {
  init(board: GameBoard): void;
  flip(board: GameBoard): void;
  drop(board: GameBoard): void;
  hardDrop(board: GameBoard): void;
  left(board: GameBoard): void;
  right(board: GameBoard): void;
}
