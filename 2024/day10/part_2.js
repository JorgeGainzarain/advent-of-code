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

function calculateTrailheadRating(map, trailhead) {
    console.log(`Calculating rating for trailhead at (${trailhead.x}, ${trailhead.y})...`);
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
    console.log(`Rating for trailhead at (${trailhead.x}, ${trailhead.y}): ${rating}`);
    return rating;
}

function calculateTotalTrailheadRating(map) {
    const trailheads = findTrailheads(map);
    const totalRating = trailheads.reduce((total, trailhead) => {
        return total + calculateTrailheadRating(map, trailhead);
    }, 0);
    console.log('Total rating of all trailheads:', totalRating);
    return totalRating;
}

// Main execution
try {
    const test_DataPath = path.resolve(__dirname, 'test_data.txt');
    const test_mapInput = fs.readFileSync(test_DataPath, 'utf-8').trim();
    const test_parsedMap = parseMap(test_mapInput);
    const test_totalRating = calculateTotalTrailheadRating(test_parsedMap);

    const DataPath = path.resolve(__dirname, 'data.txt');
    const mapInput = fs.readFileSync(DataPath, 'utf-8').trim();
    const parsedMap = parseMap(mapInput);
    const totalRating = calculateTotalTrailheadRating(parsedMap);

    console.log("=====================");
    console.log("🌟 Day 10 - Part 2 🌟");
    console.log("=====================");
    console.log("Test Total Rating:", test_totalRating);
    console.log("Input Total Rating:", totalRating);
} catch (error) {
    console.error('Error processing map:', error);
}