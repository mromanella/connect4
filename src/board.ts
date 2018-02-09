import PlayerPiece from "./piece";
import Utils from "./utils";
import { Settings, GameType } from "./settings";

// The board class holds a reference to the board dom object
// and the pieces within
export default class Board {

    static readonly events = {
        gameOver: new CustomEvent('gameOver'),
        boardCleared: new CustomEvent('boardCleared'),
        changeTurn: new CustomEvent('changeTurn'),
        dropOutComplete: new CustomEvent('dropOutComplete')
    }

    width: number = 7;
    height: number = 6;
    board: PlayerPiece[][] = [];
    boardView: HTMLElement;
    parent: HTMLElement;

    currentTurn: string;
    clearBoardBtn: HTMLElement;
    gameRunning: boolean = false;
    currentTurnEl: HTMLElement;
    settings: Settings;

    computersTurn: boolean = false;
    mock: boolean = false;

    /**
     * Creates a new board initialized with empty pieces. StartingTurn defaults
     * to red if nothing is provided
     * @param element The DOM element to display the board in.
     * @param startingTurn Optional color to start with.
     */
    constructor(element: HTMLElement, settings: Settings, mock:boolean = false) {
        this.mock = mock;
        let startingTurn = settings.startingTurn;
        this.settings = settings;
        this.parent = element;
        this.currentTurn = startingTurn ? startingTurn : PlayerPiece.colors.red;
        this.createBoard();
        this.currentTurnEl = document.getElementById('current-turn');
        this.currentTurnEl.innerHTML = `${this.currentTurn}'s turn`;
        this.gameRunning = true;
    }

    private createBoard() {
        this.boardView = document.createElement('table');
        this.boardView.classList.add('play-board');

        // loop through creating the pieces and setting up the board
        for (let row = 0; row < this.height; row++) {
            this.board[row] = [];
            let tableRow = document.createElement('tr');
            for (let col = 0; col < this.width; col++) {

                let newPiece = new PlayerPiece(PlayerPiece.colors.empty, row, col, this.board);
                this.board[row][col] = newPiece;

                let tableData = document.createElement('td');
                tableData.classList.add('slot');

                // Placeholder is the emptypiece that is always present in a slot
                // Placeholder represents the see through part of the connect4 board
                let placeHolder = document.createElement('div');
                placeHolder.classList.add('placeholder');

                // set up event listener to show possible move and click events 
                // for placing a piece
                newPiece.view.addEventListener('mouseenter', (e) => {
                    e.stopPropagation();
                    if (this.computersTurn || !this.gameRunning) {
                        return;
                    }
                    this.displayPossibleMove(col);
                }, false);

                newPiece.view.addEventListener('mouseleave', (e) => {
                    e.stopPropagation();
                    if (this.computersTurn || !this.gameRunning) {
                        return;
                    }
                    this.displayPossibleMove(col, true);
                }, false);

                newPiece.view.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.computersTurn || !this.gameRunning) {
                        return;
                    }
                    this.placepiece(col);
                }, false);

                placeHolder.appendChild(newPiece.view);
                tableData.appendChild(placeHolder);
                tableRow.appendChild(tableData);
            }
            this.boardView.appendChild(tableRow);
        }
        if (!this.mock) {
            this.parent.appendChild(this.boardView);

        }
    }

    destroyBoard() {
        // this.boardView.remove();
        this.parent.removeChild(this.boardView);
    }

    /**
     * Places a dulled out piece into the cell which the piece will reside in if placed
     * during current turn.
     * @param col The column for which to show where the dropped piece will be
     */
    displayPossibleMove(col: number, remove: boolean = false) {
        let row = this.getPossibleMove(col);
        if (row === -1) {
            return;
        }

        let colList = this.getElementsForCol(col);
        let piece = (this.currentTurn === PlayerPiece.colors.red) ? PlayerPiece.colors.possibleRed : PlayerPiece.colors.possibleYellow;
        if (remove) {
            piece = PlayerPiece.colors.empty;
        }
        colList[row].showPossibleMove(piece);
    }

    /**
     * Provides a list of object which contain properties - view: the DOM object of the cell, 
     * piece: the current piece pertaining to the cell
     * @param col 
     */
    getElementsForCol(col: number): PlayerPiece[] {
        let colList: PlayerPiece[] = [];
        for (let row = 0; row < this.height; row++) {
            let piece = this.board[row][col];
            colList.push(piece)
        }
        return colList;
    }

    /**
     * Provides a list of object which contain properties - view: the DOM object of the cell, 
     * piece: the current piece pertaining to the cell
     * @param row 
     */
    getElementsForRow(row: number): PlayerPiece[] {
        let rowList: PlayerPiece[] = [];
        for (let col = 0; col < this.width; col++) {
            let piece = this.board[row][col];
            rowList.push(piece);
        }
        return rowList;
    }

    /**
     * Finds the row for which a move is possible for a particular column.
     * Returns the row number, or -1 if there are no possible moves.
     * @param col 
     */
    getPossibleMove(col: number): number {
        let found = false;
        let colList = this.getElementsForCol(col);
        let row = -1;
        for (let i = 0; i < this.height; i++) {
            let piece = colList[i];
            // If piece is not empty and is not possibleRed
            // and is not possibleYellow 
            if ((!piece.compareTo(PlayerPiece.colors.empty)
                && !piece.compareTo(PlayerPiece.colors.possibleRed)
                && !piece.compareTo(PlayerPiece.colors.possibleYellow))) {
                if (i - 1 >= 0) {
                    row = i - 1;
                    found = true;
                    break;
                } else {
                    return row;
                }
            }
        }
        if (!found) {
            row = this.height - 1;
        }

        return row;
    }

    /**
     * Places the currentTurns piece into the available slot.
     * @param col 
     */
    placepiece(col: number) {
        let validPlacement = this.checkForValidPlacement(col);
        if (!validPlacement) {
            return false;
        }

        let row = this.getPossibleMove(col);
        if (row === -1) {
            return false;
        }

        Utils.vibrateDevice([25]);

        this.board[row][col].setPieceColor(this.currentTurn);
        let winCheckResults = this.board[row][col].checkForWin();

        this.boardView.addEventListener(PlayerPiece.events.bounceAnimationEnd.type, (e) => {
            e.stopPropagation();
            if (this.gameRunning) {
                if (winCheckResults.win) {
                    this.gameRunning = false;
                    for (let piece of winCheckResults.run) {
                        piece.displayWinAnimation();
                        this.currentTurnEl.innerHTML = `${piece.getPieceColor()} WON!`;
                    }

                    Utils.vibrateDevice([100, 200, 100, 200, 100, 200, 100]);

                    this.emitEvent(Board.events.gameOver, { win: winCheckResults.win, run: winCheckResults.run });
                    return;
                }
                // this.displayPossibleMove(col);    
            }
        }, false);
        if (this.checkIfTie()) {
            this.gameRunning = false;
            this.currentTurnEl.innerHTML = `TIE!`;
        }
        this.changeTurn();
    }

    checkIfTie(): boolean {
        let tie: boolean = true;
        for (let col = 0; col < this.width; col++) {
            if (this.getPossibleMove(col) !== -1) {
                tie = false;
                break
            }
        }
        return tie;
    }

    checkForValidPlacement(col: number): boolean {
        let row = this.getPossibleMove(col);
        if (row === -1) {
            return false;
        }
        return true;
    }

    changeTurn() {
        if (this.currentTurn === PlayerPiece.colors.red) {
            this.currentTurn = PlayerPiece.colors.yellow
        } else {
            this.currentTurn = PlayerPiece.colors.red;
        }
        if (this.settings.gameType === GameType.playerVsAI) {
            if (this.settings.aiColor === this.currentTurn) {
                this.computersTurn = true;
            } else {
                this.computersTurn = false;
            }
        }
        this.currentTurnEl.innerHTML = `${this.currentTurn}'s turn`;
        setTimeout((e) => {
            this.emitEvent(Board.events.changeTurn, {})
        }, 1000);
        // console.log('Change turn', this.currentTurn);
    }

    clearBoard() {
        document.body.style.overflowY = 'hidden';
        for (let r = this.height - 1; r >= 0; r--) {
            let rows = this.getElementsForRow(r);
            let rowsCopy = rows.slice();
            for (let c = 0; c < rowsCopy.length; c++) {
                rows[c].remove(c);
            }
        }
        setTimeout(() => {
            document.body.style.overflow = 'auto';
            // this.emitEvent(Board.events.gameOver);
            // this.emitEvent(Board.events.boardCleared);
            this.emitEvent(Board.events.dropOutComplete, {});
        }, 1500);
    }

    copyBoard(): PlayerPiece[][] {
        let boardCopy: PlayerPiece[][] = [];
        for (let row = 0; row < this.height; row++) {
            boardCopy[row] = [];
            for (let col = 0; col < this.width; col++) {
                let newPiece = new PlayerPiece(this.board[row][col].getPieceColor(), row, col, boardCopy);
                boardCopy[row][col] = newPiece;
            }
        }
        return boardCopy;
    }

    private emitEvent(event: CustomEvent, details = {}) {
        event.initCustomEvent(event.type, true, true, details);
        this.boardView.dispatchEvent(event);
    }
}