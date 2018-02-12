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
        let testBoard = new Board(document.createElement('div'), this.settings, true);
        testBoard.board = this.gameBoard.copyBoard();
        let turn = this.difficulty * 2;
        let max: any = { col: 3, value: 0 };
        let min: any = { col: 3, value: 0 };
        let col = 3;
        let initTurn = turn;

        while (turn > 0) {
            let maxChecks: WinCheckResults[] = this.getMax(testBoard, this.color);
            for (let i = 0; i < maxChecks.length; i++) {
                if (maxChecks[i].win) {
                    max = { col: maxChecks[i].col, value: Number.POSITIVE_INFINITY };
                    break;
                }

                if (maxChecks[i].run.length > max.value) {
                    max = { col: maxChecks[i].col, value: maxChecks[i].run.length };
                }
            }

            let minChecks: WinCheckResults[] = this.getMax(testBoard, this.opponentColor)
            for (let i = 0; i < minChecks.length; i++) {
                if (minChecks[i].win && (turn !== initTurn)) {
                    // console.log('lose', minChecks[i].col)
                    min = { col: minChecks[i].col, value: Number.POSITIVE_INFINITY };
                    break;
                }

                if (minChecks[i].run.length > min.value) {
                    min = { col: minChecks[i].col, value: minChecks[i].run.length };
                }
            }

            if (min.value === Number.POSITIVE_INFINITY) {
                // console.log('losing next turn')
                col = min.col;
                break;
            } 

            if (max.value === Number.POSITIVE_INFINITY) {
                col = max.col;
                break;
            }
            
            if (max.value > min.value) {
                col = max.col;
            } else {
                col = min.col;
            }
            turn--;
        }

        let earlyGame = 0;
        for (let i = 0; i < this.gameBoard.board[5].length; i++) {
            if (this.gameBoard.board[5][i].compareTo(PlayerPiece.colors.empty)) {
                earlyGame++;
            }
        }

        if (earlyGame > 5) {
            col = Math.floor(Math.random() * 3 + 2);

            while (this.gameBoard.getPossibleMove(col) === -1) {
                col = Math.floor(Math.random() * 7);
            }
        }

        // console.log(max, min);
        this.gameBoard.placepiece(col);
    }

    private getMax(testBoard: Board, color: string): WinCheckResults[] {
        let winChecks: WinCheckResults[] = [];
        for (let col = 0; col < this.gameBoard.width; col++) {
            // Create copy of board.
            let boardCopy: PlayerPiece[][] = testBoard.copyBoard();
            let row = testBoard.getPossibleMove(col);
            if (row !== -1) {
                // Loop through each column and place the computer players piece.
                // Check win for each piece.
                boardCopy[row][col].setPieceColor(color);
                // console.log(boardCopy[5][6].checkHorizontalWin())
                winChecks.push(boardCopy[row][col].checkHorizontalWin());
                // winChecks.push(boardCopy[row][col].checkHorizontalRight());
                winChecks.push(boardCopy[row][col].checkVerticalWin());
                winChecks.push(boardCopy[row][col].checkDiagonalLeft());
                winChecks.push(boardCopy[row][col].checkDiagonalRight());
            }
        }

        return winChecks;

        // let scoreMap: any = {};

        // for (let i = 0; i < columnWinList.length; i++) {
        //     let score = 0;
        //     let min = 0;
        //     let max = 0;
        //     let column = columnWinList[i].column;
        //     for (let k = 0; k < columnWinList[i].winChecks.length; k++) {

        //         if (columnLoseList[i].winChecks[k].win) {
        //             min = Number.NEGATIVE_INFINITY;
        //             max = 0;
        //         } else if (columnWinList[i].winChecks[k].win) {
        //             max = Number.POSITIVE_INFINITY;
        //             min = 0;
        //         } else {
        //             min = columnLoseList[i].winChecks[k].run.length;
        //             max = columnWinList[i].winChecks[k].run.length;
        //         }
        //         scoreMap[column] = { min: min, max: max };
        //     }
        // }

        // // Using the run as a metric, the maximize gain will be determined by the current length of the run.
        // let showComputer = true;
        // let maxScore = 0;
        // let max = Math.floor(Math.random() * 7);
        // while (this.gameBoard.getPossibleMove(max) === -1) {
        //     max = Math.floor(Math.random() * 7);
        // }

        // // if (showComputer) {
        // //     for (let i = 0; i < this.gameBoard.width; i++) {
        // //         setTimeout((e) => {
        // for (let column of Object.keys(scoreMap)) {
        //     if (scoreMap[column].min === Number.NEGATIVE_INFINITY) {
        //         return [column, scoreMap[column].min];
        //     } else if (scoreMap[column].max === Number.POSITIVE_INFINITY) {
        //         return [column, scoreMap[column].max];
        //     } else {
        //         if ((scoreMap[column].max - scoreMap[column].min) > (scoreMap[max].min - scoreMap[max].min)) {
        //             max = Number(column);
        //             maxScore = scoreMap[column];
        //         }
        //     }
        // }

        // // Choose a random
        // if (maxScore === 0) {
        //     max = Math.floor(Math.random() * 7);
        //     while (this.gameBoard.getPossibleMove(max) === -1) {
        //         max = Math.floor(Math.random() * 7);
        //     }
        // }

        // return [max, maxScore];

    }
}