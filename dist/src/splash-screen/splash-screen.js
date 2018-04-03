import { GameController } from "../game-controller";
import Utils from "../utils";
import PlayerPiece from "../piece/piece";
import { defaultSettings, GameType } from "../settings";
// Styles
import "./splash-screen.css";
export class SplashScreen {
    constructor(view) {
        this.titleLetters = [];
        this.clearBoardBtn = document.getElementById('clear-button');
        this.sidebar = document.getElementsByClassName('sidebar')[0];
        this.openSidebarButton = document.getElementsByClassName('open-sbbutton')[0];
        this.closeSidebarButton = document.getElementsByClassName('close-sidebar-btn')[0];
        this.skipIntro = false;
        this.gameController = null;
        this.connect4Title = 'Connect4';
        this.settings = defaultSettings;
        this.parent = view;
        this.splashScreen = document.createElement('div');
        Utils.addCssClass(this.splashScreen, ['splash-screen']);
        this.titleEl = document.createElement('div');
        Utils.addCssClass(this.titleEl, ['title']);
        // create letters for the animated title
        for (let c of this.connect4Title) {
            let letterBackground = document.createElement('div');
            let letter = document.createElement('div');
            Utils.addCssClass(letterBackground, ['letter-background']);
            Utils.addCssClass(letter, ['title-letters', 'typography']);
            letter.innerHTML = c;
            letterBackground.appendChild(letter);
            this.titleLetters.push(letter);
            this.titleEl.appendChild(letterBackground);
        }
        this.splashScreen.appendChild(this.titleEl);
        let btnBox = document.createElement('div');
        Utils.addCssClass(btnBox, ['btn-box']);
        this.computerDifficulty = document.createElement('select');
        for (let i = 1; i <= 3; i++) {
            let child = document.createElement('option');
            child.value = String(i);
            child.innerHTML = String(i);
            if (i === 1) {
                child.setAttribute('selected', 'true');
            }
            this.computerDifficulty.appendChild(child);
        }
        this.computerDifficulty.style.display = 'none';
        btnBox.appendChild(this.computerDifficulty);
        this.playerVsComputerBtn = document.createElement('button');
        Utils.addCssClass(this.playerVsComputerBtn, ['btn', 'player-vs-ai', 'typography']);
        this.playerVsComputerBtn.innerHTML = 'Player Vs Computer';
        this.playerVsPlayerBtn = document.createElement('button');
        Utils.addCssClass(this.playerVsPlayerBtn, ['btn', 'player-vs-player', 'typography']);
        this.playerVsPlayerBtn.innerHTML = 'Player Vs Player Local';
        this.playerVsPlayerOnlineBtn = document.createElement('button');
        Utils.addCssClass(this.playerVsPlayerOnlineBtn, ['btn', 'player-vs-player', 'typography']);
        this.playerVsPlayerOnlineBtn.innerHTML = 'Player Vs Player Online';
        this.skipIntroBtn = document.createElement('button');
        Utils.addCssClass(this.skipIntroBtn, ['btn', 'skip-intro', 'typography']);
        this.skipIntroBtn.innerHTML = 'Play';
        btnBox.appendChild(this.playerVsComputerBtn);
        btnBox.appendChild(this.playerVsPlayerBtn);
        btnBox.appendChild(this.playerVsPlayerOnlineBtn);
        btnBox.appendChild(this.skipIntroBtn);
        this.splashScreen.appendChild(this.titleEl);
        this.splashScreen.appendChild(btnBox);
        this.parent.appendChild(this.splashScreen);
        this.clearBoardBtn = document.getElementById('clear-button');
        this.sidebar = document.getElementsByClassName('sidebar')[0];
        this.openSidebarButton = document.getElementsByClassName('open-sbbutton')[0];
        this.closeSidebarButton = document.getElementsByClassName('close-sidebar-btn')[0];
        // playerVsAIBtn.disabled = true;
        this.playerVsComputerBtn.style.visibility = 'hidden';
        this.playerVsPlayerBtn.style.visibility = 'hidden';
        this.playerVsPlayerOnlineBtn.style.visibility = 'hidden';
        this.computerDifficulty.style.visibility = 'hidden';
        this.initButtons();
        this.initSplashScreen();
    }
    destroySplashScreen() {
        this.parent.removeChild(this.splashScreen);
    }
    destroyTitle() {
        this.titleEl.remove();
    }
    initSplashScreen() {
        // Set up splash screen
        for (let i = 0; i < this.titleLetters.length; i++) {
            setTimeout((e) => {
                if (i % 2 === 0) {
                    this.titleLetters[i].parentElement.dataset.pieceColor = PlayerPiece.colors.red;
                }
                else {
                    this.titleLetters[i].parentElement.dataset.pieceColor = PlayerPiece.colors.yellow;
                }
                Utils.fadeInOut(this.titleLetters[i].parentElement);
            }, (700 * i));
        }
        setTimeout((e) => {
            for (let i = 0; i < this.titleLetters.length; i++) {
                Utils.fadeIn(this.titleLetters[i].parentElement);
            }
            setTimeout((e) => {
                if (!this.skipIntro) {
                    Utils.shrink(this.titleEl);
                }
                setTimeout((e) => {
                    if (!this.skipIntro) {
                        this.playerVsComputerBtn.style.visibility = 'visible';
                        this.playerVsPlayerBtn.style.visibility = 'visible';
                        this.playerVsPlayerOnlineBtn.style.visibility = 'visible';
                        this.computerDifficulty.style.visibility = 'visible';
                        this.skipIntroBtn.style.visibility = 'hidden';
                    }
                    for (let i = 0; i < this.titleLetters.length; i++) {
                        Utils.bounceInfinite(this.titleLetters[i], i);
                    }
                }, 1000);
            }, 700);
        }, (700 * this.titleLetters.length));
    }
    toggleButtonsView() {
        if (this.playerVsComputerBtn.style.visibility === 'visible') {
            this.playerVsComputerBtn.style.visibility = 'hidden';
            this.computerDifficulty.style.visibility = 'hidden';
        }
        else {
            this.playerVsComputerBtn.style.visibility = 'visible';
            this.computerDifficulty.style.visibility = 'visible';
        }
        if (this.playerVsPlayerBtn.style.visibility === 'visible') {
            this.playerVsPlayerBtn.style.visibility = 'hidden';
        }
        else {
            this.playerVsPlayerBtn.style.visibility = 'visible';
        }
        if (this.playerVsPlayerOnlineBtn.style.visibility === 'visible') {
            this.playerVsPlayerOnlineBtn.style.visibility = 'hidden';
        }
        else {
            this.playerVsPlayerOnlineBtn.style.visibility = 'visible';
        }
    }
    initButtons() {
        this.clearBoardBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            Utils.vibrateDevice([25]);
            this.closeSidebarButton.click();
            await this.gameController.gameBoard.clearBoard();
            this.gameController.gameBoard.destroyBoard();
            this.gameController.newGame();
        });
        // Player vs AI button
        this.playerVsComputerBtn.addEventListener('click', (e) => {
            console.log('pva');
            Utils.vibrateDevice([25]);
            this.toggleButtonsView();
            // this.destroyTitle();
            // let settingsScreen = new SettingsScreen(this.settings);
            this.settings.difficulty = 1;
            // this.settings.difficulty = Number(this.computerDifficulty.options[this.computerDifficulty.selectedIndex].text);
            this.settings.aiColor = PlayerPiece.colors.yellow;
            this.settings.gameType = GameType.playerVsAI;
            this.gameController = new GameController(this.settings);
            Utils.slideOutTop(this.titleEl);
            setTimeout((e) => {
                this.splashScreen.style.visibility = 'hidden';
                Utils.slideFromBottom(this.gameController.boardElement);
                this.destroyTitle();
            }, 700);
        }, false);
        // Player vs Player button 
        this.playerVsPlayerBtn.addEventListener('click', (e) => {
            Utils.vibrateDevice([25]);
            this.toggleButtonsView();
            console.log('pvp');
            this.gameController = new GameController(this.settings);
            Utils.slideOutTop(this.titleEl);
            setTimeout((e) => {
                this.splashScreen.style.visibility = 'hidden';
                Utils.slideFromBottom(this.gameController.boardElement);
                this.destroyTitle();
            }, 700);
        }, false);
        // Player vs Player Online
        this.playerVsPlayerOnlineBtn.addEventListener('click', (e) => {
            Utils.vibrateDevice([25]);
            this.toggleButtonsView();
            console.log('pvp online');
            this.settings.gameType = GameType.playerVsPlayerOnline;
            this.gameController = new GameController(this.settings);
            Utils.slideOutTop(this.titleEl);
            setTimeout((e) => {
                this.splashScreen.style.visibility = 'hidden';
                Utils.slideFromBottom(this.gameController.boardElement);
                this.destroyTitle();
            }, 700);
        }, false);
        // Skip intro button
        this.skipIntroBtn.addEventListener('click', (e) => {
            Utils.vibrateDevice([25]);
            this.skipIntro = true;
            this.titleEl.classList.remove('shrink-anim');
            this.titleEl.classList.add('shrunk');
            this.toggleButtonsView();
            this.skipIntroBtn.style.display = 'none';
        }, false);
        // let gameController = new GameController(settings);
        this.openSidebarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            Utils.vibrateDevice([25]);
            if (this.sidebar.classList.contains('is-open')) {
                this.closeSideBar();
            }
            else {
                this.openSideBar();
            }
        });
        this.closeSidebarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            Utils.vibrateDevice([25]);
            this.closeSideBar();
        });
    }
    openSideBar() {
        this.sidebar.classList.add('open-sidebar');
        setTimeout((e) => {
            this.sidebar.classList.remove('open-sidebar');
            this.sidebar.classList.add('is-open');
        }, 400);
    }
    closeSideBar() {
        this.sidebar.classList.add('close-sidebar');
        setTimeout((e) => {
            this.sidebar.classList.remove('is-open');
            this.sidebar.classList.remove('close-sidebar');
        }, 400);
    }
}
