GAME_OVER = -1
CLOSED = -1
EMPTY = 0
MINE = 1
EXPLODE = 2

// The board is an MxN array of numbers, which is used to store
// various information about the game.
//
// The game board has the values:
//   0: empty spot (EMPTY)   
//   1: mine (MINE),    
//   2: exploded mine (EXPLODE)
//
// The player board has the values:
//  -1: closed cell (CLOSED), 
//  [0..8]: count of neighbouring mines
class Board {

    constructor(width, height, initialValue) {
        this.width = width;
        this.height = height;
        // Initialize the 2D array with 2 extra rows/columns. This makes
        // it easier to perform a count on the neighbours.
        this.board = new Array(height + 2);
        for(let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(this.width + 2);
            this.board[i].fill(initialValue);
        }
    }

    get(x, y) {
        // Offset the position by (1, 1) because the array is bigger.
        return this.board[y + 1][x + 1];
    }

    set(x, y, value) {
        // Offset the position by (1, 1) because the array is bigger.
        this.board[y + 1][x + 1] = value;
    }

    count(x, y) {
        // Find the sum of all the neighbours. We don't need to check
        // any array bounds, because the neighbours on the edge are
        // always zero.
        let sum = 0;
        for(let i = y - 1; i <= y + 1; i++)
            for(let j = x - 1; j <= x + 1; j++)
                sum += this.get(j, i) ? 1 : 0;
        return sum;
    }
}

class CanvasBoard {

    // Cell size in pixel.
    cellSize = 24;

    // Emoji's
    numbers = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
    states = ["", "💣", "💥"];

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", (e) => this.onClick(e));
    }

    // Draw the game on the canvas.
    draw(minesweeper) {
        this.canvas.width = minesweeper.width * this.cellSize;
        this.canvas.height = minesweeper.height * this.cellSize;
        for(let y = 0; y < minesweeper.height; y++) 
            for(let x = 0; x < minesweeper.width; x++) {

                this.ctx.fillStyle = "#dce2e8";
                this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);

                // If the cell is opened by the player, and there is no bomb there, we
                // draw the number in the player board.
                if(minesweeper.playerBoard.get(x, y) !== CLOSED 
                   && minesweeper.gameBoard.get(x,y) === EMPTY) {
                    this.ctx.fillStyle = "black";
                    this.ctx.font = "18px Arial";
                    let emoji = this.numbers[minesweeper.playerBoard.get(x, y)];
                    this.ctx.fillText(emoji, x * this.cellSize, y * this.cellSize + 18);
                }

                // If the game ended, we reveal all the bombs.
                if(minesweeper.gameEnded) {
                    this.ctx.fillStyle = "black";
                    this.ctx.font = "18px Arial";
                    let state = minesweeper.gameBoard.get(x, y);
                    if(state) {
                        let emoji = this.states[state];
                        this.ctx.fillText(emoji, x * this.cellSize, y * this.cellSize + 18);
                    }
                }
            }
    }

    onClick(e) {
        // Calculate the cell (x, y) coordinate based on the mouse position.
        const canvasRect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - canvasRect.left;
        const mouseY = e.clientY - canvasRect.top;
        const x = Math.floor(mouseX / this.cellSize);
        const y = Math.floor(mouseY / this.cellSize);
        if(this.onClickCallback) {
            this.onClickCallback(x, y);
        }
    }   
}

class Minesweeper {
    // A difficulty setting contains the width, height, and 
    // the probability that a cell is a mine.
    difficulties = {
        'beginner': [10, 10, 0.156],
        'intermediate': [15, 13, 0.205],
        'expert': [30, 16, 0.206]
    }

    gameEnded = false;
    numberOfMines;
    openedCells;

    constructor(canvasId, difficulty) {
        this.difficulty = difficulty;
        const settings = this.difficulties[difficulty];
        this.width = settings[0];
        this.height = settings[1];
        this.probability = settings[2];
        this.gameBoard = new Board(this.width, this.height, EMPTY);
        this.playerBoard = new Board(this.width, this.height, CLOSED);
        this.canvasBoard = new CanvasBoard(canvasId);
        this.placeMines(this.probability);
        this.openedCells = 0;
        this.onChange();
    }

    placeMines(probability) {
        // Place a random number of mines based on a probability 
        // that a cell will contain a mine.
        for(let y = 0; y < this.height; y++)
            for(let x = 0; x < this.width; x++) {
                if(Math.random() <= probability) {
                    this.gameBoard.set(x, y, 1);
                    this.numberOfMines++;
                }
            }
    }

    open(x, y) {
        // Count how many mines there are around this cell.
        let count = 0;

        // If the game already ended, we do not run the game logic anymore.
        if(this.gameEnded) {
            return -1;
        }

        // If the player click on a mine, it is game over!
        if(this.gameBoard.get(x, y) === MINE) {

            this.gameEnded = true;

            // Show which mine the player clicked on as an explosion.
            this.gameBoard.set(x, y, EXPLODE);
            
            // Go through the entire board, and open all the remaining cells.
            for(let y = 0; y < this.height; y++) {
                for(let x = 0; x < this.width; x++) {
                    if(this.gameBoard.get(x, y) !== MINE) {
                        let count = this.gameBoard.count(x, y);
                        this.playerBoard.set(x, y, count);
                    }
                }
            }

            // Return the game over state.
            count = GAME_OVER;
        }
        else {

            // The player click on an empty spot, count the mines around this cell and
            // update the player board.
            count = this.gameBoard.count(x, y);
            this.playerBoard.set(x, y, count);

            // If there are no more remaining cell, then the game has finished.
            this.gameEnded = this.width * this.height == this.openedCells - this.numberOfMines;
        }

        // Invoke the on change event listeners.
        this.onChange();

        // Return how many mines there are around this cell, or -1 for game over.
        return count;
    }
    
    onChange() {
        this.canvasBoard.draw(this);
    }

    bindOnClick(f) {
        this.canvasBoard.onClickCallback = f;
    }
}