import Board from './board/board';
import { ComputerController } from './computer-controller';
import { GameType } from './settings';
import * as io from 'socket.io-client';
export class GameController {
    constructor(settings) {
        this.boardElement = document.getElementById('board');
        let startingTurn = settings.startingTurn;
        this.settings = settings;
        this.thinkingStatus = document.getElementById('loading-block');
        this.gameBoard = this.createGame();
        this.computerController = this.setupComputer();
        if (this.settings.gameType === GameType.playerVsPlayerOnline) {
            this.socket = io.connect('/', {
                path: '/ws'
            });
            // When I connect
            this.socket.on('connect', () => {
                console.log('connected');
                this.socket.on('success', (msg) => {
                    console.log('success');
                    msg = JSON.parse(msg);
                    this.roomId = msg.RoomID;
                    this.clientId = msg.ClientID;
                    console.log(msg);
                });
                this.socket.on('disconnect', (msg) => {
                    console.log('opponent disconnected', msg);
                });
                this.socket.on('message', (msg) => {
                    console.log('message', msg);
                });
            });
            // this.socket.emit('move', JSON.stringify({ roomId: this.roomId, column: 0 }));
            this.socket.emit('join', '*');
        }
        this.boardElement.addEventListener(Board.events.gameOver.type, (e) => {
            console.log(e.detail);
            e.stopPropagation();
        }, false);
        this.boardElement.addEventListener(Board.events.changeTurn.type, (e) => {
            e.stopPropagation();
            let column = e.detail.column;
            // this.thinkingStatus.style.setProperty('display', 'none');
            if (this.settings.gameType === GameType.playerVsAI && this.gameBoard.currentTurn === this.settings.aiColor) {
                // this.thinkingStatus.style.setProperty('display', 'inline');
                if (this.gameBoard.gameRunning) {
                    this.computerController.decideMove();
                }
            }
            else if (this.settings.gameType === GameType.playerVsPlayerOnline && this.gameBoard.currentTurn === this.gameBoard.opponentsColor) {
                // Was just my turn. Send my move
                console.log('Send move');
                this.socket.emit('move', JSON.stringify({ roomId: this.roomId, column: column }));
            }
        }, false);
    }
    createGame() {
        let board = new Board(this.boardElement, this.settings);
        return board;
    }
    newGame() {
        this.gameBoard = this.createGame();
        this.computerController = this.setupComputer();
    }
    setupComputer() {
        return new ComputerController(this.gameBoard, this.settings);
    }
}
