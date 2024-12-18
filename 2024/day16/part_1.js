const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    const grid = data.trim().split('\n').map(line => line.split(''));
    let start = null;
    let end = null;

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

function bfs(grid, start, end) {
    const directions = [
        { r: 0, c: 1, cost: 1, arrow: '>' },  // East
        { r: 1, c: 0, cost: 1, arrow: 'v' },  // South
        { r: 0, c: -1, cost: 1, arrow: '<' }, // West
        { r: -1, c: 0, cost: 1, arrow: '^' }  // North
    ];
    const startDirection = 0; // East

    const queue = [{ r: start.r, c: start.c, dir: startDirection, cost: 0, turns: 0, path: [] }];
    const visited = new Set();
    visited.add(`${start.r},${start.c},${startDirection}`);

    while (queue.length > 0) {
        const { r, c, dir, cost, turns, path } = queue.shift();

        if (r === end.r && c === end.c) {
            path.forEach(({ r, c, arrow }) => {
                if (grid[r][c] !== 'S' && grid[r][c] !== 'E') {
                    grid[r][c] = arrow;
                }
            });
            console.log(grid.map(row => row.join('')).join('\n'));
            return cost;
        }

        for (let i = 0; i < directions.length; i++) {
            const newDir = (dir + i) % 4;
            const newR = r + directions[newDir].r;
            const newC = c + directions[newDir].c;
            const newCost = cost + directions[newDir].cost + (i > 0 ? 1000 : 0);
            const newTurns = turns + (i > 0 ? 1 : 0);
            const newPath = path.concat({ r: newR, c: newC, arrow: directions[newDir].arrow });

            if (newR >= 0 && newR < grid.length && newC >= 0 && newC < grid[0].length && grid[newR][newC] !== '#' && !visited.has(`${newR},${newC},${newDir}`)) {
                queue.push({ r: newR, c: newC, dir: newDir, cost: newCost, turns: newTurns, path: newPath });
                visited.add(`${newR},${newC},${newDir}`);
            }
        }

        // Sort the queue to prioritize paths with fewer turns
        queue.sort((a, b) => a.turns - b.turns || a.cost - b.cost);
    }

    return -1;
}

function processFunction(data) {
    const { grid, start, end } = data;
    return bfs(grid, start, end);
}

const correctResults = [7036, 11048, 21148];
runDay(16,1, loadData, processFunction, correctResults);