const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

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

function simulateGuard(map, guardPosition, guardDirection, maxSteps = 10000) {
    const visited = new Set();
    visited.add(`${guardPosition.x},${guardPosition.y}`);
    let steps = 0;

    while (steps < maxSteps) {
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
        steps++;
    }

    return { visited, steps };
}

function findLoopPositions(map, guardPosition, guardDirection) {
    simulateGuard(map, guardPosition, guardDirection);
    let loopCount = 0;
    const totalPositions = map.length * map[0].length;
    const progressBar = new cliProgress.SingleBar({
        format: 'Progress |{bar}| {percentage}% | {value}/{total}'
    }, cliProgress.Presets.shades_classic);
    progressBar.start(totalPositions, 0);

    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === '.') {
                const testMap = map.map(row => row.slice());
                testMap[y][x] = '#';

                const newPatrol = simulateGuard(testMap, guardPosition, guardDirection);
                if (newPatrol.steps >= 10000) {
                    loopCount++;
                }
            }
            progressBar.increment();
        }
    }

    progressBar.stop();
    return loopCount;
}

console.log();
console.log("=====================");
console.log("🌟 Day 6 - Part 2 🌟");
console.log("=====================");

console.log("Processing test data...");
const test_input = fs.readFileSync(path.resolve(__dirname, 'test_data.txt'), 'utf8').trim();
const { map: test_map, guardPosition: test_guardPosition, guardDirection: test_guardDirection } = parseInput(test_input);
const test_result = findLoopPositions(test_map, test_guardPosition, test_guardDirection);

console.time('Execution Time');
console.log("Processing input data...");
const input = fs.readFileSync(path.resolve(__dirname, 'data.txt'), 'utf8').trim();
const { map, guardPosition, guardDirection } = parseInput(input);
const result = findLoopPositions(map, guardPosition, guardDirection);
console.timeEnd('Execution Time');



console.log("Test Result:", test_result);
console.log("Actual Input Result:", result);