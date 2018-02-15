/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class PlayerPiece {
    /**
     * Creates a Piece with awareness of location in board and of a color
     * @param color Piece color
     * @param row
     * @param col
     * @param parentBoard The the board which the piece resides in. Allows the piece to check for a win relative to its possition in the
     * parent board.
     */
    constructor(color, row, col, parentBoard) {
        this.winChecks = [this.checkHorizontalWin, this.checkVerticalWin, this.checkDiagonalWin];
        this.row = row;
        this.col = col;
        this.parentBoard = parentBoard;
        this.view = document.createElement('div');
        this.view.dataset.pieceColor = color;
        this.view.classList.add('piece');
    }
    /**
     * Gets this Piece's current color
     */
    getPieceColor() {
        return this.view.dataset.pieceColor;
    }
    /**
     * Sets the Piece to the given color. Applies drop in animation
     * @param PieceColor Piece color to set the Piece to
     */
    setPieceColor(color, applyAnimation = true) {
        // Set the Piece
        this.view.dataset.pieceColor = color;
        // Modify the css to reflect the newly places Piece 
        if (color === PlayerPiece.colors.red) {
            this.view.classList.remove(PlayerPiece.colors.possibleRed);
        }
        else {
            this.view.classList.remove(PlayerPiece.colors.possibleYellow);
        }
        // Begin animation
        return new Promise((resolve) => {
            if (applyAnimation) {
                resolve(this.dropInPiece());
            }
            else {
                resolve(null);
            }
        });
    }
    /**
     * Removes the Piece from the board
     * @param offset Optional offset to wait to remove item.
     */
    remove(offset = 0) {
        return new Promise((resolve) => {
            this.dropOutPiece(offset);
            resolve(null);
        });
    }
    /**
     * Places a softer shade of the current turns
     * Piece color into the slot where it will reside if placed.
     * @param possiblePiece The softer shade of the current turns Piece.
     */
    showPossibleMove(color) {
        this.view.dataset.pieceColor = color;
    }
    /**
     * Checks for win in diagonal, horizontal, and vertical (when appropriate).
     * If a win is determined, returns true f
     * or key win, and the 4 pieces included in the run.
     * Otherwhise return false and empty run
     */
    checkForWin() {
        for (let winCheck of this.winChecks) {
            let winCheckResults = winCheck.call(this);
            if (winCheckResults.win) {
                return winCheckResults;
            }
        }
        return { win: false, run: [], col: this.col };
    }
    displayWinAnimation() {
        this.view.classList.add('winner');
    }
    /**
     * Compares this Piece against a passed in test Piece.
     * Returns true if they are of the same Piece type, else false.
     * @param testPiece Piece to test against, or string of color to test
     */
    compareTo(testPiece) {
        if (testPiece instanceof PlayerPiece) {
            return this.getPieceColor() === testPiece.getPieceColor();
        }
        else {
            // Assuming string
            return this.getPieceColor() === testPiece;
        }
    }
    // ----- Win check methods -----
    checkHorizontalWin() {
        let checkSet = [this];
        // Check left
        let i = this.col - 1;
        while (i >= this.col - 3) {
            let checkCol = i;
            if (checkCol < 0) {
                checkCol = Math.abs(this.col + i);
                if (checkSet.indexOf(this.parentBoard[this.row][checkCol]) === -1) {
                    checkSet.unshift(this.parentBoard[this.row][checkCol]);
                }
                i--;
                continue;
            }
            if (checkSet.indexOf(this.parentBoard[this.row][checkCol]) === -1) {
                checkSet.unshift(this.parentBoard[this.row][checkCol]);
            }
            i--;
        }
        i = this.col + 1;
        // Check right
        while (i <= this.col + 3) {
            let checkCol = i;
            if (checkCol > 6) {
                checkCol = i - this.col;
                if (checkSet.indexOf(this.parentBoard[this.row][checkCol]) === -1) {
                    checkSet.unshift(this.parentBoard[this.row][checkCol]);
                }
                i++;
                continue;
            }
            if (checkSet.indexOf(this.parentBoard[this.row][checkCol]) === -1) {
                checkSet.push(this.parentBoard[this.row][checkCol]);
            }
            i++;
        }
        return this.checkSetForWin(checkSet);
    }
    checkHorizontalLeft() {
        let checkSet = [this];
        // Check left
        for (let i = this.col - 1; i >= this.col - 3; i--) {
            let checkCol = i;
            if (checkCol < 0) {
                checkCol = this.col + Math.abs(i);
            }
            else if (checkCol > 6) {
                checkCol = this.col - Math.abs(i);
            }
            if (checkCol < this.col) {
                checkSet.unshift(this.parentBoard[this.row][checkCol]);
            }
            else if (checkCol > this.col) {
                checkSet.push(this.parentBoard[this.row][checkCol]);
            }
        }
        return this.checkSetForWin(checkSet);
    }
    checkVerticalWin() {
        let checkSet = [this];
        // For vertical checks there will only ever be pieces below
        // a newly placed piece
        for (let i = this.row + 1; i <= this.row + 3; i++) {
            let checkRow = i;
            // If i is currently greater than 5(row limit), we know not to check it.
            // Instead check i spaces below of our current pieces row
            if (checkRow > 5) {
                checkRow = this.row - Math.abs(5 - i);
            }
            checkSet.push(this.parentBoard[checkRow][this.col]);
        }
        return this.checkSetForWin(checkSet);
    }
    checkDiagonalWin() {
        let winCheckResults = this.checkDiagonalLeft();
        return winCheckResults.win ? winCheckResults : this.checkDiagonalRight();
    }
    checkDiagonalLeft() {
        let checkSet = [this];
        // Check left
        let i = this.col - 1;
        let k = this.row - 1;
        while (i >= this.col - 3) {
            let checkCol = i;
            let checkRow = k;
            if (checkCol < 0 || checkCol > 6 || checkRow < 0 || checkRow > 5) {
                k--;
                i--;
                continue;
            }
            // if (checkRow < 0 && (this.row + Math.abs(k) <= 5)) {
            //     checkRow = this.col + Math.abs(k);
            // }
            if (checkSet.indexOf(this.parentBoard[checkRow][checkCol]) === -1) {
                checkSet.unshift(this.parentBoard[checkRow][checkCol]);
            }
            k--;
            i--;
        }
        i = this.col + 1;
        k = this.row + 1;
        // Check bottom right
        while (i <= this.col + 3) {
            let checkCol = i;
            let checkRow = k;
            if (checkCol < 0 || checkCol > 6 || checkRow < 0 || checkRow > 5) {
                k++;
                i++;
                continue;
            }
            if (checkSet.indexOf(this.parentBoard[checkRow][checkCol]) === -1) {
                checkSet.push(this.parentBoard[checkRow][checkCol]);
            }
            k++;
            i++;
        }
        return this.checkSetForWin(checkSet);
    }
    checkDiagonalRight() {
        let checkSet = [this];
        // Check left
        let i = this.col + 1;
        let k = this.row - 1;
        while (i <= this.col + 3) {
            let checkCol = i;
            let checkRow = k;
            if (checkCol < 0 || checkCol > 6 || checkRow < 0 || checkRow > 5) {
                k--;
                i++;
                continue;
            }
            // if (checkRow < 0 && (this.row + Math.abs(k) <= 5)) {
            //     checkRow = this.col + Math.abs(k);
            // }
            if (checkSet.indexOf(this.parentBoard[checkRow][checkCol]) === -1) {
                checkSet.push(this.parentBoard[checkRow][checkCol]);
            }
            k--;
            i++;
        }
        i = this.col - 1;
        k = this.row + 1;
        // Check bottom left
        while (i >= this.col - 3) {
            let checkCol = i;
            let checkRow = k;
            if (checkCol < 0 || checkCol > 6 || checkRow < 0 || checkRow > 5) {
                k++;
                i--;
                continue;
            }
            if (checkSet.indexOf(this.parentBoard[checkRow][checkCol]) === -1) {
                checkSet.unshift(this.parentBoard[checkRow][checkCol]);
            }
            k++;
            i--;
        }
        return this.checkSetForWin(checkSet);
    }
    // ----- Private methods -----
    // ----- Events -----
    emitEvent(event, details = {}) {
        event.initCustomEvent(event.type, true, true, details);
        this.view.dispatchEvent(event);
    }
    // ----- Animation methods -----
    /**
     * Drop in Piece performs the animation where a Piece falls
     * into the slot from above
     */
    dropInPiece() {
        return new Promise((resolve) => {
            // Begin animation of the Piece dropping into the slot
            this.view.classList.add('drop-piece-in');
            // Set timeouts to remove animation and begin/remove bouncing animation upon
            // Piece landing on bottom of column
            setTimeout((e) => {
                this.view.classList.remove('drop-piece-in');
                resolve(this.bouncePiece());
            }, 500);
        });
    }
    /**
     * Bounce Piece performs the animation where a Piece bounces
     * after hitting the bottom of its slot
     */
    bouncePiece() {
        return new Promise((resolve) => {
            this.view.classList.add('bounce');
            setTimeout((e) => {
                this.view.classList.remove('bounce');
                resolve(null);
            }, 400);
        });
    }
    /**
    * Performs animation which drops Piece out of the bottom of the board.
    * @param offset Optional offset to wait to remove item.
    */
    dropOutPiece(offset = 0) {
        return new Promise((resolve) => {
            if (this.view.classList.contains('winner')) {
                this.view.classList.remove('winner');
            }
            setTimeout((e) => {
                this.view.classList.add('drop-piece-out');
                setTimeout((e) => {
                    this.setPieceColor(PlayerPiece.colors.empty, false);
                    // Height of board is 6 
                    resolve(null);
                }, 75 * 6);
            }, 100 * (offset + 1));
        });
    }
    checkSetForWin(set) {
        let run = [];
        let highestRun = [];
        let sub = [];
        for (let checkPiece of set) {
            if (this.compareTo(checkPiece) && checkPiece.getPieceColor() !== PlayerPiece.colors.empty) {
                sub.push(checkPiece);
                if (run.push(checkPiece) === 4) {
                    return { win: true, run: run, col: this.col };
                }
            }
            else {
                if (run.length > highestRun.length) {
                    highestRun = run;
                }
                run = [];
            }
        }
        return { win: false, run: highestRun, col: this.col };
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = PlayerPiece;

/**
 * PieceColors - Piece colors are strings that correspond to a data attribute for CSS
 */
PlayerPiece.colors = {
    empty: 'empty',
    red: 'red',
    yellow: 'yellow',
    possibleYellow: 'possibleyellow',
    possibleRed: 'possiblered'
};


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Utils {
    static emitEvent(event) {
        event.initCustomEvent('animationEnd', false, true, {});
        document.dispatchEvent(event);
    }
    static fadeInOut(view) {
        view.classList.add('fade-in-out');
    }
    static fadeIn(view) {
        view.classList.add('fade-in');
    }
    static shrink(view) {
        view.classList.add('shrink-anim');
        setTimeout((e) => {
            // view.classList.remove('shrink-anim');
            view.classList.add('shrunk');
        }, 1000);
    }
    static bounceInfinite(view, offset = 1) {
        setTimeout((e) => {
            view.classList.add('bounce-infinite');
        }, (350 * offset));
    }
    static slideFromBottom(view) {
        view.classList.add('slide-from-bottom');
    }
    static slideOutTop(view) {
        view.classList.add('slide-out-top');
    }
    static vibrateDevice(duration) {
        if (navigator.vibrate) {
            navigator.vibrate(duration);
        }
    }
    static addCssClass(view, cssClasses) {
        for (let cssClass of cssClasses) {
            view.classList.add(cssClass);
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Utils;

Utils.animationEnd = new CustomEvent('animationEnd');


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__piece__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__settings__ = __webpack_require__(3);



// The board class holds a reference to the board dom object
// and the pieces within
class Board {
    /**
     * Creates a new board initialized with empty pieces. StartingTurn defaults
     * to red if nothing is provided
     * @param element The DOM element to display the board in.
     * @param startingTurn Optional color to start with.
     */
    constructor(element, settings, mock = false) {
        this.width = 7;
        this.height = 6;
        this.board = [];
        this.mock = mock;
        let startingTurn = settings.startingTurn;
        this.settings = settings;
        this.parent = element;
        this.currentTurn = startingTurn ? startingTurn : __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.red;
        this.createBoard();
        this.currentTurnEl = document.getElementById('current-turn');
        this.currentTurnEl.innerHTML = `${this.currentTurn}'s turn`;
        this.gameRunning = true;
        this.computersTurn = false;
    }
    ;
    ;
    createBoard() {
        this.boardView = document.createElement('table');
        this.boardView.classList.add('play-board');
        // loop through creating the pieces and setting up the board
        for (let row = 0; row < this.height; row++) {
            this.board[row] = [];
            let tableRow = document.createElement('tr');
            for (let col = 0; col < this.width; col++) {
                let newPiece = new __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */](__WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.empty, row, col, this.board);
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
                    if (this.computersTurn) {
                        return;
                    }
                    else {
                        this.displayPossibleMove(col);
                    }
                }, false);
                newPiece.view.addEventListener('mouseleave', (e) => {
                    e.stopPropagation();
                    if (this.computersTurn) {
                        return;
                    }
                    else {
                        this.displayPossibleMove(col, true);
                    }
                }, false);
                newPiece.view.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (this.computersTurn) {
                        return;
                    }
                    else {
                        this.placepiece(col);
                    }
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
    displayPossibleMove(col, remove = false) {
        let row = this.getPossibleMove(col);
        if (row === -1) {
            return;
        }
        let colList = this.getElementsForCol(col);
        let piece = (this.currentTurn === __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.red) ? __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.possibleRed : __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.possibleYellow;
        if (remove) {
            piece = __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.empty;
        }
        colList[row].showPossibleMove(piece);
    }
    /**
     * Provides a list of object which contain properties - view: the DOM object of the cell,
     * piece: the current piece pertaining to the cell
     * @param col
     */
    getElementsForCol(col) {
        let colList = [];
        for (let row = 0; row < this.height; row++) {
            let piece = this.board[row][col];
            colList.push(piece);
        }
        return colList;
    }
    /**
     * Provides a list of object which contain properties - view: the DOM object of the cell,
     * piece: the current piece pertaining to the cell
     * @param row
     */
    getElementsForRow(row) {
        let rowList = [];
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
    getPossibleMove(col) {
        let found = false;
        let colList = this.getElementsForCol(col);
        let row = -1;
        for (let i = 0; i < this.height; i++) {
            let piece = colList[i];
            if (piece) {
                // If piece is not empty and is not possibleRed
                // and is not possibleYellow 
                if ((!piece.compareTo(__WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.empty)
                    && !piece.compareTo(__WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.possibleRed)
                    && !piece.compareTo(__WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.possibleYellow))) {
                    if (i - 1 >= 0) {
                        row = i - 1;
                        found = true;
                        break;
                    }
                    else {
                        return row;
                    }
                }
            }
            else {
                return -1;
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
    async placepiece(col) {
        let validPlacement = this.checkForValidPlacement(col);
        if (!validPlacement) {
            return false;
        }
        let row = this.getPossibleMove(col);
        if (row === -1) {
            return false;
        }
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].vibrateDevice([25]);
        if (this.settings.gameType === __WEBPACK_IMPORTED_MODULE_2__settings__["a" /* GameType */].playerVsAI) {
            if (this.settings.aiColor === this.currentTurn) {
                this.computersTurn = true;
            }
        }
        await this.board[row][col].setPieceColor(this.currentTurn);
        let winCheckResults = this.board[row][col].checkForWin();
        if (this.gameRunning) {
            if (winCheckResults.win) {
                this.gameRunning = false;
                for (let piece of winCheckResults.run) {
                    piece.displayWinAnimation();
                    this.currentTurnEl.innerHTML = `${piece.getPieceColor()} WON!`;
                }
                __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].vibrateDevice([100, 200, 100, 200, 100, 200, 100]);
                this.emitEvent(Board.events.gameOver, { win: winCheckResults.win, run: winCheckResults.run });
                return;
            }
            else {
                if (this.checkIfTie()) {
                    this.gameRunning = false;
                    this.currentTurnEl.innerHTML = `TIE!`;
                    return;
                }
            }
            // this.displayPossibleMove(col);    
        }
        if (this.settings.gameType === __WEBPACK_IMPORTED_MODULE_2__settings__["a" /* GameType */].playerVsAI) {
            if (this.settings.aiColor === this.currentTurn) {
                this.computersTurn = false;
            }
        }
        this.changeTurn();
    }
    checkIfTie() {
        let tie = true;
        for (let col = 0; col < this.width; col++) {
            if (this.getPossibleMove(col) !== -1) {
                tie = false;
                break;
            }
        }
        return tie;
    }
    checkForValidPlacement(col) {
        let row = this.getPossibleMove(col);
        if (row === -1) {
            return false;
        }
        return true;
    }
    changeTurn() {
        if (this.currentTurn === __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.red) {
            this.currentTurn = __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.yellow;
        }
        else {
            this.currentTurn = __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.red;
        }
        this.currentTurnEl.innerHTML = `${this.currentTurn}'s turn`;
        setTimeout((e) => {
            this.emitEvent(Board.events.changeTurn, {});
        }, 1000);
        // console.log('Change turn', this.currentTurn);
    }
    clearBoard() {
        return new Promise(async (resolve) => {
            document.body.style.overflowY = 'hidden';
            for (let r = this.height - 1; r >= 0; r--) {
                let rows = this.getElementsForRow(r);
                let rowsCopy = rows.slice();
                for (let c = 0; c < rowsCopy.length; c++) {
                    await rows[c].remove(c);
                }
            }
            setTimeout(() => {
                document.body.style.overflow = 'auto';
                resolve();
            }, 1500);
        });
    }
    copyBoard() {
        let boardCopy = [];
        for (let row = 0; row < this.height; row++) {
            boardCopy[row] = [];
            for (let col = 0; col < this.width; col++) {
                let newPiece = new __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */](this.board[row][col].getPieceColor(), row, col, boardCopy);
                boardCopy[row][col] = newPiece;
            }
        }
        return boardCopy;
    }
    emitEvent(event, details = {}) {
        event.initCustomEvent(event.type, true, true, details);
        this.boardView.dispatchEvent(event);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Board;

Board.events = {
    gameOver: new CustomEvent('gameOver'),
    changeTurn: new CustomEvent('changeTurn'),
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* unused harmony export Difficulty */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GameType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return defaultSettings; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__piece__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(1);


var Difficulty;
(function (Difficulty) {
    Difficulty[Difficulty["easy"] = 0] = "easy";
    Difficulty[Difficulty["midEasy"] = 1] = "midEasy";
    Difficulty[Difficulty["mid"] = 2] = "mid";
    Difficulty[Difficulty["midHard"] = 3] = "midHard";
    Difficulty[Difficulty["hard"] = 4] = "hard";
})(Difficulty || (Difficulty = {}));
var GameType;
(function (GameType) {
    GameType[GameType["playerVsPlayerLocal"] = 0] = "playerVsPlayerLocal";
    GameType[GameType["playerVsAI"] = 1] = "playerVsAI";
    GameType[GameType["playerVsPlayerOnline"] = 2] = "playerVsPlayerOnline";
})(GameType || (GameType = {}));
let defaultSettings = {
    difficulty: null,
    gameType: GameType.playerVsPlayerLocal,
    aiColor: null,
    startingTurn: __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.red
};
class SettingsScreen {
    constructor(settings) {
        this.settings = settings;
        this.parent = document.getElementById('settings-screen-container');
        this.settingsScreen = document.createElement('div');
        this.settingsScreen.id = 'settings-screen';
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(this.settingsScreen, ['settings-screen']);
        let radioGroup = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(radioGroup, ['radio-group']);
        let redLabel = document.createElement('label');
        redLabel.innerHTML = 'Red';
        this.startingTurnRed = document.createElement('input');
        this.startingTurnRed.setAttribute('type', 'radio');
        this.startingTurnRed.setAttribute('name', 'starting-turn');
        this.startingTurnRed.setAttribute('value', __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.red);
        this.startingTurnRed.setAttribute('checked', 'true');
        let yellowLabel = document.createElement('label');
        yellowLabel.innerHTML = 'Yellow';
        this.startinTurnYellow = document.createElement('input');
        this.startinTurnYellow.setAttribute('type', 'radio');
        this.startinTurnYellow.setAttribute('name', 'starting-turn');
        this.startinTurnYellow.setAttribute('value', __WEBPACK_IMPORTED_MODULE_0__piece__["a" /* default */].colors.yellow);
        radioGroup.appendChild(redLabel);
        radioGroup.appendChild(this.startingTurnRed);
        radioGroup.appendChild(yellowLabel);
        radioGroup.appendChild(this.startinTurnYellow);
        this.settingsScreen.appendChild(radioGroup);
        this.parent.appendChild(this.settingsScreen);
    }
    show() {
        // this
    }
}
/* unused harmony export SettingsScreen */



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_css__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__src_index_css___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__src_index_css__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__splash_screen__ = __webpack_require__(10);


window.onload = (e) => {
    // playerVsComputerBtn.style.display = 'none';
    let banner = document.getElementById('banner');
    // splash
    let splashContainer = document.getElementById('screen-container');
    let splashScreen = new __WEBPACK_IMPORTED_MODULE_1__splash_screen__["a" /* SplashScreen */](splashContainer);
    document.body.style.visibility = 'visible';
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(6);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(8)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!./index.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!./index.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(7)(false);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Poppins);", ""]);

// module
exports.push([module.i, "* {\n    box-sizing: border-box;\n}\n\nbody {\n    /* background-color: white; */\n    background-color: rgb(250, 246, 246);\n    height: 100%;\n    width: auto;\n}\n\n.grid-class {\n    display: grid;\n    grid-template-columns: .5fr 2fr;\n}\n\n.typography {\n    font-family: \"Poppins\", sans-serif;\n    \n}\n\n.banner {\n    display: flex;\n    flex-flow: row wrap;\n    justify-content: space-around;\n    align-items: center;\n    box-shadow: 0px 1px 15px 5px lightgrey;\n    height: 4em;\n    width: 100%;\n    left: 0;\n    right: 0;\n    top: 0;\n    background-color: #fff;\n    position: fixed;\n    z-index: 1;\n}\n\n.logo {\n    /* color: #e34a06; */\n    /* color: #6c7aa0; */\n    color: #bd5345;\n    font-size: 2.3em;\n    font-style: italic;\n    font-weight: 700;\n    /* height: 100%; */\n    text-shadow: 2px 2px lightgray;\n    align-self: flex-start;\n}\n\n.link-no-decoration {\n    text-decoration: none;\n    color: #fff;\n}\n\n\n.btn-box {\n    display: flex;\n    flex-direction: column;\n    align-items: center;\n    align-self: center;\n    margin: auto;\n}\n\n.btn {\n    border: 1px solid transparent;\n    border-radius: 5px;\n    -webkit-appearance: none;\n    color: #fff;\n    width: 12em;\n    height: 3em;\n    margin: .5em 0;\n    padding: 0.5em 0.75em;\n    outline: none;\n}\n\n.btn:hover {\n    /* animation: inflate .15s linear forwards; */\n    transform: scale(1.05);\n    /* box-shadow: 2px 0 15px 5px rgb(226, 226, 226); */\n    z-index: 5;\n    cursor: pointer;\n}\n\n.player-vs-ai {\n    background-color: rgb(92, 150, 204);\n}\n\n.player-vs-player {\n    background-color: rgb(204, 114, 92);\n}\n\n.skip-intro, .open-sbbutton, .close-sidebar-btn, .clear-button {\n    background-color: rgba(64, 73, 82, 0.747);\n    color: white;\n}\n\n.open-sbbutton {\n    align-self: flex-end;\n    margin: auto 0;\n    padding: 0;\n}\n\n.close-sidebar-btn, .clear-button {\n    background-color: rgb(92, 150, 204);\n}\n\n.open-sbbutton:hover, .close-sidebar-btn:hover {\n    cursor: pointer;\n}\n\n.main-content {\n    top: 70px;\n    position: relative;\n}\n\n.current-turn {\n    text-align: center;\n    margin: auto;\n    text-transform: uppercase;\n}\n\n.sidebar {\n    background-color: rgb(243, 243, 243);\n    right: 0;\n    top: 0;\n    opacity: 0;\n    height: 100%;\n    margin: auto;\n    width: 0;\n    z-index: 5;\n    position: fixed;\n    text-align: center;\n    box-shadow: -2px 0 5px 0 rgba(0, 0, 0, 0.322)\n}\n\n.sidebar ul {\n    display: flex;\n    flex-flow: column wrap;\n    justify-content: center;\n    align-content: center;\n    list-style: none;\n    padding: 0.5em 0.75em;\n}\n\n.open-sidebar {\n    animation: open-sidebar .4s ease-out forwards;\n}\n\n.close-sidebar {\n    animation: close-sidebar .4s ease-out forwards;\n}\n\n.is-open {\n    width: 15%;\n    opacity: 1;\n}\n\n.splash-screen {\n    display: flex;\n    flex-direction: column;\n    flex-wrap: wrap;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    position: fixed;\n    z-index: 10;\n    background-color: rgb(250, 246, 246);\n}\n\n.title {\n    display: flex;\n    align-self: center;\n    flex-direction: row;\n    flex-wrap: wrap;\n    transform: scale(2.1) translateY(100px);\n}\n\n.title.shrunk {\n    transform: scale(1.7) translateY(75px);\n}\n\n.letter-background {\n    opacity: 0;\n    border-radius: 50%;\n    width: 5em;\n    height: 5em;\n    text-align: center;\n}\n\n.letter-background.show {\n    opacity: 1!important;\n}\n\n.title-letters {\n    font-size: 5.5em;\n    color: #4f6179;\n    /* -webkit-font-smoothing: antialiased; */\n    /* color: #a09a96; */\n    /* text-shadow: .7px 0 0 #000, 0 .7px 0 #000, 0 .7px 0 #000, .7px 0 0 #000; */\n}\n\n.fade-in-out {\n    animation: fade-in-out .7s ease-in forwards;\n}\n\n.fade-in {\n    animation: fade-in .7s ease-in forwards;\n}\n\n.shrink-anim {\n    animation: shrink-anim 1s linear forwards;\n}\n\n.slide-from-bottom {\n    animation: slide-from-bottom .7s ease-out forwards;\n}\n\n.slide-out-top {\n    animation: slide-out-top .7s linear forwards;\n}\n\n.board {\n    padding: 0.5em 0.75em;\n    margin: auto;\n}\n\n.play-board {\n    table-layout: fixed;\n    columns: auto 7;\n    height: auto;\n    margin: auto;\n    box-shadow: 1px 5px 10px 2px lightgrey;\n}\n\n.slot {\n    /* border: 1px solid #8897a0; */\n    border-radius: 3%;\n    width: auto;\n    height: auto;\n    /* background-color: rgb(72, 72, 243); */\n    /* background-color: #93a4ad; */\n    background-color: #695ecc;\n}\n\n.piece {\n    border-radius: 50%;\n    width: 5em;\n    height: 5em;\n    margin: auto;\n}\n\n.placeholder {\n    border-radius: 50%;\n    background-color: rgb(252, 252, 252);\n}\n\n.piece[data-piece-color='empty'] {\n    background-color: transparent;\n}\n\n.piece[data-piece-color='red'] {\n    background-image: radial-gradient(circle at center, rgb(255, 33, 29), #B20C09);\n}\n\n.piece[data-piece-color='yellow'] {\n    background-image: radial-gradient(circle at center, yellow, rgb(224, 202, 36));\n}\n\n.piece[data-piece-color='possibleyellow'], .letter-background[data-piece-color='yellow'] {\n    background-color: rgb(255, 255, 112);\n    border: 1px solid rgb(233, 233, 94);\n}\n\n.piece[data-piece-color='possiblered'], .letter-background[data-piece-color='red'] {\n    background-color: rgb(255, 131, 131);\n    border: 1px solid rgb(233, 105, 105);\n}\n\n.piece[data-piece-color='possibleyellow'], .piece[data-piece-color='possiblered'] {\n    border: 0;\n}\n\n.piece.winner {\n    animation: winner 1.3s linear infinite;\n}\n\n.set-up-right {\n    animation: set-up-right .75s ease-out;\n}\n\n.drop-piece-in {\n    animation: drop-piece-in .5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;\n}\n\n.bounce {\n    animation: bounce .4s ease-in forwards;\n}\n\n.bounce-infinite {\n    animation: bounce-infinite .7s ease-in infinite;\n}\n\n.drop-piece-out {\n    animation: drop-piece-out .5s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards;\n}\n\n.dropped {\n    visibility: hidden;\n}\n\n.settings-screen {\n    width: 50%;\n    top: 5em;\n    height: 25em;\n    margin: auto;\n    /* position: fixed; */\n    position: relative;\n    z-index: 25;\n    background-color: rgb(190, 77, 75);\n}\n\n.radio-group {\n    position: relative;\n    margin: auto;\n}\n\n/* Moz */\n\n@-moz-keyframes slide-from-bottom {\n    from {\n        transform: translateY(1000px);\n    }\n    to {\n        transform: translateY(initial);\n    }\n}\n\n@-moz-keyframes inflate {\n    from {\n        transform: scale(1);\n    }\n    to {\n        transform: scale(1.01);\n    }\n}\n\n@-moz-keyframes drop-piece-in {\n    0% {\n        position: relative;\n        transform: translateY(-500px);\n    }\n    100% {\n        position: initial;\n        transform: translateY(0);\n    }\n}\n\n@-moz-keyframes bounce {\n    0%, 50%, 100% {\n        position: relative;\n        transform: translateY(0);\n    }\n    25% {\n        position: relative;\n        transform: translateY(-12px);\n    }\n    75% {\n        position: relative;\n        transform: translateY(-2px);\n    }\n}\n\n@-moz-keyframes bounce-infinite {\n    0%, 50%, 100% {\n        transform: translateY(0);\n    }\n    25% {\n        transform: translateY(-12px);\n    }\n    75% {\n        transform: translateY(-2px);\n    }\n}\n\n@-moz-keyframes drop-piece-out {\n    0% {\n        position: initial;\n        transform: translateY(initial);\n    }\n    100% {\n        position: relative;\n        transform: translateY(1000px);\n    }\n}\n\n@-moz-keyframes winner {\n    from {\n        transform: scale(0);\n    }\n    to {\n        transform: scale(1);\n    }\n}\n\n@-moz-keyframes open-sidebar {\n    0% {\n        width: 0;\n        opacity: 0;\n    }\n    100% {\n        opacity: 1;\n        width: 150px;\n    }\n}\n\n@-moz-keyframes close-sidebar {\n    0% {\n        width: 150px;\n        opacity: 1;\n    }\n    100% {\n        opacity: 0;\n        width: 0;\n    }\n}\n\n@-moz-keyframes fade-in-out {\n    0%, 100% {\n        opacity: 0;\n    }\n    50% {\n        opacity: 1;\n    }\n}\n\n@-moz-keyframes fade-in {\n    from {\n        opacity: 0;\n    }\n    to {\n        opacity: 1;\n    }\n}\n\n@-moz-keyframes shrink-anim {\n    from {\n        transform: scale(2.1) translateY(100px);\n    }\n    to {\n        transform: scale(1.7) translateY(75px);\n    }\n}\n\n@-moz-keyframes slide-out-top {\n    from {\n        transform: translateY(initial);\n    }\n    to {\n        transform: translateY(-1000px);\n    }\n}\n\n\n\n/* Safari */\n\n@-webkit-keyframes slide-from-bottom {\n    from {\n        transform: translateY(1000px);\n    }\n    to {\n        transform: translateY(initial);\n    }\n}\n\n@-webkit-keyframes inflate {\n    from {\n        transform: scale(1);\n    }\n    to {\n        transform: scale(1.01);\n    }\n}\n\n@-webkit-keyframes drop-piece-in {\n    0% {\n        position: relative;\n        transform: translateY(-500px);\n    }\n    100% {\n        position: initial;\n        transform: translateY(0);\n    }\n}\n\n@-webkit-keyframes bounce {\n    0%, 50%, 100% {\n        position: relative;\n        transform: translateY(0);\n    }\n    25% {\n        position: relative;\n        transform: translateY(-12px);\n    }\n    75% {\n        position: relative;\n        transform: translateY(-2px);\n    }\n}\n\n@-webkit-keyframes bounce-infinite {\n    0%, 50%, 100% {\n        transform: translateY(0);\n    }\n    25% {\n        transform: translateY(-12px);\n    }\n    75% {\n        transform: translateY(-2px);\n    }\n}\n\n@-webkit-keyframes drop-piece-out {\n    0% {\n        position: initial;\n        transform: translateY(initial);\n    }\n    100% {\n        position: relative;\n        transform: translateY(1000px);\n    }\n}\n\n@-webkit-keyframes winner {\n    from {\n        transform: scale(0);\n    }\n    to {\n        transform: scale(1);\n    }\n}\n\n@-webkit-keyframes open-sidebar {\n    0% {\n        width: 0;\n        opacity: 0;\n    }\n    100% {\n        opacity: 1;\n        width: 150px;\n    }\n}\n\n@-webkit-keyframes close-sidebar {\n    0% {\n        width: 150px;\n        opacity: 1;\n    }\n    100% {\n        opacity: 0;\n        width: 0;\n    }\n}\n\n@-webkit-keyframes fade-in-out {\n    0%, 100% {\n        opacity: 0;\n    }\n    50% {\n        opacity: 1;\n    }\n}\n\n@-webkit-keyframes fade-in {\n    from {\n        opacity: 0;\n    }\n    to {\n        opacity: 1;\n    }\n}\n\n@-webkit-keyframes shrink-anim {\n    from {\n        transform: scale(2.1) translateY(100px);\n    }\n    to {\n        transform: scale(1.7) translateY(75px);\n    }\n}\n\n@-webkit-keyframes slide-out-top {\n    from {\n        transform: translateY(initial);\n    }\n    to {\n        transform: translateY(-1000px);\n    }\n}\n\n\n/* Standard */\n\n@keyframes inflate {\n    from {\n        transform: scale(1);\n    }\n    to {\n        transform: scale(1.01);\n    }\n}\n\n@keyframes drop-piece-in {\n    0% {\n        position: relative;\n        transform: translateY(-500px);\n    }\n    100% {\n        position: initial;\n        transform: translateY(0);\n    }\n}\n\n@keyframes bounce {\n    0%, 50%, 100% {\n        position: relative;\n        transform: translateY(0);\n    }\n    25% {\n        position: relative;\n        transform: translateY(-12px);\n    }\n    75% {\n        position: relative;\n        transform: translateY(-2px);\n    }\n}\n\n@keyframes bounce-infinite {\n    0%, 50%, 100% {\n        transform: translateY(0);\n    }\n    25% {\n        transform: translateY(-12px);\n    }\n    75% {\n        transform: translateY(-2px);\n    }\n}\n\n@keyframes drop-piece-out {\n    0% {\n        position: initial;\n        transform: translateY(initial);\n    }\n    100% {\n        position: relative;\n        transform: translateY(1000px);\n    }\n}\n\n@keyframes winner {\n    from {\n        transform: scale(0);\n    }\n    to {\n        transform: scale(1);\n    }\n}\n\n@keyframes open-sidebar {\n    0% {\n        width: 0;\n        opacity: 0;\n    }\n    100% {\n        opacity: 1;\n        width: 15%;\n    }\n}\n\n@keyframes close-sidebar {\n    0% {\n        width: 15%;\n        opacity: 1;\n    }\n    100% {\n        opacity: 0;\n        width: 0;\n    }\n}\n\n@keyframes fade-in-out {\n    0%, 100% {\n        opacity: 0;\n    }\n    50% {\n        opacity: 1;\n    }\n}\n\n@keyframes fade-in {\n    from {\n        opacity: 0;\n    }\n    to {\n        opacity: 1;\n    }\n}\n\n@keyframes shrink-anim {\n    from {\n        transform: scale(2.1) translateY(100px);\n    }\n    to {\n        transform: scale(1.7) translateY(75px);\n    }\n}\n\n@keyframes slide-from-bottom {\n    from {\n        transform: translateY(1000px);\n    }\n    to {\n        transform: translateY(initial);\n    }\n}\n\n@keyframes slide-out-top {\n    from {\n        transform: translateY(initial);\n    }\n    to {\n        transform: translateY(-1000px);\n    }\n}\n\n/* Media Queries */\n\n/* 1400 */\n@media only screen and (max-width: 1400px) {\n\n    .letter-background {\n        width: 4em;\n        height: 4em;\n    }\n    \n    .title-letters {\n        font-size: 4em;\n    }\n\n    .is-open {\n        width: 30%;\n    }\n\n    @keyframes open-sidebar {\n        0% {\n            width: 0;\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n            width: 30%;\n        }\n    }\n    \n    @keyframes close-sidebar {\n        0% {\n            width: 30%;\n            opacity: 1;\n        }\n        100% {\n            opacity: 0;\n            width: 0;\n        }\n    }\n}\n\n/* 1100 */\n\n@media only screen and (max-width: 1100px) {\n\n    .letter-background {\n        width: 3.25em;\n        height: 3.25em;\n    }\n    \n    .title-letters {\n        font-size: 3.25em;\n    }\n\n    .is-open {\n        width: 30%;\n    }\n\n    @keyframes open-sidebar {\n        0% {\n            width: 0;\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n            width: 30%;\n        }\n    }\n    \n    @keyframes close-sidebar {\n        0% {\n            width: 30%;\n            opacity: 1;\n        }\n        100% {\n            opacity: 0;\n            width: 0;\n        }\n    }\n}\n\n/* 900 */\n@media only screen and (max-width: 850px) {\n\n    .letter-background {\n        width: 2.75em;\n        height: 2.75em;\n    }\n    \n    .title-letters {\n        font-size: 3em;\n    }\n\n    .is-open {\n        width: 35%;\n    }\n\n    @keyframes open-sidebar {\n        0% {\n            width: 0;\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n            width: 35%;\n        }\n    }\n    \n    @keyframes close-sidebar {\n        0% {\n            width: 35%;\n            opacity: 1;\n        }\n        100% {\n            opacity: 0;\n            width: 0;\n        }\n    }\n}\n\n\n@media only screen and (max-width: 730px) {\n\n    .letter-background {\n        width: 2.5em;\n        height: 2.5em;\n    }\n    \n    .title-letters {\n        font-size: 2.5em;\n    }\n\n    /* .open-sbbutton {\n        width: 3em;\n    }\n\n    .close-sidebar-btn, .clear-button {\n        width: 8em;\n    } */\n\n    .is-open {\n        width: 45%;\n    }\n\n    @keyframes open-sidebar {\n        0% {\n            width: 0;\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n            width: 35%;\n        }\n    }\n    \n    @keyframes close-sidebar {\n        0% {\n            width: 35%;\n            opacity: 1;\n        }\n        100% {\n            opacity: 0;\n            width: 0;\n        }\n    }\n}\n\n/* 680 */\n@media only screen and (max-width: 680px) {\n\n    .letter-background {\n        width: 2.25em;\n        height: 2.25em;\n    }\n    \n    .title-letters {\n        font-size: 2.25em;\n    }\n    .piece {\n        width: 4em;\n        height: 4em;\n    }\n\n    .is-open {\n        width: 35%;\n    }\n\n    @keyframes open-sidebar {\n        0% {\n            width: 0;\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n            width: 35%;\n        }\n    }\n    \n    @keyframes close-sidebar {\n        0% {\n            width: 35%;\n            opacity: 1;\n        }\n        100% {\n            opacity: 0;\n            width: 0;\n        }\n    }\n}\n\n/* 480 */\n\n@media only screen and (max-width: 460px) {\n\n    .letter-background {\n        width: 1.25em;\n        height: 1.25em;\n    }\n    \n    .title-letters {\n        font-size: 1.25em;\n    }\n    .piece {\n        width: 2.25em;\n        height: 2.25em;\n    }\n\n    \n    .btn {\n        padding: 0.5em 0.75em;\n        min-width: 7em;\n        min-height: 2em;\n        width: auto;\n        height: auto;\n    }\n    \n    .is-open {\n        width: 40%;\n    }\n    \n    .logo {\n        font-size: 1.5em;\n    }\n        \n\n    @keyframes open-sidebar {\n        0% {\n            width: 0;\n            opacity: 0;\n        }\n        100% {\n            opacity: 1;\n            width: 40%;\n        }\n    }\n    \n    @keyframes close-sidebar {\n        0% {\n            width: 40%;\n            opacity: 1;\n        }\n        100% {\n            opacity: 0;\n            width: 0;\n        }\n    }\n}\n\n.loading-block {\n    text-align: center;\n    width: 50%;\n    height: 5%;\n    margin-top: 10%;\n    display: none;\n    background: transparent;\n}\n\n.loading {\n    width: 10px;\n    height: 10px;\n    display: block;\n    background: #c3cfcc;\n    ;\n    -moz-border-radius: 50%;\n    -webkit-border-radius: 50%;\n    border-radius: 50%;\n    margin: auto;\n    text-align: center;\n    margin-top: 5%;\n    display: inline-block;\n}\n\n.loading-left {\n    animation: loading 1s infinite;\n}\n\n.loading-center {\n    animation: loading 1s .33s infinite;\n}\n\n.loading-right {\n    animation: loading 1s .66s infinite;\n}\n\n@keyframes loading {\n    0%,\n    100% {\n        transform: scale(0, 0)\n    }\n    50% {\n        transform: scale(1, 1)\n    }\n}", ""]);

// exports


/***/ }),
/* 7 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(9);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 9 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_controller__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__piece__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__settings__ = __webpack_require__(3);




class SplashScreen {
    constructor(view) {
        this.titleLetters = [];
        this.clearBoardBtn = document.getElementById('clear-button');
        this.sidebar = document.getElementsByClassName('sidebar')[0];
        this.openSidebarButton = document.getElementsByClassName('open-sbbutton')[0];
        this.closeSidebarButton = document.getElementsByClassName('close-sidebar-btn')[0];
        this.skipIntro = false;
        this.gameController = null;
        this.connect4Title = 'Connect4';
        this.settings = __WEBPACK_IMPORTED_MODULE_3__settings__["b" /* defaultSettings */];
        this.parent = view;
        this.splashScreen = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(this.splashScreen, ['splash-screen']);
        this.titleEl = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(this.titleEl, ['title']);
        // create letters for the animated title
        for (let c of this.connect4Title) {
            let letterBackground = document.createElement('div');
            let letter = document.createElement('div');
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(letterBackground, ['letter-background']);
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(letter, ['title-letters', 'typography']);
            letter.innerHTML = c;
            letterBackground.appendChild(letter);
            this.titleLetters.push(letter);
            this.titleEl.appendChild(letterBackground);
        }
        this.splashScreen.appendChild(this.titleEl);
        let btnBox = document.createElement('div');
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(btnBox, ['btn-box']);
        this.computerDifficulty = document.createElement('select');
        for (let i = 1; i <= 4; i++) {
            let child = document.createElement('option');
            child.value = String(i);
            child.innerHTML = String(i);
            if (i === 1) {
                child.setAttribute('selected', 'true');
            }
            this.computerDifficulty.appendChild(child);
        }
        btnBox.appendChild(this.computerDifficulty);
        this.playerVsComputerBtn = document.createElement('button');
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(this.playerVsComputerBtn, ['btn', 'player-vs-ai', 'typography']);
        this.playerVsComputerBtn.innerHTML = 'Player Vs Computer';
        this.playerVsPlayerBtn = document.createElement('button');
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(this.playerVsPlayerBtn, ['btn', 'player-vs-player', 'typography']);
        this.playerVsPlayerBtn.innerHTML = 'Player Vs Player';
        this.skipIntroBtn = document.createElement('button');
        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].addCssClass(this.skipIntroBtn, ['btn', 'skip-intro', 'typography']);
        this.skipIntroBtn.innerHTML = 'Play';
        btnBox.appendChild(this.playerVsComputerBtn);
        btnBox.appendChild(this.playerVsPlayerBtn);
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
        this.computerDifficulty.style.visibility = 'hidden';
        this.initButtons();
        this.initSplashScreen();
    }
    destroySplashScreen() {
        this.splashScreen.remove();
    }
    destroyTitle() {
        this.titleEl.remove();
    }
    initSplashScreen() {
        // Set up splash screen
        for (let i = 0; i < this.titleLetters.length; i++) {
            setTimeout((e) => {
                if (i % 2 === 0) {
                    this.titleLetters[i].parentElement.dataset.pieceColor = __WEBPACK_IMPORTED_MODULE_2__piece__["a" /* default */].colors.red;
                }
                else {
                    this.titleLetters[i].parentElement.dataset.pieceColor = __WEBPACK_IMPORTED_MODULE_2__piece__["a" /* default */].colors.yellow;
                }
                __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].fadeInOut(this.titleLetters[i].parentElement);
            }, (700 * i));
        }
        setTimeout((e) => {
            for (let i = 0; i < this.titleLetters.length; i++) {
                __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].fadeIn(this.titleLetters[i].parentElement);
            }
            setTimeout((e) => {
                if (!this.skipIntro) {
                    __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].shrink(this.titleEl);
                }
                setTimeout((e) => {
                    if (!this.skipIntro) {
                        this.playerVsComputerBtn.style.visibility = 'visible';
                        this.playerVsPlayerBtn.style.visibility = 'visible';
                        this.computerDifficulty.style.visibility = 'visible';
                        this.skipIntroBtn.style.visibility = 'hidden';
                    }
                    for (let i = 0; i < this.titleLetters.length; i++) {
                        __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].bounceInfinite(this.titleLetters[i], i);
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
    }
    initButtons() {
        this.clearBoardBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].vibrateDevice([25]);
            this.closeSidebarButton.click();
            await this.gameController.gameBoard.clearBoard();
            this.gameController.gameBoard.destroyBoard();
            this.gameController.newGame();
        });
        // Player vs AI button
        this.playerVsComputerBtn.addEventListener('click', (e) => {
            console.log('pva');
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].vibrateDevice([25]);
            this.toggleButtonsView();
            // this.destroyTitle();
            // let settingsScreen = new SettingsScreen(this.settings);
            this.settings.difficulty = Number(this.computerDifficulty.options[this.computerDifficulty.selectedIndex].text);
            this.settings.aiColor = __WEBPACK_IMPORTED_MODULE_2__piece__["a" /* default */].colors.yellow;
            this.settings.gameType = __WEBPACK_IMPORTED_MODULE_3__settings__["a" /* GameType */].playerVsAI;
            this.gameController = new __WEBPACK_IMPORTED_MODULE_0__game_controller__["a" /* GameController */](this.settings);
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].slideOutTop(this.titleEl);
            setTimeout((e) => {
                this.splashScreen.style.visibility = 'hidden';
                __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].slideFromBottom(this.gameController.boardElement);
                this.destroyTitle();
            }, 700);
        }, false);
        // Player vs Player button 
        this.playerVsPlayerBtn.addEventListener('click', (e) => {
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].vibrateDevice([25]);
            this.toggleButtonsView();
            console.log('pvp');
            this.gameController = new __WEBPACK_IMPORTED_MODULE_0__game_controller__["a" /* GameController */](this.settings);
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].slideOutTop(this.titleEl);
            setTimeout((e) => {
                this.splashScreen.style.visibility = 'hidden';
                __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].slideFromBottom(this.gameController.boardElement);
                this.destroyTitle();
            }, 700);
        }, false);
        // Skip intro button
        this.skipIntroBtn.addEventListener('click', (e) => {
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].vibrateDevice([25]);
            this.skipIntro = true;
            this.titleEl.classList.remove('shrink-anim');
            this.titleEl.classList.add('shrunk');
            this.toggleButtonsView();
            this.skipIntroBtn.style.display = 'none';
        }, false);
        // let gameController = new GameController(settings);
        this.openSidebarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].vibrateDevice([25]);
            if (this.sidebar.classList.contains('is-open')) {
                this.closeSideBar();
            }
            else {
                this.openSideBar();
            }
        });
        this.closeSidebarButton.addEventListener('click', (e) => {
            e.stopPropagation();
            __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].vibrateDevice([25]);
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
/* harmony export (immutable) */ __webpack_exports__["a"] = SplashScreen;



/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__computer_controller__ = __webpack_require__(12);


class GameController {
    constructor(settings) {
        this.boardElement = document.getElementById('board');
        let startingTurn = settings.startingTurn;
        this.settings = settings;
        this.thinkingStatus = document.getElementById('loading-block');
        this.newGame();
        this.boardElement.addEventListener(__WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */].events.gameOver.type, (e) => {
            console.log(e.detail);
            e.stopPropagation();
        }, false);
        this.boardElement.addEventListener(__WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */].events.changeTurn.type, async (e) => {
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
    newGame() {
        this.gameBoard = new __WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */](this.boardElement, this.settings);
        this.setupComputer();
    }
    setupComputer() {
        this.computerController = new __WEBPACK_IMPORTED_MODULE_1__computer_controller__["a" /* ComputerController */](this.gameBoard, this.settings);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameController;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__board__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__piece__ = __webpack_require__(0);


class ComputerController {
    constructor(gameBoard, settings) {
        this.gameBoard = gameBoard;
        this.difficulty = settings.difficulty;
        this.color = settings.aiColor;
        this.settings = settings;
        this.opponentColor = this.color === __WEBPACK_IMPORTED_MODULE_1__piece__["a" /* default */].colors.red ? __WEBPACK_IMPORTED_MODULE_1__piece__["a" /* default */].colors.yellow : __WEBPACK_IMPORTED_MODULE_1__piece__["a" /* default */].colors.red;
        console.log('Computer difficulty set to ', this.difficulty);
    }
    /**
     * decideMove determines the best possible move for the AI to make by
     * implementing a form of the max-min algorithm
     */
    decideMove() {
        let turn = this.difficulty;
        let testBoard = new __WEBPACK_IMPORTED_MODULE_0__board__["a" /* default */](document.createElement('div'), this.settings, true);
        testBoard.board = this.gameBoard.copyBoard();
        let possibleMoves = this.projectMoves(testBoard, this.color);
        let max = this.playAhead(testBoard, turn, this.color);
        let bestCol = max[0];
        let bestScore = max[1];
        // console.log(bestCol, bestScore);
        this.gameBoard.placepiece(bestCol);
        // this.updateComputerStatus(-1);
    }
    playAhead(testBoard, turn, color) {
        if (turn < 0) {
            return this.score(testBoard, color);
        }
        let possibleMoves = this.projectMoves(testBoard, color);
        let boardReset = testBoard.copyBoard();
        if (color === this.color) {
            let bestScore = Number.NEGATIVE_INFINITY;
            let bestCol = 0;
            let totalMoves = 0;
            // Get our max
            for (let col of possibleMoves) {
                testBoard = this.makeMove(testBoard, col, color);
                let max = this.playAhead(testBoard, turn - 1, this.opponentColor);
                let c = max[0];
                let maxScore = max[1];
                // totalMoves += max[2];
                testBoard.board = boardReset;
                if (maxScore > bestScore) {
                    bestScore = maxScore;
                    bestCol = c;
                }
                // this.updateComputerStatus(totalMoves);
            }
            return [bestCol, bestScore, totalMoves];
        }
        else {
            let bestCol = 0;
            let bestScore = Number.POSITIVE_INFINITY;
            let totalMoves = 0;
            // Respond wth opponents best min move
            for (let col of possibleMoves) {
                testBoard = this.makeMove(testBoard, col, color);
                let min = this.playAhead(testBoard, turn - 1, this.color);
                let c = min[0];
                let minScore = min[1];
                // totalMoves += min[2];
                testBoard.board = boardReset;
                if (minScore < bestScore) {
                    bestScore = minScore;
                    bestCol = c;
                }
                // this.updateComputerStatus(totalMoves);
            }
            return [bestCol, bestScore, totalMoves];
        }
    }
    updateComputerStatus(move) {
        if (move === -1) {
            this.statusElement.innerHTML = '';
        }
        else {
            this.statusElement.innerHTML = `Evaluating move number ${move}`;
        }
    }
    score(testBoard, color) {
        let opp = color === this.color ? this.opponentColor : this.color;
        let iWin = this.checkWin(testBoard, color);
        let oppWin = this.checkWin(testBoard, opp);
        if (iWin.win) {
            return [iWin.col, Number.POSITIVE_INFINITY, 1];
        }
        else if (oppWin.win) {
            return [oppWin.col, Number.NEGATIVE_INFINITY, 1];
        }
        else {
            if (color === this.color) {
                return [oppWin.col, oppWin.score, 1];
            }
            else {
                return [iWin.col, iWin.score, 1];
            }
        }
    }
    makeMove(testBoard, col, color) {
        let row = testBoard.getPossibleMove(col);
        testBoard.board[row][col].setPieceColor(color, false);
        return testBoard;
    }
    projectMoves(testBoard, color) {
        let possibleMoves = [];
        for (let col = 0; col < this.gameBoard.width; col++) {
            // Create copy of current board.
            let winChecks = [];
            let boardCopy = testBoard.copyBoard();
            let row = testBoard.getPossibleMove(col);
            let score = 0;
            if (row !== -1) {
                possibleMoves.push(col);
            }
        }
        return possibleMoves;
    }
    checkWin(testBoard, color) {
        let scoreMap = {};
        for (let col = 0; col < this.gameBoard.width; col++) {
            // Create copy of current board.
            let winChecks = [];
            let boardCopy = testBoard.copyBoard();
            let row = testBoard.getPossibleMove(col);
            row += 1;
            if (row <= 5) {
                // Loop through each column and place the computer players piece.
                // Check win for each piece.
                winChecks.push(boardCopy[row][col].checkDiagonalLeft());
                winChecks.push(boardCopy[row][col].checkDiagonalRight());
                winChecks.push(boardCopy[row][col].checkHorizontalWin());
                winChecks.push(boardCopy[row][col].checkVerticalWin());
                scoreMap[col] = this.computeScore(winChecks);
            }
            else {
                scoreMap[col] = 0;
            }
        }
        if (scoreMap[this.getMaxCol(scoreMap)] === Number.POSITIVE_INFINITY) {
            return { win: true, score: scoreMap[this.getMaxCol(scoreMap)], col: this.getMaxCol(scoreMap) };
        }
        return { win: false, score: scoreMap[this.getMaxCol(scoreMap)], col: this.getMaxCol(scoreMap) };
    }
    computeScore(checks) {
        let score = 0;
        for (let i = 0; i < checks.length; i++) {
            let check = checks[i];
            score += check.run.length;
        }
        return score;
    }
    getMinMax(max, min) {
        let minMax = {};
        let columns = Object.keys(max);
        for (let col of columns) {
            let score = max[col] - min[col];
            minMax[col] = score;
        }
        return minMax;
    }
    getMaxCol(scoreMap) {
        let maxScore = Number.NEGATIVE_INFINITY;
        let maxCol = 0;
        for (let col of Object.keys(scoreMap)) {
            if (scoreMap[col] > maxScore) {
                maxScore = scoreMap[col];
                maxCol = Number(col);
            }
        }
        return maxCol;
    }
    getMinCol(scoreMap) {
        let minScore = Number.POSITIVE_INFINITY;
        let minCol = 0;
        for (let col of Object.keys(scoreMap)) {
            if (scoreMap[col] < minScore) {
                minScore = scoreMap[col];
                minCol = Number(col);
            }
        }
        return minCol;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ComputerController;



/***/ })
/******/ ]);