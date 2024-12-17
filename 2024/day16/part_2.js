const runDay = require('../../functions/dayTemplate');

// Bitwise operations for efficient encoding/decoding of positions
const DIR = [
    [1, 0],   // South
    [0, 1],   // East
    [-1, 0],  // North
    [0, -1]   // West
].map(([dy, dx]) => (dy << 16) | (dx << 2));


function loadData(data) {
    const grid = data.trim().split('\n').map(line => line.split(''));
    let start = null;
    let end = null;

    // Identify the start ('S') and end ('E') positions in the grid
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === 'S') {
                start = { r, c };
            } else if (grid[r][c] === 'E') {
                end = { r, c };
            }
        }
    }

    return { grid, start, end };
}


function shortestPath({ grid, start, _end }) {
    const visited = new Map(); // Map to track visited positions and their costs
    const queue = [[0, [(start.r << 16) | (start.c << 2) | 1]]]; // Priority queue initialized with the start position
    const tiles = [];
    let min = Infinity;

    while (queue.length) {
        const [cost, path] = queue.shift();
        const pos = path.at(-1);


        if (grid[pos >> 16][(pos & 0xffff) >> 2] === 'E' && min >= cost) {
            min = cost;
            tiles.push(...path.map(p => p >> 2));
        }

        // Explore possible directions with heading changes
        [-1, 0, 1].map(dh => [
            (4 + dh + (pos & 3)) % 4,  // New direction
            1 + 1000 * Math.abs(dh)    // Cost of direction change
        ]).map(([h, dc]) => [
            (pos & ~0x03) + DIR[h] + h,
            cost + dc
        ]).filter(([p, c]) =>
            grid[p >> 16][(p & 0xffff) >> 2] !== '#' &&
            !(visited.get(p) < c) &&
            visited.set(p, c)
        ).forEach(([p, c]) =>
            queue.push([c, [...path, p]])
        );

        // Sort the queue to prioritize paths with lower costs
        queue.sort((a, b) => a[0] - b[0]);
    }

    return new Set(tiles).size;
}


function processFunction(data) {
    return shortestPath(data);
}

const correctResults = [45, 64];
runDay(16, 2, loadData, processFunction, correctResults);