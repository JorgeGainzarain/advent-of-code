const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.trim().split('\n').map(row => row.replace(/\r/g, '').split('').map(Number));
}

function findTrailheads(map) {
    const trailheads = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 0) {
                trailheads.push({ x, y });
            }
        }
    }
    return trailheads;
}

function calculateTrailheadRating(map, trailhead) {
    const directions = [
        [0, 1],   // down
        [0, -1],  // up
        [1, 0],   // right
        [-1, 0]   // left
    ];

    function dfs(x, y, currentHeight, visited) {
        if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return 0;
        if (visited.has(`${x},${y}`)) return 0;
        if (map[y][x] !== currentHeight + 1) return 0;
        if (map[y][x] === 9) return 1;

        visited.add(`${x},${y}`);
        let count = 0;
        for (const [dx, dy] of directions) {
            count += dfs(x + dx, y + dy, map[y][x], visited);
        }
        visited.delete(`${x},${y}`);
        return count;
    }

    let rating = 0;
    for (const [dx, dy] of directions) {
        const visited = new Set();
        rating += dfs(trailhead.x + dx, trailhead.y + dy, 0, visited);
    }
    return rating;
}

function calculateTotalTrailheadRating(map) {
    const trailheads = findTrailheads(map);
    return trailheads.reduce((total, trailhead) => {
        return total + calculateTrailheadRating(map, trailhead);
    }, 0);
}

function processFunction(input) {
    return calculateTotalTrailheadRating(input);
}

const correctResults = [81];
runDay(10, 2, loadFile, processFunction, correctResults);