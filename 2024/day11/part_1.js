const fs = require('fs');
const path = require('path');

function transformStones(stones) {
    //console.log('Transforming stones...');
    const newStones = [];
    for (const stone of stones) {
        if (stone === 0) {
            newStones.push(1);
        } else if (stone.toString().length % 2 === 0) {
            const str = stone.toString();
            const mid = str.length / 2;
            newStones.push(parseInt(str.slice(0, mid), 10));
            newStones.push(parseInt(str.slice(mid), 10));
        } else {
            newStones.push(stone * 2024);
        }
    }
    //console.log('Transformation complete.');
    return newStones;
}

function simulateBlinks(initialStones, blinks) {
    //console.log(`Simulating ${blinks} blinks...`);
    let stones = initialStones;
    for (let i = 0; i < blinks; i++) {
        stones = transformStones(stones);
    }
    //console.log('Simulation complete.');
    return stones.length;
}

// Main execution
try {
    const test_DataPath = path.resolve(__dirname, 'test_data.txt');
    const testInput = fs.readFileSync(test_DataPath, 'utf-8').trim();
    const test_initialStones = testInput.split(' ').map(Number);
    const test_blinks = 25;
    console.time('Test Execution Time');
    const test_result = simulateBlinks(test_initialStones, test_blinks);
    console.timeEnd('Test Execution Time');
    console.log("=====================");
    console.log("🌟 Day 11 - Part 1 🌟");
    console.log("=====================");
    console.log(`Test Number of stones after ${test_blinks} blinks:`, test_result);

    const DataPath = path.resolve(__dirname, 'data.txt');
    const input = fs.readFileSync(DataPath, 'utf-8').trim();
    const initialStones = input.split(' ').map(Number);
    const blinks = 25;
    console.time('Execution Time');
    const result = simulateBlinks(initialStones, blinks);
    console.log(`Number of stones after ${blinks} blinks:`, result);
    console.timeEnd('Execution Time');

} catch (error) {
    console.error('Error processing stones:', error);
}