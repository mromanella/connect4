import Animator from "./animator/animator";
import { ARROW_DOWN, ARROW_UP, ENTER } from "./animator/keyboard/keyNames";
import { SelectTextBoxGroup, TextBox } from "./animator/objects/text";
import Scene from "./animator/scene";
import { PLAY_CLICKED } from "./constants";

export class MainMenu extends Scene {

    cursor: number = 0;
    title: TextBox;
    menuItems: SelectTextBoxGroup;

    constructor(animator: Animator) {
        super(animator, 500);

        this.title = new TextBox(this.anim.ctx, 'Connect-Four!', this.anim.getWidth() / 2, 100, null, 'black', '100px', 'Luckiest Guy');
        this.menuItems = new SelectTextBoxGroup(this.anim.ctx, 'orange', [
            new TextBox(this.anim.ctx, 'Singleplayer', this.anim.getWidth() / 2, 300, null, 'black', '50px', 'Luckiest Guy'),
            new TextBox(this.anim.ctx, 'Info', this.anim.getWidth() / 2, 350, null, 'black', '40px', 'Luckiest Guy')
        ]);
        this.title.align = 'center';
        this.title.baseline = 'middle';
        this.menuItems.setAlign('center');
        this.menuItems.setBaseline('middle');

        this.keyboardController.add(ARROW_UP, [() => { this.menuItems.cursorUp() }]);
        this.keyboardController.add(ARROW_DOWN, [() => { this.menuItems.cursorDown() }]);
        this.keyboardController.add(ENTER, [() => { this.eventController.trigger(PLAY_CLICKED) }]);
    }

    draw() {
        this.title.draw();
        this.menuItems.draw();
    }

}
