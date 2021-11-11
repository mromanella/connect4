import { BoundingBox, GameObject, Point } from "./game-objects";

export class Circle extends GameObject {

	ctx: CanvasRenderingContext2D;
	radius: number;
	color: string;
	fill: boolean = true;
	lineWidth: number = 1;

	/**
	 * Initializes a Circle
	 * @param radius Radious
	 * @param color Color
	 */
	constructor(ctx: CanvasRenderingContext2D, x: number, y: number, updateSpeed: number, radius: number, color: string) {
		super(ctx, x, y, updateSpeed);
		this.ctx = ctx;
		this.radius = radius;
		this.color = color;
	}

	equals(other: Circle): boolean {
		return this.location.equals(other.location) && (this.radius === other.radius);
	}

	draw(drawBB: boolean = false) {
		this.ctx.beginPath();
		this.ctx.arc(this.location.x, this.location.y, this.radius, 0, 2 * Math.PI, false);
		if (this.fill) {
			this.ctx.fillStyle = this.color;
			this.ctx.fill();
		} else {
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.strokeStyle = this.color;
			this.ctx.stroke();
		}

		if (drawBB) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = 'red';
			let bb = this.getBoundingBox();
			let diameter = this.getDiameter()
			this.ctx.strokeRect(bb.xMin, bb.yMin, diameter, diameter);
		}
	}

	getBoundingBox(): BoundingBox {
		let xMin = this.location.x - this.radius;
		let yMin = this.location.y - this.radius;
		let xMax = this.location.x + this.radius;
		let yMax = this.location.y + this.radius;
		return new BoundingBox(xMin, yMin, xMax, yMax);
	}

	getDiameter() {
		return this.radius * 2;
	}
}

export class Line extends GameObject {

	ctx: CanvasRenderingContext2D;
	width: number;
	color: string;
	fill = true;
	lineWidth = 1;
	numPoints: number
	distanceBetweenPoints: number;
	path: Point[];
	direction: Point;
	updateSpeed: number;
	updateInterval: number;

	/**
	 * Creates a Line
	 * @param path List of points to initialize the line.
	 * @param width Width of the line.
	 * @param color Color of the line.
	 */
	constructor(ctx: CanvasRenderingContext2D, x: number, y: number, updateSpeed: number,
		width: number, color: string, direction: Point, numPoints: number = 1, distanceBetweenPoints: number = 1) {
		super(ctx, x, y, updateSpeed);
		this.ctx = ctx;
		this.numPoints = numPoints;
		this.distanceBetweenPoints = distanceBetweenPoints;
		this.path = [this.location.copy()];
		for (let i = 0; i < numPoints; i++) {
			this.path.push(this.path[i].add((direction.multiply(distanceBetweenPoints))));
		}
		this.direction = direction;
		this.width = width;
		this.color = color;
	}

	draw(drawBB: boolean = false) {
		this.ctx.beginPath();
		let point1 = this.path[0];
		this.ctx.moveTo(point1.x, point1.y);
		for (let i = 1; i < this.path.length; i++) {
			let point2 = this.path[i];
			this.ctx.lineTo(point2.x, point2.y);
		}

		this.ctx.lineWidth = this.width;
		this.ctx.strokeStyle = this.color;
		this.ctx.stroke();

		if (drawBB) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = 'red';
			let bb = this.getBoundingBox();
			const width = bb.xMax - bb.xMin;
			const height = bb.yMax - bb.yMin;
			this.ctx.strokeRect(bb.xMin, bb.yMin, width, height);
		}
	}

	getBoundingBox() {
		const pt1 = this.path[0];
		const pt2 = this.path[this.path.length - 1];
		return new BoundingBox(pt1.x, pt1.y, pt2.x, pt2.y);
	}

	getMidpoint(pos1: number, pos2: number): Point {
		let ptA = this.path[pos1];
		let ptB = this.path[pos2];
		return ptA.midpoint(ptB);
	}

	appendPoint(point: Point) {
		this.path.push(point);
	}

	popPoint(index: number = -1): Point {
		if (index >= 0) {
			return this.path.splice(index, 1)[0];
		} else {
			return this.path.pop();
		}
	}
}

export class Rectangle extends GameObject {

	ctx: CanvasRenderingContext2D;
	width: number;
	height: number;
	color: string;
	fill: boolean = true;
	lineWidth: number = 1;
	updateSpeed: number;
	updateInterval: number;

	constructor(ctx: CanvasRenderingContext2D, x: number, y: number, updateSpeed: number, width: number, height: number, color: string) {
		super(ctx, x, y, updateSpeed);
		this.ctx = ctx;
		this.width = width;
		this.height = height;
		this.color = color;
		this.update = this.update.bind(this);
	}

	equals(other: Rectangle): boolean {
		return this.location.equals(other.location) && (this.width === other.width && this.height === other.height);
	}

	update() {

	}

	draw(drawBB: boolean = false) {
		this.ctx.beginPath();
		if (this.fill) {
			this.ctx.fillStyle = this.color;
			this.ctx.fillRect(this.location.x, this.location.y, this.width, this.height);
		} else {
			this.ctx.lineWidth = this.lineWidth;
			this.ctx.strokeStyle = this.color;
			this.ctx.strokeRect(this.location.x, this.location.y, this.width, this.height);
		}

		if (drawBB) {
			this.ctx.beginPath();
			this.ctx.strokeStyle = 'red';
			let bb = this.getBoundingBox();
			this.ctx.strokeRect(bb.xMin, bb.yMin, this.width, this.height);
		}
	}

	getBoundingBox(): BoundingBox {
		let xMin = this.location.x;
		let yMin = this.location.y;
		let xMax = this.location.x + this.width;
		let yMax = this.location.y + this.height;
		return new BoundingBox(xMin, yMin, xMax, yMax);
	}
}
