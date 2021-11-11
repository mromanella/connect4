import Animator from "./animator";
import { SoundController, getSoundController } from "./sounds";
import { EventController, getEventController } from "./events";
import { KeyboardController, getKeyboardController, Key } from "./keyboard/index";
import { GameObject } from "./objects/index";

/** @description A Scene to draw. Has access to the sound, event and keyboard controllers.
 * Must implement the update and draw methods im subclass.
 * 
 * @param anim The Animator object this scene belongs to.
 * @param updateSpeed How fast the scene should update. For fine grained control implement an objects
 * updates on your own.

*/

class Scene {

    anim: Animator;
    soundController: SoundController = getSoundController();
    eventController: EventController = getEventController();
    keyboardController: KeyboardController = getKeyboardController();
    updateSpeed: number;
    updateInterval: number = null;
    keys: Key[] = [];

    constructor(anim: Animator, updateSpeed: number = null) {
        this.anim = anim;
        this.updateSpeed = updateSpeed;
        this.draw = this.draw.bind(this);
        this.update = this.update.bind(this);
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
    }

    update() {

    }

    draw() {

    }

    start() {
        for (let key of this.keys) {
            this.keyboardController.addKey(key);
        }
        this.keyboardController.listen();
        this.anim.setCallback(this.draw);
        this.anim.resume();
        if (this.updateSpeed !== null) {
            this.updateInterval = setInterval(this.update, this.updateSpeed);
        }
    }

    resume() {
        this.anim.resume();
        if (this.updateSpeed !== null) {
            this.updateInterval = setInterval(this.update, this.updateSpeed);
        }
    }

    pause() {
        clearInterval(this.updateInterval);
        this.anim.pause();
    }

    stop() {
        this.anim.stop();
        clearInterval(this.updateInterval);
        this.keyboardController.stopListening();
        for (let key of this.keys) {
            this.keyboardController.removeKey(key.keyName);
        }
    }
}

export default Scene;