import { Point } from './Point';
import { BlockStatus } from './BlockStatus';
import { Palette, Color } from './palette';

export class BoardNode {

  point: Point;
  nodeid: string;
  domNode: HTMLElement;

  constructor(domNode: HTMLElement, point: Point) {
    //this.point = point;
    this.domNode = domNode;
    this.domNode.id = point.identifier();
    this.domNode.style.backgroundColor = Palette.freeColor.hex;
  }

  identifier(): string {
    return this.nodeid;
  }

  setStatus(status: BlockStatus, color: Color): void {
    this.domNode.className = status.toString();
    this.domNode.style.backgroundColor = color.hex;
  }

  setOccupied(point: Point): void {
    this.domNode.className = BlockStatus.OCCUPIED.toString();
    this.domNode.style.backgroundColor = point.color.hex;
    this.point = point;
  }

  setFree(): void {
    this.domNode.className = BlockStatus.FREE.toString();
    this.domNode.style.backgroundColor = Palette.freeColor.hex;
    this.point = null;
  }

  status(): string {
    return this.domNode.className;
  }
}
