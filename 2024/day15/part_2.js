const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    const [gridPart, movesPart] = data.replace(/\r\n/g, '\n').split('\n\n');

    const grid = gridPart.split('\n').map(line => line.split(''));
    const moves = movesPart.split('');

    const expandedGrid = [];

    grid.forEach((row) => {
        let newRow = [];
        row.forEach((pos) => {
            if (pos === "#") newRow = newRow.concat(["#", "#"]);
            else if (pos === "O") newRow = newRow.concat(["[", "]"]);
            else if (pos === "@") newRow = newRow.concat(["@", "."]);
            else newRow = newRow.concat([".", "."]);
        });

        expandedGrid.push(newRow);
    });
    return { grid: expandedGrid, moves: moves };
}

function processFunction(input) {
    const {grid, moves} = input;
    moves.forEach((moves) => {
        moveRobot(grid, moves);
    });
    //printGrid(grid);
    return calculateGPS(grid);
}

function moveRobot(grid, moves) {
    changes = [];
    if (moves === "<") {
            moveGeneric(grid, 0, -1);
    } else if (moves === ">") {
            moveGeneric(grid, 0, 1);
    } else if (moves === "^") {
            moveGeneric(grid, -1, 0);
    } else if (moves === "v") {
            moveGeneric(grid, 1, 0);
    }
}

let changes = [];
function moveGeneric(grid, offR, offC) {
    const pos = findRobot(grid);
    if (canMove(grid, pos.r + offR, pos.c + offC, offR, offC)) {
        sortChanges(changes);
        changes.forEach((box) => {
            grid[box.r][box.c] = box.v;
        });

        grid[pos.r][pos.c] = ".";
        grid[pos.r + offR][pos.c + offC] = "@";
    }
}

function sortChanges(changes) {
    changes.sort((a, b) => {
        if (a.v === "." && b.v !== ".") return -1;
        if (a.v !== "." && b.v === ".") return 1;
        return 0;
    });
}

function canMove(grid, r, c, rowOff, colOff) {
    const newPos = grid[r][c];
    if (newPos === "#") return false;

    if (newPos === ".") return true;

    if (rowOff === 0) {
        if (canMove(grid, r + rowOff, c + colOff, rowOff, colOff)) {
            grid[r + rowOff][c + colOff] = newPos;
            return true;
        }
        return false;
    } else if (newPos === "[") {
        if (
            canMove(grid, r + rowOff, c + colOff, rowOff, colOff) &&
            canMove(grid, r + rowOff, c + colOff + 1, rowOff, colOff)
        ) {
            changes = changes.concat([
                { r: r + rowOff, c: c + colOff, v: "[" },
                { r: r + rowOff, c: c + colOff + 1, v: "]" },
                { r: r, c: c, v: "." },
                { r: r, c: c + 1, v: "." },
            ]);
            return true;
        }
        return false;
    } else {
        if (
            canMove(grid, r + rowOff, c + colOff, rowOff, colOff) &&
            canMove(grid, r + rowOff, c + colOff - 1, rowOff, colOff)
        ) {
            changes = changes.concat([
                { r: r + rowOff, c: c + colOff - 1, v: "[" },
                { r: r + rowOff, c: c + colOff, v: "]" },
                { r: r, c: c - 1, v: "." },
                { r: r, c: c, v: "." },
            ]);
            return true;
        }
        return false;
    }
}

function findRobot(grid) {
    const r = grid.findIndex((row) => row.includes("@"));
    const c = grid[r].indexOf("@");
    return { r, c };
}

function calculateGPS(grid) {
    let res = 0;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const curr = grid[r][c];
            if (curr === "[") res += r * 100 + c;
        }
    }

    return res;
}


// 105 + 207 + 306 = 618
const correctResults = [9021, 618];
runDay(15, 2, loadData, processFunction, correctResults);