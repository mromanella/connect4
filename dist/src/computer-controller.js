import Board from './board/board';
import PlayerPiece from './piece/piece';
export class ComputerController {
    constructor(gameBoard, settings) {
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
    async decideMove() {
        this.gameBoard.opponentsTurn = true;
        let turn = this.difficulty;
        let testBoard = new Board(document.createElement('div'), this.settings, true);
        testBoard.board = this.gameBoard.copyBoard();
        let possibleMoves = this.projectMoves(testBoard, this.color);
        let score = this.score(testBoard, this.color);
        if (score[1] === Number.POSITIVE_INFINITY || score[1] === Number.NEGATIVE_INFINITY) {
            this.gameBoard.placepiece(score[0]);
        }
        else {
            let max = this.playAhead(testBoard, turn, this.color);
            // console.log(max);
            let bestCol = max[0];
            let bestScore = max[1];
            // console.log(bestCol, bestScore);
            this.gameBoard.placepiece(bestCol);
        }
        this.gameBoard.opponentsTurn = false;
        // this.updateComputerStatus(-1);
    }
    playAhead(testBoard, turn, color) {
        if (turn < 0) {
            return this.score(testBoard, color);
        }
        let possibleMoves = this.projectMoves(testBoard, color);
        let boardReset = testBoard.copyBoard();
        let bestCol;
        let bestScore;
        if (color === this.color) {
            bestScore = Number.NEGATIVE_INFINITY;
            // Get our max
            for (let col of possibleMoves) {
                // testBoard = this.makeMove(testBoard, col, color);
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
        }
        else {
            bestScore = Number.POSITIVE_INFINITY;
            // Respond wth opponents best min move
            for (let col of possibleMoves) {
                // testBoard = this.makeMove(testBoard, col, color);
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
        }
        return [bestCol, bestScore];
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
            // if (color === this.color) {
            //     return [oppWin.col, -oppWin.score, 1];
            // } else {
            //     return [iWin.col, iWin.score, 1];
            // }
            return [oppWin.col, -oppWin.score, 1];
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
            let row = testBoard.getPossibleMove(col);
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
            if (row !== -1) {
                // Loop through each column and place the computer players piece.
                // Check win for each piece.
                boardCopy[row][col].setPieceColor(color, false);
                winChecks.push(boardCopy[row][col].checkDiagonalLeft());
                winChecks.push(boardCopy[row][col].checkDiagonalRight());
                winChecks.push(boardCopy[row][col].checkHorizontalWin());
                winChecks.push(boardCopy[row][col].checkVerticalWin());
                scoreMap[col] = this.computeScore(winChecks);
            }
        }
        let max = this.getMaxCol(scoreMap);
        // console.log(this.getMaxCol(scoreMap));
        if (scoreMap[this.getMaxCol(scoreMap)] === Number.POSITIVE_INFINITY) {
            return { win: true, score: scoreMap[this.getMaxCol(scoreMap)], col: max };
        }
        return { win: false, score: scoreMap[this.getMaxCol(scoreMap)], col: max };
    }
    computeScore(checks) {
        let score = 0;
        for (let i = 0; i < checks.length; i++) {
            let check = checks[i];
            if (check.win) {
                // console.log('win')
                return Number.POSITIVE_INFINITY;
            }
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
