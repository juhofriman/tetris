import { Color } from './palette';

/**
 * Point is a single block in game.
 */
export class Point {

  readonly color: Color;
  /** X coordinate */
  readonly x: number;
  /** Y coordinate */
  readonly y: number;

  constructor(color: Color, x: number, y:number) {
    this.color = color;
    this.x =x;
    this.y = y;
  }
  identifier(): string {
    return this.x + '-' + this.y;
  }
  down(): Point {
    return new Point(this.color, this.x + 1, this.y);
  }
  up(): Point {
    return new Point(this.color, this.x - 1, this.y);
  }
  left(): Point {
    return new Point(this.color, this.x, this.y - 1);
  }
  right(): Point {
    return new Point(this.color, this.x, this.y + 1);
  }
}
