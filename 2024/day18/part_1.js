const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    const positions = data.trim().split('\n').map(line => {
        const [x, y] = line.split(',').map(Number);
        return { x, y };
    });

    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    return { positions, minX, minY, width, height };
}

function updatePositions(positions, nanoseconds) {
    return positions.slice(0, nanoseconds);
}

function createGrid(data, nanoseconds) {
    const { positions, minX, minY, width, height } = data;
    const updatedPositions = updatePositions(positions, nanoseconds);

    const grid = Array.from({ length: height }, () => Array(width).fill('.'));

    updatedPositions.forEach(({ x, y }) => {
        if (y - minY >= 0 && y - minY < height) {
            grid[y - minY][x - minX] = '#';
        }
    });

    return grid;
}

function bfs(grid) {
    const directions = [
        { x: 1, y: 0 },  // Right
        { x: 0, y: 1 },  // Down
        { x: -1, y: 0 }, // Left
        { x: 0, y: -1 }  // Up
    ];
    const queue = [{ x: 0, y: 0, steps: 0, path: [] }];
    const visited = new Set();
    visited.add('0,0');

    while (queue.length > 0) {
        const { x, y, steps, path } = queue.shift();

        if (x === grid[0].length - 1 && y === grid.length - 1) {
            return { steps, path: [...path, { x, y }] };
        }

        for (const { x: dx, y: dy } of directions) {
            const newX = x + dx;
            const newY = y + dy;

            if (newX >= 0 && newX < grid[0].length && newY >= 0 && newY < grid.length && grid[newY][newX] !== '#' && !visited.has(`${newX},${newY}`)) {
                queue.push({ x: newX, y: newY, steps: steps + 1, path: [...path, { x, y }] });
                visited.add(`${newX},${newY}`);
            }
        }
    }

    return { steps: -1, path: [] }; // Return -1 if no path is found
}

function processFunction(data) {
    const { width, height } = data;
    const nanoseconds = (width < 12 && height < 12) ? 12 : 1024;
    const grid = createGrid(data, nanoseconds);
    const { steps, path } = bfs(grid);

    path.forEach(({ x, y }) => {
        grid[y][x] = 'O';
    });

    console.log(grid.map(row => row.join('')).join('\n'));
    return steps;
}

const correctResults = [22];
runDay(18, 1, loadData, processFunction, correctResults);