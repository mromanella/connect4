import { GameObject } from "./animator/objects/game-objects";
import { RED_TOKEN_DATA, YELLOW_TOKEN_DATA } from "./constants";


class Token extends GameObject {

    readonly red = 'red';
    readonly yellow = 'yellow';

    image: HTMLImageElement;

    constructor(ctx: CanvasRenderingContext2D, x: number, y: number, color: string) {
        super(ctx, x, y, null);
        this.image = new Image();
        if (color === this.red) {
            this.image.src = RED_TOKEN_DATA;
        } else {
            this.image.src = YELLOW_TOKEN_DATA;
        }

    }
}
