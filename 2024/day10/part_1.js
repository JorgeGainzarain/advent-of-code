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

function calculateTrailheadScore(map, trailhead) {
    const visited = new Set();
    const directions = [
        [0, 1],   // down
        [0, -1],  // up
        [1, 0],   // right
        [-1, 0]   // left
    ];

    function dfs(x, y, currentHeight) {
        if (x < 0 || x >= map[0].length || y < 0 || y >= map.length) return;
        const key = `${x},${y}`;
        if (visited.has(key)) return;
        if (map[y][x] !== currentHeight + 1) return;
        visited.add(key);
        for (const [dx, dy] of directions) {
            dfs(x + dx, y + dy, map[y][x]);
        }
    }

    for (const [dx, dy] of directions) {
        dfs(trailhead.x + dx, trailhead.y + dy, 0);
    }

    return new Set([...visited]
        .filter(key => {
            const [x, y] = key.split(',').map(Number);
            return map[y][x] === 9;
        })
    ).size;
}

function calculateTotalTrailheadScore(map) {
    const trailheads = findTrailheads(map);
    return trailheads.reduce((total, trailhead) => {
        return total + calculateTrailheadScore(map, trailhead);
    }, 0);
}

function processFunction(input) {
    return calculateTotalTrailheadScore(input);
}

const correctResults = [36];
runDay(10, 1, loadFile, processFunction, correctResults);