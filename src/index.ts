import "../src/index.css";
// import "../src/bulma.css"; 
import Board from "./board/board";
import PlayerPiece from "./piece/piece";
import { GameController } from './game-controller';
import Utils from "./utils";
import { SplashScreen } from "./splash-screen/splash-screen";

window.onload = (e) => {

    // playerVsComputerBtn.style.display = 'none';
    let banner = document.getElementById('banner');
    // splash
    let splashContainer = document.getElementById('screen-container');
    let splashScreen = new SplashScreen(splashContainer);
    document.body.style.visibility = 'visible';

}