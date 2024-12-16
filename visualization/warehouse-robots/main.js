const blessed = require('blessed');
const fs = require('fs');

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

function moveRobot(grid, move) {
    changes = [];
    if (move === "<") {
        moveGeneric(grid, 0, -1, '<');
    } else if (move === ">") {
        moveGeneric(grid, 0, 1, '>');
    } else if (move === "^") {
        moveGeneric(grid, -1, 0, '^');
    } else if (move === "v") {
        moveGeneric(grid, 1, 0, 'v');
    }
}

let changes = [];
function moveGeneric(grid, offR, offC, direction) {
    const pos = findRobot(grid);
    if (canMove(grid, pos.r + offR, pos.c + offC, offR, offC)) {
        sortChanges(changes);
        changes.forEach((box) => {
            grid[box.r][box.c] = box.v;
        });

        grid[pos.r][pos.c] = ".";
        grid[pos.r + offR][pos.c + offC] = direction;
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
    const r = grid.findIndex((row) => row.includes("@") || row.includes("<") || row.includes(">") || row.includes("^") || row.includes("v"));
    const c = grid[r].indexOf("@") !== -1 ? grid[r].indexOf("@") : grid[r].indexOf("<") !== -1 ? grid[r].indexOf("<") : grid[r].indexOf(">") !== -1 ? grid[r].indexOf(">") : grid[r].indexOf("^") !== -1 ? grid[r].indexOf("^") : grid[r].indexOf("v");
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


const screen = blessed.screen({
    smartCSR: true,
    title: 'Warehouse Robots Simulation'
});

const fileList = blessed.list({
    parent: screen,
    width: '50%',
    height: '50%',
    top: 'center',
    left: 'center',
    label: 'Select a file',
    border: 'line',
    keys: true,
    vi: true,
    style: {
        selected: {
            bg: 'blue'
        }
    }
});

const files = fs.readdirSync('.').filter(file => file.endsWith('.txt')).map(file => file.replace('.txt', ''));
fileList.setItems(files);

fileList.on('select', (item) => {
    const fileName = item.getText() + '.txt';
    const data = fs.readFileSync(fileName, 'utf8');
    const input = loadData(data);

    const gridBox = blessed.box({
        parent: screen,
        top: 0,
        left: 'center',
        width: 'shrink',
        height: 'shrink',
        tags: true,
        border: 'line'
    });

    drawGrid(gridBox, input.grid);

    const speedBox = blessed.textbox({
        parent: screen,
        bottom: 0,
        left: 'center',
        width: '50%',
        height: 3,
        label: 'Enter simulation speed (ms)',
        border: 'line',
        inputOnFocus: true
    });

    speedBox.on('submit', (speed) => {
        speed = parseInt(speed, 10);
        speedBox.destroy();
        simulate(gridBox, input.grid, input.moves, speed);
    });

    console.clear();

    speedBox.focus();
    screen.render();
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

fileList.focus();
screen.render();

function drawGrid(gridBox, grid) {
    let content = '';
    grid.forEach(row => {
        content += row.join('') + '\n';
    });
    gridBox.setContent(content);
    screen.render();
}

function simulate(gridBox, grid, moves, speed) {
    let moveIndex = 0;

    function step() {
        if (moveIndex < moves.length) {
            moveRobot(grid, moves[moveIndex]);
            drawGrid(gridBox, grid);
            moveIndex++;
            setTimeout(step, speed);
        } else {
            const gps = calculateGPS(grid);
            const resultBox = blessed.box({
                parent: screen,
                top: 'center',
                left: 'center',
                width: '50%',
                height: 5,
                label: 'Simulation Complete',
                border: 'line',
                content: `Final GPS: ${gps}\nPress any key to exit`
            });

            resultBox.focus();
            screen.render();
            screen.onceKey([], () => process.exit(0));
        }
    }

    step();
}