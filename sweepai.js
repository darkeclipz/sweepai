// A variable holds if a cell is free or a mine. It is undefined if this cell
// has not yet been opened. It will also hold a reference to all the constraints
// in which this variable is shared.
class Variable {
    constructor(name) {
        this.name = name;
        this.domain = [0, 1];
        this.value = undefined;
        this.constraints = [];
    }
}

// A constraint always consists of the variables that are the first order neighbours.
// If a cell is opened, we know how many mines there are so we set this is the value.
// Once the count (number of neighbours that are mines) is the same as the value, we
// can logically deduce all the other cells that we can open safely.
class Constraint {
    constructor(value, ...variables) {
        this.variables = variables;
        this.value = value;
        this.count = 0;
    }

    canReduce() {
        return this.value == this.count;
    }

    getUndefinedVariables() {
        return this.variables.filter(v => v.value === undefined);
    }
}

// Sweep AI solves a Minesweeper game by finding all the next deterministic moves.
// It doesn't handly non-deterministic moves (e.g. opening a square probabilistically).
// The reason it doesn't handle non-deterministic moves is because the requirements of the
// solver are determined by the CodeWars challenge for Minesweeper.
class SweepAi {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        console.log("SweepAI initialized.");
    }

    initialize(width, height) {
        // Initialize all the variables.
    }

    set(x, y, value) {
        // Set the value of a variable.
        // Create or update a constraint with the first order neighbours.
    }

    propagate(x, y, value) {
        // Propagate the value of the variable that is set to all the shared constraints.
    }

    next() {
        // Find a variable in a constraint for which we know for sure that we can open it.
        // If the constraint has all the variables assigned, the constraint can be thrown away.
    }
}
