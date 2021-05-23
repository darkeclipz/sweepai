class Board {

    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.board = new Array(height + 2);
        for(let i = 0; i < this.board.length; i++)
            this.board[i] = new Array(this.width + 2);
    }

    get(x, y) {
        return this.cells[y + 1][x + 1];
    }

    set(x, y, value) {
        this.cells[y + 1][x + 1] = value;
    }

    count(x, y) {
        let sum = 0;
        for(let i = y - 1; i <= y + 1; i++)
            for(let j = x - 1; j <= x + 1; j++)
                sum += this.get(x, y);
        return sum;
    }
}

class CanvasBoard {
    cellSize = 24;

    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        console.log("context", this.ctx);
    }

    draw(minesweeper) {
        this.canvas.width = minesweeper.width * this.cellSize;
        this.canvas.height = minesweeper.height * this.cellSize;
        this.ctx.fillStyle = "#bbb";
        for(let x = 0; x < minesweeper.width; x++)
            for(let y = 0; y < minesweeper.height; y++) {
                this.ctx.fillRect(x * this.cellSize + 1, y * this.cellSize + 1, this.cellSize - 2, this.cellSize - 2);
            }
    }
}

class Minesweeper {
    difficulties = {
        'beginner': [10, 10, 0.156],
        'intermediate': [15, 13, 0.205],
        'expert': [30, 16, 0.206]
    }

    constructor(canvasId, difficulty) {
        this.difficulty = difficulty;
        const settings = this.difficulties[difficulty];
        this.width = settings[0];
        this.height = settings[1];
        this.probability = settings[2];
        this.gameBoard = new Board(this.width, this.height);
        this.playerBoard = new Board(this.width, this.height);
        this.canvasBoard = new CanvasBoard(canvasId);
        this.onChange();
        console.log(this);
    }

    open(x, y) {
        return 0;
    }
    
    onChange() {
        this.canvasBoard.draw(this);
    }
}