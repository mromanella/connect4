import Animator from "./animator/animator";
import Key from "./animator/keyboard/key";
import { ARROW_DOWN, ARROW_UP, ENTER } from "./animator/keyboard/keyNames";
import { TextBox, TextBoxGroup } from "./animator/objects/text";
import Scene from "./animator/scene";
import { PLAY_CLICKED } from "./constants";

export class MainMenu extends Scene {

    cursor: number = 0;
    title: TextBox;
    menuItems: TextBoxGroup;

    constructor(animator: Animator) {
        super(animator, 500);

        this.title = new TextBox(this.anim.ctx, 'Connect-Four!', 50, 100, 1000, 'black', '100px', 'Luckiest Guy');
        this.menuItems = new TextBoxGroup(this.anim.ctx);
        this.menuItems.textBoxes.push(new TextBox(this.anim.ctx, 'Singleplayer', 240, 300, 1000, 'black', '50px', 'Luckiest Guy'));
        this.menuItems.textBoxes.push(new TextBox(this.anim.ctx, 'Info', 360, 350, 1000, 'black', '40px', 'Luckiest Guy'));

        this.keys = [
            new Key(ARROW_UP, [() => {this.cursorUp()}]),
            new Key(ARROW_DOWN, [() => {this.cursorDown()}]), 
            new Key(ENTER, [() => {this.eventController.trigger(PLAY_CLICKED)}])
        ]

        this.cursorUp = this.cursorUp.bind(this);
        this.cursorDown = this.cursorDown.bind(this);
    }

    cursorDown() {
        this.cursor += 1;
        if (this.cursor > this.menuItems.textBoxes.length - 1) {
            this.cursor = 0;
        }
    }

    cursorUp() {
        this.cursor -= 1;
        if (this.cursor < 0) {
            this.cursor = this.menuItems.textBoxes.length - 1;
        }
    }

    draw() {
        this.title.draw();
        for (let menuItem of this.menuItems.textBoxes) {
            if (this.cursor === this.menuItems.textBoxes.indexOf(menuItem)) {
                menuItem.color = 'orange';
            } else {
                menuItem.color = 'black';
            }
            menuItem.draw();
        }
    }

}