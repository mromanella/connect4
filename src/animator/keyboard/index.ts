import Key from './key';
import { KeyboardController } from './keyboardController';
import * as keyNames from './keyNames';

export { Key, KeyboardController, keyNames }

let controller: KeyboardController = null;

export function lockKeys(keys: Key[]) {
    for (let key of keys) {
        key.setLocked(true);
    }
}

export function unlockKeys(keys: Key[]) {
    for (let key of keys) {
        key.setLocked(false);
    }
}

export function getKeyboardController(keys: Key[] = []): KeyboardController {
    if (!controller) {
        controller = new KeyboardController([]);
    }
    for (let key of keys) {
        controller.addKey(key);
    }
    return controller;
}
