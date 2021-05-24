CLOSED = -1
EMPTY = 0
MINE = 1
EXPLODE = 2

class Board {

    constructor(width, height, initialValue) {
        this.width = width;
        this.height = height;
        this.board = new Array(height + 2);
        for(let i = 0; i < this.board.length; i++) {
            this.board[i] = new Array(this.width + 2);
            this.board[i].fill(initialValue);
        }
    }

    get(x, y) {
        if(x < 0 || y < 0) {
            console.log("get:", x, y);
            console.log(this.board);
        }
        return this.board[y + 1][x + 1];
    }

    set(x, y, value) {
        this.board[y + 1][x + 1] = value;
    }

    count(x, y) {
        let sum = 0;
        for(let i = y - 1; i <= y + 1; i++)
            for(let j = x - 1; j <= x + 1; j++)
                sum += this.get(j, i) ? 1 : 0;
        return sum;
    }
}

class CanvasBoard {
    cellSize = 24;
    numbers = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
    states = ["", "💣", "💥"];

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.canvas.addEventListener("click", (e) => this.onClick(e));
    }

    draw(minesweeper) {
        this.canvas.width = minesweeper.width * this.cellSize;
        this.canvas.height = minesweeper.height * this.cellSize;
        for(let y = 0; y < minesweeper.height; y++) 
            for(let x = 0; x < minesweeper.width; x++) {

                this.ctx.fillStyle = "#dce2e8";
                this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);

                if(minesweeper.playerBoard.get(x, y) !== CLOSED 
                   && minesweeper.gameBoard.get(x,y) === EMPTY) {
                    this.ctx.fillStyle = "black";
                    this.ctx.font = "18px Arial";
                    let emoji = this.numbers[minesweeper.playerBoard.get(x, y)];
                    this.ctx.fillText(emoji, x * this.cellSize, y * this.cellSize + 18);
                }

                if(minesweeper.isDead) {
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
        console.log(this);
    }

    placeMines(probability) {
        for(let y = 0; y < this.height; y++)
            for(let x = 0; x < this.width; x++) {
                if(Math.random() <= probability) {
                    this.gameBoard.set(x, y, 1);
                    this.numberOfMines++;
                }
            }
    }

    open(x, y) {
        
        let count = 0;

        if(this.gameEnded) {
            return -1;
        }

        if(this.gameBoard.get(x, y) === MINE) {
            this.gameBoard.set(x, y, EXPLODE);
            this.gameEnded = true;
            for(let y = 0; y < this.height; y++) {
                for(let x = 0; x < this.width; x++) {
                    if(this.gameBoard.get(x, y) !== MINE) {
                        count = this.gameBoard.count(x, y);
                        this.playerBoard.set(x, y, count);
                    }
                }
            }
        }
        else {
            count = this.gameBoard.count(x, y);
            this.playerBoard.set(x, y, count);

            if(this.width * this.height == this.openedCells - this.numberOfMines) {
                this.gameEnded = true;
            }
        }

        this.onChange();
        return count;
    }
    
    onChange() {
        this.canvasBoard.draw(this);
    }

    bindOnClick(f) {
        this.canvasBoard.onClickCallback = f;
    }
}