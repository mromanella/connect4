
class BoundingBox {
	xMin: number;
	yMin: number;
	xMax: number;
	yMax: number;

	constructor(xMin: number, yMin: number, xMax: number, yMax: number) {
		this.xMin = xMin;
		this.yMin = yMin;
		this.xMax = xMax;
		this.yMax = yMax;
	}
}

class Point {

	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
	}

	copy(): Point {
		return new Point(this.x, this.y);
	}

	equals(other: Point): boolean {
		return (this.x === other.x && this.y === other.y);
	}

	midpoint(other: Point): Point {
		return new Point((this.x + other.x) / 2, (this.y + other.y) / 2);
	}

	distance(other: Point): number {
		return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
	}

	magnitude(): number {
		return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
	}

	direction(): Point {
		let magnitude = this.magnitude();
		return this.divide(magnitude);
	}

	diff(other: number | Point): Point {
		if (typeof other == 'number') {
			return new Point(this.x - other, this.y - other);
		}
		if (other instanceof Point) {
			return new Point(this.x - other.x, this.y - other.y);
		}

	}

	add(other: number | Point): Point {
		if (typeof other == 'number') {
			return new Point(this.x + other, this.y + other);
		}
		if (other instanceof Point) {
			return new Point(this.x + other.x, this.y + other.y);
		}
	}

	multiply(other: number | Point): Point {
		if (typeof other == 'number') {
			return new Point(this.x * other, this.y * other);
		}
		if (other instanceof Point) {
			return new Point(this.x * other.x, this.y * other.y);
		}
	}

	divide(other: number | Point): Point {
		if (typeof other == 'number') {
			return new Point(this.x / other, this.y / other);
		}
		if (other instanceof Point) {
			return new Point(this.x / other.x, this.y / other.y);
		}
	}
}

class GameObject {

	ctx: CanvasRenderingContext2D;
	location: Point;
	shouldDraw: boolean = true;
	shouldUpdate: boolean = true;
	updateSpeed: number;
	updateInterval: number = null;

	constructor(ctx: CanvasRenderingContext2D, x: number, y: number, updateSpeed: number = null) {
		this.ctx = ctx;
		this.location = new Point(x, y);
		this.updateSpeed = updateSpeed;
		this.update = this.update.bind(this);
		this.draw = this.draw.bind(this);
	}
	update() {

	}

	draw() {

	}

	getBoundingBox(): BoundingBox {
		return null;
	}

	setUpdateInterval() {
		this.clearUpdateInterval();
		if (this.updateSpeed !== null) {
			this.updateInterval = setInterval(this.update, this.updateSpeed);
		}
	}

	clearUpdateInterval() {
		clearInterval(this.updateInterval);
	}
}

export { BoundingBox, Point, GameObject };
