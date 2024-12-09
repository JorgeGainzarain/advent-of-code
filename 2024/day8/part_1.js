const fs = require('fs');

function findAntinodesFromFile(filePath) {
    const input = fs.readFileSync(filePath, 'utf-8');
    return findAntinodes(input);
}

function findAntinodes(input) {
    const grid = input.replaceAll("\r", "").split('\n');
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

                console.log(`Antinodes for ${freq}, [(${a1.x},${a1.y}), (${a2.x},${a2.y})] -> [(${a1.x - dx},${a1.y - dy}), (${a2.x + dx},${a2.y + dy})]`);
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

function printGridWithAntinodes(grid, allAntinodes) {
    for (let i = 0; i < grid.length; i++) {
        let row = grid[i].split('');
        for (let j = 0; j < row.length; j++) {
            if (allAntinodes.has(`${i},${j}`)) {
                row[j] = '#';
            }
        }
        console.log(row.join(''));
    }

    console.log(`Number of unique antinode positions: ${allAntinodes.size}`);
}

const test_result = findAntinodesFromFile('test_data.txt');
const result = findAntinodesFromFile('data.txt');

console.log("=====================");
console.log("🌟 Day 8 - Part 1 🌟");
console.log("=====================");
console.log("Sum of Valid Test Values:", test_result.allAntinodes.size);
console.log("Sum of Valid Input Values:", result.allAntinodes.size);
/*
console.log("=====================");
console.log("Visual Test Grid:");
printGridWithAntinodes(test_result.grid, test_result.allAntinodes);
console.log("=====================");
console.log("Visual Input Grid:");
printGridWithAntinodes(result.grid, result.allAntinodes);

*/