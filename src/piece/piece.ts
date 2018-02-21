// Styles
import "./piece.css"

export interface WinCheckResults {
    win: boolean;
    run: PlayerPiece[];
    col: number;
}

export default class PlayerPiece {

    /**
     * PieceColors - Piece colors are strings that correspond to a data attribute for CSS
     */
    static readonly colors = {
        empty: 'empty',
        red: 'red',
        yellow: 'yellow',
        possibleYellow: 'possibleyellow',
        possibleRed: 'possiblered'
    };

    // row and col are the row and column coordinates of this Piece on the board
    row: number;
    col: number;
    parentBoard: PlayerPiece[][];

    winChecks = [this.checkHorizontalWin, this.checkVerticalWin, this.checkDiagonalWin];
    // this.checkDiagonalWin

    // view is the dom view
    view: HTMLElement;

    /**
     * Creates a Piece with awareness of location in board and of a color
     * @param color Piece color
     * @param row 
     * @param col 
     * @param parentBoard The the board which the piece resides in. Allows the piece to check for a win relative to its possition in the 
     * parent board.
     */
    constructor(color: string, row: number, col: number, parentBoard: PlayerPiece[][]) {
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
    getPieceColor(): string {
        return this.view.dataset.pieceColor;
    }

    /**
     * Sets the Piece to the given color. Applies drop in animation
     * @param PieceColor Piece color to set the Piece to
     */
    async setPieceColor(color: string, applyAnimation: boolean = true): Promise<any> {
        // Set the Piece
        this.view.dataset.pieceColor = color;

        // Modify the css to reflect the newly places Piece 
        if (color === PlayerPiece.colors.red) {
            this.view.classList.remove(PlayerPiece.colors.possibleRed);
        } else {
            this.view.classList.remove(PlayerPiece.colors.possibleYellow);
        }


        // Begin animation
        if (applyAnimation) {
            await this.dropInPiece();
            await this.bouncePiece();
        }
    }

    /**
     * Removes the Piece from the board
     * @param offset Optional offset to wait to remove item.
     */
    remove(offset: number = 0): Promise<any> {
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
    showPossibleMove(color: string) {
        this.view.dataset.pieceColor = color;
    }

    /**
     * Checks for win in diagonal, horizontal, and vertical (when appropriate).
     * If a win is determined, returns true f
     * or key win, and the 4 pieces included in the run.
     * Otherwhise return false and empty run
     */
    checkForWin(): WinCheckResults {
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
    compareTo(testPiece: any): boolean {
        if (testPiece instanceof PlayerPiece) {
            return this.getPieceColor() === testPiece.getPieceColor();
        } else {
            // Assuming string
            return this.getPieceColor() === testPiece;
        }

    }


    // ----- Win check methods -----

    checkHorizontalWin(): WinCheckResults {
        let checkSet: PlayerPiece[] = [this];
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

    checkHorizontalLeft(): WinCheckResults {
        let checkSet: PlayerPiece[] = [this];
        // Check left
        for (let i = this.col - 1; i >= this.col - 3; i--) {
            let checkCol = i;
            if (checkCol < 0) {
                checkCol = this.col + Math.abs(i)
            } else if (checkCol > 6) {
                checkCol = this.col - Math.abs(i);
            }
            if (checkCol < this.col) {
                checkSet.unshift(this.parentBoard[this.row][checkCol]);
            } else if (checkCol > this.col) {
                checkSet.push(this.parentBoard[this.row][checkCol]);
            }
        }

        return this.checkSetForWin(checkSet);
    }


    checkVerticalWin(): WinCheckResults {
        let checkSet: PlayerPiece[] = [this];
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

    checkDiagonalWin(): WinCheckResults {
        let winCheckResults: WinCheckResults = this.checkDiagonalLeft();
        return winCheckResults.win ? winCheckResults : this.checkDiagonalRight();
    }

    checkDiagonalLeft(): WinCheckResults {
        let checkSet: PlayerPiece[] = [this];
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

    checkDiagonalRight(): WinCheckResults {
        let checkSet: PlayerPiece[] = [this];
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

    private emitEvent(event: CustomEvent, details = {}) {
        event.initCustomEvent(event.type, true, true, details);
        this.view.dispatchEvent(event);
    }

    // ----- Animation methods -----

    /**
     * Drop in Piece performs the animation where a Piece falls
     * into the slot from above
     */
    private dropInPiece(): Promise<any> {
        return new Promise((resolve) => {
            // Begin animation of the Piece dropping into the slot
            this.view.classList.add('drop-piece-in');
            // Set timeouts to remove animation and begin/remove bouncing animation upon
            // Piece landing on bottom of column
            setTimeout((e) => {
                this.view.classList.remove('drop-piece-in');
                resolve();
            }, 500);
        });
    }

    /**
     * Bounce Piece performs the animation where a Piece bounces
     * after hitting the bottom of its slot
     */
    private bouncePiece(): Promise<any> {
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
    private dropOutPiece(offset: number = 0): Promise<any> {
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

    private checkSetForWin(set: PlayerPiece[]): WinCheckResults {
        let run = [];
        let highestRun: PlayerPiece[] = [];
        let sub = [];
        for (let checkPiece of set) {
            if (this.compareTo(checkPiece) && checkPiece.getPieceColor() !== PlayerPiece.colors.empty) {
                sub.push(checkPiece);
                if (run.push(checkPiece) === 4) {
                    return { win: true, run: run, col: this.col };
                }
            } else {
                if (run.length > highestRun.length) {
                    highestRun = run.slice();
                }
                run = [];
            }
        }
        return { win: false, run: sub, col: this.col };
    }
}
