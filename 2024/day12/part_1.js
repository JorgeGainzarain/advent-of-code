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

function calculatePerimeter(region, map) {
    let perimeter = 0;
    for (const [x, y] of region) {
        const directions = [
            [x-1, y],  // up
            [x+1, y],  // down
            [x, y-1],  // left
            [x, y+1]   // right
        ];

        for (const [nx, ny] of directions) {
            if (nx < 0 || nx >= map.length ||
                ny < 0 || ny >= map[0].length ||
                map[nx][ny] !== map[x][y]) {
                perimeter++;
            }
        }
    }
    return perimeter;
}

function processRegions(map) {
    const visited = Array.from({ length: map.length }, () => Array(map[0].length).fill(false));
    let totalPrice = 0;

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
            if (!visited[x][y]) {
                const region = bfs(x, y, map, visited);
                const area = region.length;
                const perimeter = calculatePerimeter(region, map);
                const price = area * perimeter;
                totalPrice += price;
            }
        }
    }

    return totalPrice;
}

const correctResults = [140, 772, 1930];
runDay(12, 1, loadMap, processRegions, correctResults);