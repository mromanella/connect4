import Board from './board';
import PlayerPiece, { WinCheckResults } from './piece';
import { Difficulty, Settings } from './settings';

interface columnMaxInt {
    column: number;
    winChecks: WinCheckResults[];
}

export class ComputerController {

    gameBoard: Board;
    difficulty: Difficulty;
    color: string;
    settings: Settings;
    opponentColor: string;
    statusElement: HTMLElement;

    constructor(gameBoard: Board, settings: Settings) {
        this.gameBoard = gameBoard;
        this.difficulty = settings.difficulty;
        this.color = settings.aiColor;
        this.settings = settings;
        this.opponentColor = this.color === PlayerPiece.colors.red ? PlayerPiece.colors.yellow : PlayerPiece.colors.red;

        console.log('Computer difficulty set to ', this.difficulty);
    }


    /**
     * decideMove determines the best possible move for the AI to make by 
     * implementing a form of the max-min algorithm
     */
    decideMove() {
        let turn = this.difficulty;
        let testBoard = new Board(document.createElement('div'), this.settings, true);
        testBoard.board = this.gameBoard.copyBoard();

        let possibleMoves = this.projectMoves(testBoard, this.color);
        let max = this.playAhead(testBoard, turn, this.color);
        let bestCol = max[0];
        let bestScore = max[1];

        // console.log(bestCol, bestScore);

        this.gameBoard.placepiece(bestCol);
        // this.updateComputerStatus(-1);
    }

    private playAhead(testBoard: Board, turn: number, color: string): any {

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
        } else {
            let bestCol = 0;
            let bestScore = Number.POSITIVE_INFINITY;
            let totalMoves = 0;
            // Respond wth opponents best min move
            for (let col of possibleMoves) {
                testBoard = this.makeMove(testBoard, col, color);
                let min = this.playAhead(testBoard, turn - 1, this.color);
                let c = min[0];
                let minScore = min[1]
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

    private updateComputerStatus(move: number) {
        if (move === -1) {
            this.statusElement.innerHTML = '';
        } else {
            this.statusElement.innerHTML = `Evaluating move number ${move}`;
        }
    }

    private score(testBoard: Board, color: string) {
        let opp = color === this.color ? this.opponentColor : this.color;
        let iWin = this.checkWin(testBoard, color);
        let oppWin = this.checkWin(testBoard, opp);
        if (iWin.win) {
            return [iWin.col, Number.POSITIVE_INFINITY, 1];
        } else if (oppWin.win) {
            return [oppWin.col, Number.NEGATIVE_INFINITY, 1];
        } else {
            if (color === this.color) {
                return [oppWin.col, oppWin.score, 1];
            } else {
                return [iWin.col, iWin.score, 1];
            }
        }
    }

    private makeMove(testBoard: Board, col: number, color: string): Board {
        let row = testBoard.getPossibleMove(col);
        testBoard.board[row][col].setPieceColor(color, false);
        return testBoard;
    }

    private projectMoves(testBoard: Board, color: string): number[] {
        let possibleMoves = [];
        for (let col = 0; col < this.gameBoard.width; col++) {
            // Create copy of current board.
            let winChecks: WinCheckResults[] = [];
            let boardCopy = testBoard.copyBoard();
            let row = testBoard.getPossibleMove(col);
            let score = 0;
            if (row !== -1) {
                possibleMoves.push(col);
            }
        }

        return possibleMoves;
    }

    private checkWin(testBoard: Board, color: string) {
        let scoreMap: any = {};
        for (let col = 0; col < this.gameBoard.width; col++) {
            // Create copy of current board.
            let winChecks: WinCheckResults[] = [];
            let boardCopy = testBoard.copyBoard();
            let row = testBoard.getPossibleMove(col);
            if (row !== -1) {
                // Loop through each column and place the computer players piece.
                // Check win for each piece.
                boardCopy[row][col].setPieceColor(color);
                winChecks.push(boardCopy[row][col].checkDiagonalLeft());
                winChecks.push(boardCopy[row][col].checkDiagonalRight());
                winChecks.push(boardCopy[row][col].checkHorizontalWin());
                winChecks.push(boardCopy[row][col].checkVerticalWin());
                scoreMap[col] = this.computeScore(winChecks);
            }
        }
        if (scoreMap[this.getMaxCol(scoreMap)] === Number.POSITIVE_INFINITY) {
            return { win: true, score: scoreMap[this.getMaxCol(scoreMap)], col: this.getMaxCol(scoreMap) };
        }
        return { win: false, score: scoreMap[this.getMaxCol(scoreMap)], col: this.getMaxCol(scoreMap) };
    }

    private computeScore(checks: WinCheckResults[]) {
        let score = 0;
        for (let i = 0; i < checks.length; i++) {
            let check = checks[i];
            score += check.run.length;
        }
        return score;
    }

    private getMinMax(max: any, min: any): any {
        let minMax: any = {};
        let columns = Object.keys(max);
        for (let col of columns) {
            let score = max[col] - min[col];
            minMax[col] = score;
        }
        return minMax;
    }

    private getMaxCol(scoreMap: any): number {
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

    private getMinCol(scoreMap: any): number {
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