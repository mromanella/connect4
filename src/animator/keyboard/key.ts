
export default class Key {
    keyName: string;
    private onKeyPress: Function[] = [];
    private onKeyRelease: Function[] = [];
    private pressed: boolean = false;
    private locked: boolean = false;

    constructor(keyName: string, onKeyPress: Function[] = [], onKeyRelease: Function[] = []) {
        this.keyName = keyName;
        this.onKeyPress = onKeyPress;
        this.onKeyRelease = onKeyRelease;
    }

    private runOnKeyPress() {
        for (let func of this.onKeyPress) {
            func(this);
        }
    }

    private runOnKeyRelease() {
        for (let func of this.onKeyRelease) {
            func(this);
        }
    }

    clearOnKeyPress() {
        this.onKeyPress = [];
    }

    clearOnKeyRelease() {
        this.onKeyRelease = [];
    }

    addKeyPress(...funcs: Function[]) {
        this.onKeyPress.push(...funcs);
    }

    addKeyRelease(...funcs: Function[]) {
        this.onKeyRelease.push(...funcs);
    }

    run() {
        if (!this.isLocked()) {
            if (this.pressed) {
                this.runOnKeyPress();
            } else {
                this.runOnKeyRelease();
            }
        }
    }

    togglePressed(): boolean {
        this.pressed = !this.pressed;
        this.run();
        return this.isPressed();
    }

    setPressed(isPressed: boolean) {
        this.pressed = isPressed;
        this.run();
    }

    isPressed(): boolean {
        return this.pressed;
    }

    setLocked(isLocked: boolean) {
        this.locked = isLocked;
    }

    isLocked(): boolean {
        return this.locked;
    }
}
