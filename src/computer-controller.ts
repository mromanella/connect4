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

    constructor(gameBoard: Board, settings: Settings) {
        this.gameBoard = gameBoard;
        this.difficulty = settings.difficulty;
        this.color = settings.aiColor;
        this.settings = settings;
        console.log('Computer difficulty set to ', this.difficulty);
    }


    /**
     * decideMove determines the best possible move for the AI to make by 
     * implementing a form of the max-min algorithm
     */
    decideMove() {
        let testBoard = new Board(document.createElement('div'), this.settings, true);
        testBoard.board = this.gameBoard.copyBoard();
        let turn = this.difficulty * 8;
        let col = 0;
        let score = 0;
        while (turn > 0) {
            let pack = this.getMax(testBoard);
            col = pack[0];
            score = pack[1];
            if (score === Number.NEGATIVE_INFINITY || score === Number.POSITIVE_INFINITY ) {
                break;
            }

            let row = testBoard.getPossibleMove(col)
            if (testBoard) {
                testBoard.board[row][col].setPieceColor(this.color);

            }
            turn--;
        }
        // console.log(col, score);
        this.gameBoard.placepiece(col);
    }

    private getMax(testBoard: Board): number[] {
        let columnWinList: columnMaxInt[] = [];
        let columnLoseList: columnMaxInt[] = [];
        for (let col = 0; col < 6; col++) {
            // Create copy of board.
            let boardCopy: PlayerPiece[][] = testBoard.copyBoard();
            let row = testBoard.getPossibleMove(col);
            if (row !== -1) {
                // Loop through each column and place the computer players piece.
                // Check win for each piece.
                boardCopy[row][col].setPieceColor(this.color);
                let winChecks: WinCheckResults[] = [];
                winChecks.push(boardCopy[row][col].checkHorizontalWin());
                // winChecks.push(boardCopy[row][col].checkHorizontalRight());
                winChecks.push(boardCopy[row][col].checkVerticalWin());
                winChecks.push(boardCopy[row][col].checkDiagonalLeft());
                winChecks.push(boardCopy[row][col].checkDiagonalRight());

                columnWinList.push({ column: col, winChecks: winChecks });

                // Minimize
                let color = this.color === PlayerPiece.colors.red ? PlayerPiece.colors.yellow : PlayerPiece.colors.red
                boardCopy[row][col].setPieceColor(color);
                winChecks = [];
                winChecks.push(boardCopy[row][col].checkHorizontalWin());
                // winChecks.push(boardCopy[row][col].checkHorizontalRight());
                winChecks.push(boardCopy[row][col].checkVerticalWin());
                winChecks.push(boardCopy[row][col].checkDiagonalLeft());
                winChecks.push(boardCopy[row][col].checkDiagonalRight());

                columnLoseList.push({ column: col, winChecks: winChecks });

            }
        }

        let scoreMap: any = {};

        for (let i = 0; i < columnWinList.length; i++) {
            let score = 0;
            let column = columnWinList[i].column;
            for (let k = 0; k < columnWinList[i].winChecks.length; k++) {

                if (columnLoseList[i].winChecks[k].win) {
                    score = Number.NEGATIVE_INFINITY;
                    break;
                } else if (columnWinList[i].winChecks[k].win) {
                    score = Number.POSITIVE_INFINITY;
                    break;
                } else {
                    let min = columnLoseList[i].winChecks[k].run.length;
                    let max = columnWinList[i].winChecks[k].run.length;
                    score += (max - min);
                }
            }
            scoreMap[column] = score;
        }

        // Using the run as a metric, the maximize gain will be determined by the current length of the run.
        let showComputer = true;
        let maxScore = Number.NEGATIVE_INFINITY;
        let max = Math.floor(Math.random() * 7);
        while (this.gameBoard.getPossibleMove(max) === -1) {
            max = Math.floor(Math.random() * 7);
        }

        // if (showComputer) {
        //     for (let i = 0; i < this.gameBoard.width; i++) {
        //         setTimeout((e) => {
        for (let column of Object.keys(scoreMap)) {
            if (scoreMap[column] === Number.NEGATIVE_INFINITY) {
                return [column, scoreMap[column]];
            } else if (scoreMap[column] === Number.POSITIVE_INFINITY) {
                return [column, scoreMap[column]];
            } else {
                if (scoreMap[column] >= maxScore) {
                    max = Number(column);
                    maxScore = scoreMap[column];
                }
            }
        }

        // Choose a random
        if (maxScore === 0) {
            max = Math.floor(Math.random() * 4) + 2;
            while (this.gameBoard.getPossibleMove(max) === -1) {
                max = Math.floor(Math.random() * 7);
            }
        }
        
        return [max, maxScore];

    }
}