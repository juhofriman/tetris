import { Point } from './Point';
import { BlockStatus } from './BlockStatus';
import { Palette, Color } from './palette';

export class BoardNode {

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
