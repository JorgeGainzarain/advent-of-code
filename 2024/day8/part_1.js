const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.trim().replace(/\r/g, '');
}

function findAntinodes(input) {
    const grid = input.split('\n');
    const antennasByFrequency = {};

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] !== '.') {
                const freq = grid[i][j];
                if (!antennasByFrequency[freq]) {
                    antennasByFrequency[freq] = [];
                }
                antennasByFrequency[freq].push({ x: i, y: j });
            }
        }
    }

    const allAntinodes = new Set();

    for (const freq in antennasByFrequency) {
        const antennas = antennasByFrequency[freq];

        for (let i = 0; i < antennas.length; i++) {
            for (let j = i + 1; j < antennas.length; j++) {
                const a1 = antennas[i];
                const a2 = antennas[j];

                const dx = a2.x - a1.x;
                const dy = a2.y - a1.y;

                markAntinode(a1.x - dx, a1.y - dy, allAntinodes, grid);
                markAntinode(a2.x + dx, a2.y + dy, allAntinodes, grid);
            }
        }
    }

    return { grid, allAntinodes };
}

function markAntinode(x, y, antinodeSet, grid) {
    if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
        antinodeSet.add(`${x},${y}`);
    }
}

function processFunction(input) {
    const { allAntinodes } = findAntinodes(input);
    return allAntinodes.size;
}

const correctResults = [14];
runDay(8, 1, loadFile, processFunction, correctResults);