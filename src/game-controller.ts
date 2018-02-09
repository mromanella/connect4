import Board from './board';
import PlayerPiece from './piece';
import { ComputerController } from './computer-controller';
import { Settings } from './settings';

export class GameController {

    boardElement: HTMLElement;
    gameBoard: Board;
    settings: Settings;
    computerController: ComputerController;

    constructor(settings: Settings) {
        this.boardElement = document.getElementById('board');
        let startingTurn = settings.startingTurn;
        this.settings = settings;

        this.newGame();

        this.boardElement.addEventListener(Board.events.gameOver.type, (e: CustomEvent) => {
            console.log(e.detail)
            e.stopPropagation();

        }, false);

        this.boardElement.addEventListener(Board.events.dropOutComplete.type, (e) => {
            e.stopPropagation();
            this.gameBoard.destroyBoard();
            // console.log('stupid exception');
            this.newGame();
        }, false);

        this.boardElement.addEventListener(Board.events.changeTurn.type, (e: CustomEvent) => {
            e.stopPropagation();
            if (this.gameBoard.currentTurn === this.settings.aiColor) {
                if (this.gameBoard.gameRunning) {
                    this.computerController.decideMove()
                }
            }
        }, false);
    }

    private newGame() {
        this.gameBoard = new Board(this.boardElement, this.settings);
        this.setupComputer();
    }

    private setupComputer() {
        this.computerController = new ComputerController(this.gameBoard, this.settings)
    }
}