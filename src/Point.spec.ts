import { Point } from './Point';

describe('Point.ts', () => {
    it('Should generate reasonable identifier', () => {
        expect(new Point(0, 0).identifier()).toContain('0');
        expect(new Point(1, 0).identifier()).toContain('1');
        expect(new Point(1, 0).identifier()).toContain('0');
        expect(new Point(0, 1).identifier()).toContain('1');
        expect(new Point(0, 1).identifier()).toContain('0');
    });
    it('Should return point from left', () => {
      expect(new Point(1, 1).left().x).toEqual(1);
      expect(new Point(1, 1).left().y).toEqual(0);
    });
    it('Should return point from right', () => {
      expect(new Point(1, 1).right().x).toEqual(1);
      expect(new Point(1, 1).right().y).toEqual(2);
    });
    it('Should return point from up', () => {
      expect(new Point(1, 1).up().x).toEqual(0);
      expect(new Point(1, 1).up().y).toEqual(1);
    });
    it('Should return point from down', () => {
      expect(new Point(1, 1).down().x).toEqual(2);
      expect(new Point(1, 1).down().y).toEqual(1);
    });
});
