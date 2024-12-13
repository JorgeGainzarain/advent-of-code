const runDay = require('../../functions/dayTemplate');

function loadMap(data) {
    data = data.replace(/\r/g, '').trim();
    return data.split('\n').map(line => line.split(''));
}

function getNeighbors(x, y, map) {
    const neighbors = [];
    if (x > 0) neighbors.push([x - 1, y]);
    if (x < map.length - 1) neighbors.push([x + 1, y]);
    if (y > 0) neighbors.push([x, y - 1]);
    if (y < map[0].length - 1) neighbors.push([x, y + 1]);
    return neighbors;
}

function bfs(x, y, map, visited) {
    const queue = [[x, y]];
    const region = [];
    const plantType = map[x][y];
    visited[x][y] = true;

    while (queue.length > 0) {
        const [cx, cy] = queue.shift();
        region.push([cx, cy]);

        for (const [nx, ny] of getNeighbors(cx, cy, map)) {
            if (!visited[nx][ny] && map[nx][ny] === plantType) {
                visited[nx][ny] = true;
                queue.push([nx, ny]);
            }
        }
    }

    return region;
}

function countCorners(region, map) {
    let corners = 0;
    for (const [x, y] of region) {
        // Top-left vertex
        if ((x === 0 || map[x - 1][y] !== map[x][y]) && (y === 0 || map[x][y - 1] !== map[x][y])) {
            corners++;
        } else if (x > 0 && y > 0 && map[x - 1][y] === map[x][y] && map[x][y - 1] === map[x][y] && map[x - 1][y - 1] !== map[x][y]) {
            corners++;
        }

        // Top-right vertex
        if ((x === 0 || map[x - 1][y] !== map[x][y]) && (y === map[0].length - 1 || map[x][y + 1] !== map[x][y])) {
            corners++;
        } else if (x > 0 && y < map[0].length - 1 && map[x - 1][y] === map[x][y] && map[x][y + 1] === map[x][y] && map[x - 1][y + 1] !== map[x][y]) {
            corners++;
        }

        // Bottom-right vertex
        if ((x === map.length - 1 || map[x + 1][y] !== map[x][y]) && (y === map[0].length - 1 || map[x][y + 1] !== map[x][y])) {
            corners++;
        } else if (x < map.length - 1 && y < map[0].length - 1 && map[x + 1][y] === map[x][y] && map[x][y + 1] === map[x][y] && map[x + 1][y + 1] !== map[x][y]) {
            corners++;
        }

        // Bottom-left vertex
        if ((x === map.length - 1 || map[x + 1][y] !== map[x][y]) && (y === 0 || map[x][y - 1] !== map[x][y])) {
            corners++;
        } else if (x < map.length - 1 && y > 0 && map[x + 1][y] === map[x][y] && map[x][y - 1] === map[x][y] && map[x + 1][y - 1] !== map[x][y]) {
            corners++;
        }
    }
    return corners;
}

function processRegions(map) {
    const visited = Array.from({ length: map.length }, () => Array(map[0].length).fill(false));
    let totalPrice = 0;

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
            if (!visited[x][y]) {
                const region = bfs(x, y, map, visited);
                const area = region.length;
                const corners = countCorners(region, map);
                const price = area * corners;
                totalPrice += price;
            }
        }
    }

    return totalPrice;
}

const correctResults = [80, 436, 1206, 236, 368  ];
// First 3 results are the ones from part 1 data.
// 236 is from the E shape.
// 368 is from the A and B grid.
// All the test results can be found on the advent of code website.

runDay(12, 2, loadMap, processRegions, correctResults);