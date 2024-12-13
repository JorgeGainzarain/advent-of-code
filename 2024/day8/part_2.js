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

                allAntinodes.add(`${a1.x},${a1.y}`);
                allAntinodes.add(`${a2.x},${a2.y}`);

                let x = a1.x - dx;
                let y = a1.y - dy;
                while (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
                    allAntinodes.add(`${x},${y}`);
                    x -= dx;
                    y -= dy;
                }

                x = a2.x + dx;
                y = a2.y + dy;
                while (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
                    allAntinodes.add(`${x},${y}`);
                    x += dx;
                    y += dy;
                }
            }
        }
    }

    return { grid, allAntinodes };
}

function processFunction(input) {
    const { allAntinodes } = findAntinodes(input);
    return allAntinodes.size;
}

const correctResults = [34];
runDay(8, 2, loadFile, processFunction, correctResults);