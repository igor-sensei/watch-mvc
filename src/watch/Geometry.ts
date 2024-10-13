export class Matrix3x3 {
    elements: number[][];

    constructor(elements?: number[][]) {
        this.elements = elements || [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1],
        ];
    }

    static identity(): Matrix3x3 {
        return new Matrix3x3();
    }

    multiplyPoint(point: Point): Point {
        const [x, y] = [point.x, point.y];
        const e = this.elements;

        const newX = e[0][0] * x + e[0][1] * y + e[0][2] * 1;
        const newY = e[1][0] * x + e[1][1] * y + e[1][2] * 1;

        return new Point(newX, newY);
    }
}

export class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    translate(dx: number, dy: number): Point {
        const translationMatrix = new Matrix3x3([
            [1, 0, dx],
            [0, 1, dy],
            [0, 0, 1],
        ]);
        return translationMatrix.multiplyPoint(this);
    }

    rotate(angle: number): Point {
        const radians = (angle * Math.PI) / 180;
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);

        const rotationMatrix = new Matrix3x3([
            [cos, -sin, 0],
            [sin, cos, 0],
            [0, 0, 1],
        ]);
        return rotationMatrix.multiplyPoint(this);
    }

    scale(sx: number, sy: number): Point {
        const scaleMatrix = new Matrix3x3([
            [sx, 0, 0],
            [0, sy, 0],
            [0, 0, 1],
        ]);
        return scaleMatrix.multiplyPoint(this);
    }
}
