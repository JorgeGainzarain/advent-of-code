const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    const grid = data.trim().split('\n').map(line => line.split(''));
    let start = null;
    let end = null;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === 'S') {
                start = { r, c };
                grid[r][c] = '.';
            } else if (grid[r][c] === 'E') {
                end = { r, c };
                grid[r][c] = '.';
            }
        }
    }

    return { grid, start, end };
}

function findShortestPath(grid, start, end) {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const queue = [[start.r, start.c, 0, [[start.r, start.c]]]];
    const visited = new Set([`${start.r},${start.c}`]);

    while (queue.length > 0) {
        const [r, c, steps, path] = queue.shift();

        if (r === end.r && c === end.c) {
            return { steps, path };
        }

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            const key = `${nr},${nc}`;

            if (nr >= 0 && nr < grid.length &&
                nc >= 0 && nc < grid[0].length &&
                grid[nr][nc] !== '#' &&
                !visited.has(key)) {
                queue.push([nr, nc, steps + 1, [...path, [nr, nc]]]);
                visited.add(key);
            }
        }
    }
    return null;
}

function processFunction(data) {
    const { grid, start, end } = data;
    const directions = [[0, 2], [2, 0], [0, -2], [-2, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];

    // Find normal shortest path first
    const normalPath = findShortestPath(grid, start, end);
    const normalSteps = normalPath.steps;
    console.log(`Normal path takes ${normalSteps} steps`);

    const shortcuts = [];

    for (let i = 0; i < normalPath.path.length - 1; i++) {
        const [x, y] = normalPath.path[i];
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            const pathIndex = normalPath.path.findIndex(([r, c]) => r === nx && c === ny);
            if (pathIndex !== -1 && pathIndex > i + 1) {
                const savedSteps = pathIndex - i - 2; // The steps saved by the shortcut
                if (savedSteps > 0) {
                    shortcuts.push({ start: [x, y], end: [nx, ny], savedSteps });
                }
            }
        }
    }

    // Group shortcuts by saved steps
    const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
        if (!acc[shortcut.savedSteps]) {
            acc[shortcut.savedSteps] = 0;
        }
        acc[shortcut.savedSteps]++;
        return acc;
    }, {});

    // Display grouped shortcuts
    console.log('\nGrouped shortcuts by saved steps:');
    for (const [savedSteps, count] of Object.entries(groupedShortcuts)) {
        console.log(`There are ${count} shortcuts that save ${savedSteps} steps`);
    }
    // Count and return the number of shortcuts that save more than 100 steps
    return Object.entries(groupedShortcuts)
        .filter(([savedSteps, _count]) => parseInt(savedSteps) >= 100)
        .reduce((acc, [_savedSteps, count]) => acc + count, 0);
}

const correctResults = [0];
runDay(20, 1, loadData, processFunction, correctResults);