const blessed = require('blessed');
const fs = require('fs');
const path = require('path');

function loadMap(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').replace(/\r/g, '').trim();
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

function processRegions(map) {
    const visited = Array.from({ length: map.length }, () => Array(map[0].length).fill(false));
    const regions = [];

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
            if (!visited[x][y]) {
                const region = bfs(x, y, map, visited);
                regions.push(region);
            }
        }
    }

    return regions;
}

function visualizeGarden(map, regions, fileName) {
    const screen = blessed.screen({
        smartCSR: true,
        title: 'Garden Zones Visualization'
    });

    const boxWidth = map[0].length + 2;
    const boxHeight = map.length + 2;

    const headerBox = blessed.box({
        top: 0,
        left: 'center',
        width: '30%',
        height: 3,
        content: `{center}Showing grid: ${fileName} - Press 'Backspace' to go back{/center}`,
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
        }
    });

    const gridBox = blessed.box({
        top: 3,
        left: 'center',
        width: boxWidth,
        height: boxHeight,
        content: '',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'default'
        }
    });

    const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
    const regionColors = new Map();
    const usedColors = new Set();

    for (let i = 0; i < regions.length; i++) {
        const region = regions[i];
        const neighborColors = new Set();

        for (const [x, y] of region) {
            for (const [nx, ny] of getNeighbors(x, y, map)) {
                const neighborRegionIndex = regions.findIndex(region => region.some(([rx, ry]) => rx === nx && ry === ny));
                if (neighborRegionIndex !== -1 && regionColors.has(neighborRegionIndex)) {
                    neighborColors.add(regionColors.get(neighborRegionIndex));
                }
            }
        }

        const availableColors = colors.filter(color => !neighborColors.has(color) && !usedColors.has(color));
        const color = availableColors.length > 0 ? availableColors[0] : colors.find(color => !neighborColors.has(color)) || colors[0];
        regionColors.set(i, color);
        usedColors.add(color);
    }

    let content = '';

    for (let x = 0; x < map.length; x++) {
        for (let y = 0; y < map[0].length; y++) {
            const regionIndex = regions.findIndex(region => region.some(([rx, ry]) => rx === x && ry === y));
            const color = regionColors.get(regionIndex);
            const char = map[x][y];
            content += `{${color}-fg}${char}{/${color}-fg}`;
        }
        content += '\n';
    }

    gridBox.setContent(content);
    screen.append(headerBox);
    screen.append(gridBox);
    screen.render();

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
    screen.key(['backspace'], () => {
        screen.destroy();
        showMenu();
    });
}

function showMenu() {
    const screen = blessed.screen({
        smartCSR: true,
        title: 'Select a Grid File'
    });

    const files = fs.readdirSync(__dirname).filter(file => path.extname(file) === '.txt');
    const listHeight = Math.min(files.length + 2, 20); // Set a maximum height to avoid too large lists


    const list = blessed.list({
        top: 'center',
        left: 'center',
        width: '50%',
        height: listHeight,
        items: files.map(file => file.replace('.txt', '')),
        keys: true,
        border: {
            type: 'line'
        },
        style: {
            selected: {
                bg: 'blue'
            }
        }
    });

    list.on('select', (item, index) => {
        const filePath = path.join(__dirname, files[index]);
        const map = loadMap(filePath);
        const regions = processRegions(map);
        screen.destroy();
        visualizeGarden(map, regions, files[index]);
    });

    screen.append(list);
    list.focus();
    screen.render();

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
}

showMenu();