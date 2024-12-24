const runDay = require('../../functions/dayTemplate');

const cache = new Map();

function loadData(data) {
    return data.trim().split(/\r?\n/).map(line => line.trim());
}

const directionPad = [
    ['.', '^', 'A'],
    ['<', 'v', '>']
];

const codePad = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['.', '0', 'A']
];

function decodePad(pad) {
    const padMap = {};
    for (let x = 0; x < pad.length; x++) {
        for (let y = 0; y < pad[x].length; y++) {
            padMap[pad[x][y]] = [y, x];
        }
    }
    return padMap;
}

function bfs(startX, startY, destX, destY, remainingRobots, invalidPosition) {
    const key = `${startX},${startY},${destX},${destY},${remainingRobots}`;
    if (cache.has(key)) return cache.get(key);

    let shortestPath = null;
    let queue = [[startX, startY, ""]];

    while (queue.length > 0) {
        const [currentX, currentY, path] = queue.shift();
        if (currentX === destX && currentY === destY) {
            const result = bestRobot(path + "A", remainingRobots - 1);
            if (shortestPath === null || result < shortestPath) {
                shortestPath = result;
            }
        } else if (currentX !== invalidPosition[0] || currentY !== invalidPosition[1]) {
            for (const [offsetX, offsetY, direction] of [[-1, 0, "<"], [1, 0, ">"], [0, -1, "^"], [0, 1, "v"]]) {
                if ((offsetX < 0 && destX < currentX) || (offsetX > 0 && destX > currentX) || (offsetY < 0 && destY < currentY) || (offsetY > 0 && destY > currentY)) {
                    queue.push([currentX + offsetX, currentY + offsetY, path + direction]);
                }
            }
        }
    }

    cache.set(key, shortestPath);
    return shortestPath;
}

function bestRobot(path, remainingRobots) {
    if (remainingRobots === 1) {
        return path.length;
    }

    let totalSteps = 0;
    const pad = decodePad(directionPad);
    let [currentX, currentY] = pad["A"];

    for (const step of path) {
        const [destX, destY] = pad[step];
        totalSteps += bfs(currentX, currentY, destX, destY, remainingRobots, pad["."]);
        [currentX, currentY] = [destX, destY];
    }

    return totalSteps;
}

function cheapestPath(startX, startY, destX, destY, remainingRobots, invalidPosition) {
    let shortestPath = null;
    let queue = [[startX, startY, ""]];

    while (queue.length > 0) {
        const [currentX, currentY, path] = queue.shift();
        if (currentX === destX && currentY === destY) {
            const result = bestRobot(path + "A", remainingRobots);
            if (shortestPath === null || result < shortestPath) {
                shortestPath = result;
            }
        } else if (currentX !== invalidPosition[0] || currentY !== invalidPosition[1]) {
            for (const [offsetX, offsetY, direction] of [[-1, 0, "<"], [1, 0, ">"], [0, -1, "^"], [0, 1, "v"]]) {
                if ((offsetX < 0 && destX < currentX) || (offsetX > 0 && destX > currentX) || (offsetY < 0 && destY < currentY) || (offsetY > 0 && destY > currentY)) {
                    queue.push([currentX + offsetX, currentY + offsetY, path + direction]);
                }
            }
        }
    }

    return shortestPath;
}

function processFunction(data) {
    const values = data;
    let totalResult = 0;
    const pad = decodePad(codePad);
    for (const x of values) {
        let xResult = 0;
        let [currentX, currentY] = pad["A"];
        for (const val of x) {
            const [destX, destY] = pad[val];
            xResult += cheapestPath(currentX, currentY, destX, destY, 26, pad["."]);
            [currentX, currentY] = [destX, destY];
        }
        totalResult += xResult * parseInt(x.slice(0, -1).replace(/^0+/, ''), 10);
    }
    return totalResult;
}

const correctResults = [154115708116294]; // Didn't have it, added it after running
runDay(21, 2, loadData, processFunction, correctResults);