import Board from './board/board';
import PlayerPiece from './piece/piece';
import { ComputerController } from './computer-controller';
import { Settings } from './settings';

export class GameController {

    boardElement: HTMLElement;
    gameBoard: Board;
    settings: Settings;
    computerController: ComputerController;
    thinkingStatus: HTMLElement;

    constructor(settings: Settings) {
        this.boardElement = document.getElementById('board');
        let startingTurn = settings.startingTurn;
        this.settings = settings;
        this.thinkingStatus = document.getElementById('loading-block');

        this.gameBoard = this.createGame();
        this.computerController = this.setupComputer();

        this.boardElement.addEventListener(Board.events.gameOver.type, (e: CustomEvent) => {
            console.log(e.detail)
            e.stopPropagation();

        }, false);

        this.boardElement.addEventListener(Board.events.changeTurn.type, (e: CustomEvent) => {
            e.stopPropagation();
            // this.thinkingStatus.style.setProperty('display', 'none');
            if (this.gameBoard.currentTurn === this.settings.aiColor) {
                // this.thinkingStatus.style.setProperty('display', 'inline');
                if (this.gameBoard.gameRunning) {
                    this.computerController.decideMove();
                }
            }
        }, false);
    }

    private createGame(): Board {
        let board = new Board(this.boardElement, this.settings);
        return board;
    }

    newGame() {
        this.gameBoard = this.createGame();
        this.computerController = this.setupComputer();
    }

    private setupComputer(): ComputerController {
        return new ComputerController(this.gameBoard, this.settings);
    }
}