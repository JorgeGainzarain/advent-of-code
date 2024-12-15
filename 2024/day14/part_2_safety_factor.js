const cliProgress = require('cli-progress');
const runDay = require('../../functions/dayTemplate');

// Load and parse the data
function loadFunction(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    let robots = lines.map(line => {
        const parts = line.split(' ');
        const position = parts[0].split('=')[1].split(',').map(x => parseInt(x));
        const speed = parts[1].split('=')[1].split(',').map(x => parseInt(x));
        return { x: position[0], y: position[1], vx: speed[0], vy: speed[1] };
    });

    const minX = Math.min(...robots.map(r => r.x));
    const maxX = Math.max(...robots.map(r => r.x));
    const minY = Math.min(...robots.map(r => r.y));
    const maxY = Math.max(...robots.map(r => r.y));

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    return { width, height, robots };
}

// Simulate robot movements over a number of iterations
function simulateSeconds(data, iterations) {
    const { width, height, robots } = data;
    for (let i = 0; i < iterations; i++) {
        robots.forEach(robot => {
            robot.x = (robot.x + robot.vx + width) % width;
            robot.y = (robot.y + robot.vy + height) % height;
        });
    }
}

// Create a grid representation of the robot positions
function getGrid(data) {
    const { width, height, robots } = data;
    let grid = Array.from({ length: height }, () => Array(width).fill('.'));
    robots.forEach(robot => {
        const { x, y } = robot;
        grid[y][x] = '@';
    });
    return grid;
}

// Count robots in each quadrant and calculate a safety factor
function countRobotsInQuadrants(grid) {
    const height = grid.length;
    const width = grid[0].length;
    const midX = Math.floor(width / 2);
    const midY = Math.floor(height / 2);
    const quadrants = [0, 0, 0, 0];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x === midX || y === midY || grid[y][x] === '.') continue;
            if (grid[y][x] === '@') {
                if (x < midX && y < midY) {
                    quadrants[0]++;
                } else if (x >= midX && y < midY) {
                    quadrants[1]++;
                } else if (x < midX && y >= midY) {
                    quadrants[2]++;
                } else if (x >= midX && y >= midY) {
                    quadrants[3]++;
                }
            }
        }
    }

    return quadrants.reduce((acc, count) => acc * count, 1);
}

function processFunction(data) {
    const { width, height } = data;
    const iterations = width * height;
    let lowestSafetyFactor = Infinity;
    let bestIteration = 0;
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(iterations, 0);

    for (let i = 1; i <= iterations; i++) {
        simulateSeconds(data, 1);
        const grid = getGrid(data);
        const safetyFactor = countRobotsInQuadrants(grid);
        if (safetyFactor < lowestSafetyFactor) {
            lowestSafetyFactor = safetyFactor;
            bestIteration = i;
        }
        bar.update(i);
    }
    bar.stop();

    return bestIteration;
}

const correctResults = [];
runDay(14, 2, loadFunction, processFunction, correctResults);