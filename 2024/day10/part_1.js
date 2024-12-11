const fs = require('fs');
const path = require('path');

function parseMap(data) {
    console.log('Parsing map data...');
    return data.trim().split('\n').map(row => row.replace(/\r/g, '').split('').map(Number));
}

function findTrailheads(map) {
    console.log('Finding trailheads...');
    const trailheads = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 0) {
                trailheads.push({ x, y });
                console.log(`Trailhead found at (${x}, ${y}) -> ${map[y][x]}`);
            }
        }
    }
    console.log('Total trailheads found:', trailheads.length);
    return trailheads;
}

function calculateTrailheadScore(map, trailhead) {
    console.log(`Calculating score for trailhead at (${trailhead.x}, ${trailhead.y})...`);
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

    const score = new Set([...visited]
        .filter(key => {
            const [x, y] = key.split(',').map(Number);
            return map[y][x] === 9;
        })
    ).size;
    console.log(`Score for trailhead at (${trailhead.x}, ${trailhead.y}): ${score}`);
    return score;
}

function calculateTotalTrailheadScore(map) {
    const trailheads = findTrailheads(map);
    const totalScore = trailheads.reduce((total, trailhead) => {
        return total + calculateTrailheadScore(map, trailhead);
    }, 0);
    console.log('Total score of all trailheads:', totalScore);
    return totalScore;
}

// Main execution
try {
    const test_DataPath = path.resolve(__dirname, 'test_data.txt');
    const test_mapInput = fs.readFileSync(test_DataPath, 'utf-8').trim();
    const test_parsedMap = parseMap(test_mapInput);
    const test_totalScore = calculateTotalTrailheadScore(test_parsedMap);

    const DataPath = path.resolve(__dirname, 'data.txt');
    const mapInput = fs.readFileSync(DataPath, 'utf-8').trim();
    const parsedMap = parseMap(mapInput);
    const totalScore = calculateTotalTrailheadScore(parsedMap);

    console.log("=====================");
    console.log("🌟 Day 10 - Part 1 🌟");
    console.log("=====================");
    console.log("Test Total Score:", test_totalScore);
    console.log("Input Total Score:", totalScore);
} catch (error) {
    console.error('Error processing map:', error);
}