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
    console.log("\n");
    const { grid, start, end } = data;
    const normalPath = findShortestPath(grid, start, end);
    const pathPositions = normalPath.path.map(([r, c]) => ({ x: c, y: r }));

    let savedArr = {};

    for (let firstPos = 0; firstPos < pathPositions.length - 1; firstPos++) {
        for (let secondPos = firstPos + 1; secondPos < pathPositions.length; secondPos++) {
            const savedBySkipping = secondPos - firstPos;

            let xDiff = Math.abs(pathPositions[firstPos].x - pathPositions[secondPos].x);
            let yDiff = Math.abs(pathPositions[firstPos].y - pathPositions[secondPos].y);

            if (xDiff + yDiff <= 20) {
                const saved = savedBySkipping - (xDiff + yDiff);

                if (saved > 0) {
                    savedArr[saved] = savedArr[saved] ? savedArr[saved] + 1 : 1;
                }
            }
        }
    }

    // Log the shortcuts by steps saved over 50 steps
    Object.entries(savedArr)
        .filter(([savedSteps, _count]) => parseInt(savedSteps) >= 50)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .forEach(([savedSteps, count]) => {
            console.log(`There are ${count} cheats that save ${savedSteps} picoseconds.`);
        });

    // Count and return the number of shortcuts that save more than 100 steps
    return Object.entries(savedArr)
        .filter(([savedSteps, _count]) => parseInt(savedSteps) >= 100)
        .reduce((acc, [_savedSteps, count]) => acc + count, 0);
}

const correctResults = [];
runDay(20, 2, loadData, processFunction, correctResults);