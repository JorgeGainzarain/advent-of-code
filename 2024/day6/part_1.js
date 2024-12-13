const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.trim();
}

function parseInput(input) {
    const lines = input.split('\n').map(line => line.trim());
    let guardPosition = null;
    let guardDirection = null;
    const map = lines.map((line, y) => {
        return line.split('').map((char, x) => {
            if (char === '^' || char === '>' || char === 'v' || char === '<') {
                guardPosition = { x, y };
                guardDirection = char;
                return '.';
            }
            return char;
        });
    });
    return { map, guardPosition, guardDirection };
}

function turnRight(direction) {
    const directions = ['^', '>', 'v', '<'];
    const index = directions.indexOf(direction);
    return directions[(index + 1) % 4];
}

function moveForward(position, direction) {
    const moves = {
        '^': { x: 0, y: -1 },
        '>': { x: 1, y: 0 },
        'v': { x: 0, y: 1 },
        '<': { x: -1, y: 0 }
    };
    return {
        x: position.x + moves[direction].x,
        y: position.y + moves[direction].y
    };
}

function isWithinBounds(position, map) {
    return position.y >= 0 && position.y < map.length && position.x >= 0 && position.x < map[0].length;
}

function simulateGuard(map, guardPosition, guardDirection) {
    const visited = new Set();
    visited.add(`${guardPosition.x},${guardPosition.y}`);

    while (true) {
        const nextPosition = moveForward(guardPosition, guardDirection);
        if (!isWithinBounds(nextPosition, map)) {
            break;
        }
        if (map[nextPosition.y][nextPosition.x] === '#') {
            guardDirection = turnRight(guardDirection);
        } else {
            guardPosition = nextPosition;
            visited.add(`${guardPosition.x},${guardPosition.y}`);
        }
    }

    return visited.size;
}

function processData(data) {
    const { map, guardPosition, guardDirection } = parseInput(data);
    return simulateGuard(map, guardPosition, guardDirection);
}

const correctResults = [41];
runDay(6, 1, loadFile, processData, correctResults);