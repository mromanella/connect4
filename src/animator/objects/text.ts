import { GameObject } from "./game-objects";

export class TextBox extends GameObject {

	ctx: CanvasRenderingContext2D;
	text: string;
	fontSize: string;
	fontFamily: string;
	color: string;
	baseLine: CanvasTextBaseline;
	fill: boolean = true;

	constructor(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, updateSpeed: number,
		color: string, fontSize: string, fontFamily: string) {
		super(ctx, x, y, updateSpeed);
		this.ctx = ctx;
		this.color = color;
		this.text = text;
		this.fontSize = fontSize;
		this.fontFamily = fontFamily;
		this.baseLine = "top";
	}

	draw() {
		this.ctx.beginPath();
		this.ctx.font = `${this.fontSize} ${this.fontFamily}`;
		this.ctx.textBaseline = this.baseLine;
		const metrics = this.ctx.measureText(this.text);
		if (this.fill) {
			this.ctx.fillStyle = this.color;
			this.ctx.fillText(this.text, this.location.x, this.location.y, metrics.width)
		} else {
			this.ctx.strokeStyle = this.color
			this.ctx.strokeText(this.text, this.location.x, this.location.y, metrics.width)
		}
	}
}

export class TextBoxGroup {

	ctx: CanvasRenderingContext2D;
	textBoxes: TextBox[];
	length: number;

	constructor(ctx: CanvasRenderingContext2D, textBoxes: TextBox[] = []) {
		this.ctx = ctx;
		this.textBoxes = textBoxes;
		this.length = this.textBoxes.length;
	}

	draw() {
		for (let textBox of this.textBoxes) {
			textBox.draw();
		}
	}
}

export class SelectTextBoxGroup extends TextBoxGroup {

	private _cursor: number;
	originalColors: string[] = [];
	selectedColor: string;

	constructor(ctx: CanvasRenderingContext2D, selectedColor: string, textBoxes: TextBox[]) {
		super(ctx);
		this.ctx = ctx;
		this.selectedColor = selectedColor;
		this.textBoxes = textBoxes;
		for (let textBox of this.textBoxes) {
			this.originalColors.push(textBox.color);
		}
		this.cursor = 0;
	}

	cursorUp() {
		this.cursor += 1;
	}

	cursorDown() {
		this.cursor -= 1;
	}

	
	public get cursor() : number {
		return this._cursor;
	}
	
	public set cursor(cursor : number) {
		if (cursor >= this.textBoxes.length) {
			this._cursor = 0;
		} else if (cursor < 0) {
			this._cursor = this.textBoxes.length - 1;
		} else {
			this._cursor = cursor;
		}
		for (let i = 0; i < this.textBoxes.length; i++) {
			if (i === this.cursor) {
				this.textBoxes[this.cursor].color = this.selectedColor;
			} else {
				this.textBoxes[i].color = this.originalColors[i];
			}
		}
	}
}