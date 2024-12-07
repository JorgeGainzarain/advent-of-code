const fs = require('fs');
const path = require('path');

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

const test_input = fs.readFileSync(path.resolve(__dirname, 'test_data.txt'), 'utf8').trim();
const { map: test_map, guardPosition: test_guardPosition, guardDirection: test_guardDirection } = parseInput(test_input);
const test_result = simulateGuard(test_map, test_guardPosition, test_guardDirection);

const input = fs.readFileSync(path.resolve(__dirname, 'data.txt'), 'utf8').trim();
const { map, guardPosition, guardDirection } = parseInput(input);
const result = simulateGuard(map, guardPosition, guardDirection);


console.log("=====================");
console.log("🌟 Day 6 - Part 1 🌟");
console.log("=====================");
console.log("Test Input Result:", test_result);
console.log("Actual Input Result:", result);