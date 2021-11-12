import Key from './key';

/** KeyboardController
 *
 *
 *
 */
export class KeyboardController extends Map<string, Key> {

    constructor() {
        super();
        this.clearAllPresses();
        this.keyCapture = this.keyCapture.bind(this);
        this.listen = this.listen.bind(this);
        this.stopListening = this.stopListening.bind(this);
    }

    /**
     * Adds the key to be watched by the KeyBoardController. If a key with
     * the same key.keyName already exists then remove the old and replace it
     * with the new.
     * @param key
     */
    add(keyName: string, onKeyPress: Function[] = [], onKeyRelease: Function[] = []) {
        // Remove if already found and overwrite
        let key = this.remove(keyName);
        if (key) {
            key.clearOnKeyPress();
            key.clearOnKeyRelease();
        } else {
            key = new Key(keyName);
        }
        key.addKeyPress(...onKeyPress);
        key.addKeyRelease(...onKeyRelease)
        this.set(keyName, key);
    }

    /**
     * Removes the Key associated to the keyName and returns the Key object.
     * If the key does not exist returns null.
     * @param keyName
     * @returns The Key object which was removed or null.
     */
    remove(keyName: string): Key | null {
        if (this.has(keyName)) {
            // Remove the old one and return it
            // Overwrite with new
            const oldKey = this.get(keyName);
            this.delete(keyName);
            return oldKey;
        }
        return null;
    }

    /**
     * @param keyName
     * @returns The Key object associated to the keyName or null if not found.
     */
    get(keyName: string): Key | null {
        if (this.has(keyName)) {
            return super.get(keyName);
        }
        return null;
    }

    keyCapture(keyEvent: KeyboardEvent) {
        keyEvent.preventDefault();
        keyEvent.stopImmediatePropagation();
        const keyName = keyEvent.key;
        const keyObj = this.get(keyName);
        if (keyObj) {
            if (keyEvent.type == 'keypress' || keyEvent.type == 'keydown') {
                keyObj.setPressed(true);
            } else {
                // Assumes keyup
                keyObj.setPressed(false);
            }
        }
    }

    /**
     * @returns The list of defined Key objects.
     */
    getAllKeys(): Key[] {
        return [...this.values()];
    }

    /**
     * @returns A list of Key objects that are currently pressed.
     */
    getPressedKeys(): Key[] {
        const pressed = [];
        for (let key of this.values()) {
            if (key.isPressed()) {
                pressed.push(key);
            }
        }
        return pressed;
    }

    /**
     * @returns A list of the keyNames that are currently pressed.
     */
    getPressedKeysNames(): string[] {
        const pressed = [];
        for (let key of this.getPressedKeys()) {
            pressed.push(key.keyName);
        }
        return pressed;
    }

    /**
     * Sets the value of isPressed for each Key to false.
     * Runs the onKeyRelease functions associated to each key
     */
    clearAllPresses() {
        for (let key of this.values()) {
            key.setPressed(false);
        }
    }

    lockKey(keyName: string) {
        const key = this.get(keyName);
        if (key) {
            key.setLocked(true);
        }
    }

    unlockKey(keyName: string) {
        const key = this.get(keyName);
        if (key) {
            key.setLocked(false);
        }
    }

    getLockedKeys(): Key[] {
        const keys = [];
        for (let key of this.values()) {
            if (key.isLocked()) {
                keys.push(key);
            }
        }
        return keys;
    }

    getLockedKeyNames(): string[] {
        const keys = [];
        for (let key of this.getLockedKeys()) {
            keys.push(key.keyName);
        }
        return keys;
    }

    unlockAllLockedKeys() {
        for (let key of this.getLockedKeys()) {
            key.setLocked(false);
        }
    }

    listen() {
        addEventListener('keydown', this.keyCapture, true);
        addEventListener('keypress', this.keyCapture, true);
        addEventListener('keyup', this.keyCapture, true);
    }

    stopListening() {
        removeEventListener('keydown', this.keyCapture, true);
        removeEventListener('keypress', this.keyCapture, true);
        removeEventListener('keyup', this.keyCapture, true);
    }
}

export function updatePressCounts(kbController: KeyboardController, keyPressCounts: any) {
    for (let key of kbController.getAllKeys()) {
        if (key.isPressed()) {
            keyPressCounts[key.keyName]++;
        } else {
            if (keyPressCounts[key.keyName] > 0) {
                keyPressCounts[key.keyName]--;
            } else if (keyPressCounts[key.keyName] < 0) {
                keyPressCounts[key.keyName] = 0;
            }
        }
    }
}
