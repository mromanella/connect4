import Animator from "./animator/animator";
import { getEventController } from "./animator/events";
import { getSoundController } from "./animator/sounds";
import { PLAY_CLICKED } from "./constants";
import { MainMenu } from "./main-menu";

const animator = new Animator('#game', 30);
const mainMenu = new MainMenu(animator);
// const singleplayer = new

const eventController = getEventController();
const soundController = getSoundController();

eventController.register(PLAY_CLICKED, () => {
    mainMenu.stop();

})

animator.setCallback(() => {
    mainMenu.draw();
})

mainMenu.start();
