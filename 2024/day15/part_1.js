const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    // Split the input into grid and moves
    const [gridPart, movesPart] = data.replace(/\r\n/g, '\n').split('\n\n');

    // Create the grid map
    const grid = new Map();
    gridPart.split('\n').forEach((line, y) => {
        line.split('').forEach((cell, x) => {
            let type;
            if (cell === '#') type = 'wall';
            else if (cell === 'O') type = 'box';
            else if (cell === '@') type = 'robot';
            else type = 'empty';
            grid.set(`${x},${y}`, { type, x, y });
        });
    });

    // Create the list of moves
    const moves = movesPart.split('');

    return { grid, moves };
}

function processFunction(data) {
    const { grid, moves } = data;
    console.log(grid.size);
    const robot = findRobot(grid);
    for (let move of moves) {
        moveRobot(grid, robot, move);
        //printGrid(grid);
    }
    return calculateGPS(grid);
}

function moveRobot(grid, robot, move) {
    const { x, y } = robot;
    let newX = x;
    let newY = y;
    if (move === '^') newY--;
    else if (move === 'v') newY++;
    else if (move === '<') newX--;
    else if (move === '>') newX++;
    const newCell = grid.get(`${newX},${newY}`);
    if (!newCell) {
        console.log('Robot moved out of bounds');
        return;
    }
    if (newCell.type === 'box') {
        moveBoxes(grid, robot, newX, newY);
    } else if (newCell.type === 'empty') {
        updateGrid(grid, robot, newX, newY);
    }
}

function moveBoxes(grid, robot, newX, newY) {
    const { x, y } = robot;
    let boxX = newX;
    let boxY = newY;
    const boxesToMove = [];
    let canMove = true;
    while (canMove) {
        const nextBoxX = boxX + (newX - x);
        const nextBoxY = boxY + (newY - y);
        const nextBoxCell = grid.get(`${nextBoxX},${nextBoxY}`);
        if (!nextBoxCell || nextBoxCell.type === 'wall') {
            canMove = false;
        } else if (nextBoxCell.type === 'empty') {
            boxesToMove.push({ x: boxX, y: boxY });
            break;
        } else if (nextBoxCell.type === 'box') {
            boxesToMove.push({ x: boxX, y: boxY });
            boxX = nextBoxX;
            boxY = nextBoxY;
        }
    }
    if (canMove) {
        boxesToMove.reverse().forEach(box => {
            const newBoxX = box.x + (newX - x);
            const newBoxY = box.y + (newY - y);
            grid.set(`${box.x},${box.y}`, { type: 'empty', x: box.x, y: box.y });
            grid.set(`${newBoxX},${newBoxY}`, { type: 'box', x: newBoxX, y: newBoxY });
        });
        updateGrid(grid, robot, newX, newY);
    }
}

function updateGrid(grid, robot, newX, newY) {
    const { x, y } = robot;
    grid.set(`${x},${y}`, { type: 'empty', x, y });
    robot.x = newX;
    robot.y = newY;
    grid.set(`${newX},${newY}`, robot);
}

function findRobot(grid) {
    for (let [_key, value] of grid.entries()) {
        if (value.type === 'robot') {
            return value;
        }
    }
    return null; // Return null if the robot is not found
}


function calculateGPS(grid) {
    let gps = 0;
    grid.forEach((value, key) => {
        if (value.type === 'box') {
            const [x, y] = key.split(',').map(Number);
            // GPS is the distance from top edge * 100 + distance from left edge
            gps += y * 100 + x;
        }
    });
    return gps;
}

const correctResults = [2028, 10092];
runDay(15, 1, loadData, processFunction, correctResults);