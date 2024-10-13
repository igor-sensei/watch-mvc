import { Matrix3x3, Point } from '../Geometry';

// Importing Jest for unit testing
describe('Matrix3x3', () => {
  test('should create an identity matrix by default', () => {
    const matrix = new Matrix3x3();
    expect(matrix.elements).toEqual([
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]);
  });

  test('should create a matrix from provided elements', () => {
    const elements = [
      [2, 0, 0],
      [0, 3, 0],
      [0, 0, 1],
    ];
    const matrix = new Matrix3x3(elements);
    expect(matrix.elements).toEqual(elements);
  });

  test('should multiply a point correctly', () => {
    const matrix = new Matrix3x3([
      [2, 0, 1],
      [0, 2, 1],
      [0, 0, 1],
    ]);
    const point = new Point(1, 1);
    const result = matrix.multiplyPoint(point);
    expect(result.x).toBe(3);
    expect(result.y).toBe(3);
  });
});

describe('Point', () => {
  test('should create a point with given coordinates', () => {
    const point = new Point(5, 10);
    expect(point.x).toBe(5);
    expect(point.y).toBe(10);
  });

  test('should translate a point correctly', () => {
    const point = new Point(3, 4);
    const translatedPoint = point.translate(2, 3);
    expect(translatedPoint.x).toBe(5);
    expect(translatedPoint.y).toBe(7);
  });

  test('should rotate a point correctly around origin', () => {
    const point = new Point(1, 0);
    const rotatedPoint = point.rotate(90);
    expect(rotatedPoint.x).toBeCloseTo(0);
    expect(rotatedPoint.y).toBeCloseTo(1);
  });

  test('should scale a point correctly', () => {
    const point = new Point(2, 3);
    const scaledPoint = point.scale(2, 3);
    expect(scaledPoint.x).toBe(4);
    expect(scaledPoint.y).toBe(9);
  });
});
