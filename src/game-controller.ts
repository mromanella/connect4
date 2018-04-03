import Board from './board/board';
import PlayerPiece from './piece/piece';
import { ComputerController } from './computer-controller';
import { Settings, GameType } from './settings';

import * as io from 'socket.io-client';
import * as uuid4 from 'uuid/v4'

interface message {
    roomId: any;
    column: number;
    clientId: any;
    msg: string;
}

export class GameController {

    boardElement: HTMLElement;
    gameBoard: Board;
    settings: Settings;
    computerController: ComputerController;
    thinkingStatus: HTMLElement;
    socket: WebSocket;
    roomId: any;
    clientId: any;

    constructor(settings: Settings) {
        this.boardElement = document.getElementById('board');
        let startingTurn = settings.startingTurn;
        this.settings = settings;
        this.thinkingStatus = document.getElementById('loading-block');

        this.gameBoard = this.createGame();
        this.computerController = this.setupComputer();

        if (this.settings.gameType === GameType.playerVsPlayerOnline) {
            this.clientId = uuid4();
            this.socket = new WebSocket('ws://localhost:9090/ws');
            this.socket.onopen = () => {
                this.socket.send(JSON.stringify({ roomId: uuid4(), clientId: this.clientId, column: -1, msg: 'join' }));
            }
            this.socket.onmessage = (e) => {
                // console.log('on message');
                let m: message = JSON.parse(e.data);
                this.clientId = m.clientId;
                this.roomId = m.roomId;
            }
        }

        this.boardElement.addEventListener(Board.events.gameOver.type, (e: CustomEvent) => {
            // console.log(e.detail)
            e.stopPropagation();

        }, false);

        this.boardElement.addEventListener(Board.events.changeTurn.type, (e: CustomEvent) => {
            e.stopPropagation();
            let column = e.detail.column;
            // this.thinkingStatus.style.setProperty('display', 'none');
            if (this.settings.gameType === GameType.playerVsAI && this.gameBoard.currentTurn === this.gameBoard.opponentsColor) {
                // this.thinkingStatus.style.setProperty('display', 'inline');
                if (this.gameBoard.gameRunning) {
                    this.computerController.decideMove();
                }
            } else if (this.settings.gameType === GameType.playerVsPlayerOnline && this.gameBoard.currentTurn === this.gameBoard.opponentsColor) {
                // Was just my turn. Send my move
                // console.log('Send move');
                let m: message = { roomId: this.roomId, column: column, msg: 'leave', clientId: this.clientId };
                this.socket.send(JSON.stringify(m));
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