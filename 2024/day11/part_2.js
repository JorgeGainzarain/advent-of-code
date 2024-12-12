const fs = require('fs');
const path = require('path');

function simulateStonesEfficiently(stones, blinks) {
    const memo = new Map();

    function processStone(stone, remainingBlinks) {
        if (remainingBlinks === 0) return { [stone]: 1 };

        const memoKey = `${stone},${remainingBlinks}`;
        if (memo.has(memoKey)) return memo.get(memoKey);

        let result = {};
        if (stone === 0) {
            result = processStone(1, remainingBlinks - 1);
        } else if (stone.toString().length % 2 === 0) {
            const strStone = stone.toString();
            const mid = Math.floor(strStone.length / 2);
            const left = parseInt(strStone.slice(0, mid), 10);
            const right = parseInt(strStone.slice(mid), 10);
            const leftResult = processStone(left, remainingBlinks - 1);
            const rightResult = processStone(right, remainingBlinks - 1);

            for (const [key, count] of Object.entries(leftResult)) {
                result[key] = (result[key] || 0) + count;
            }
            for (const [key, count] of Object.entries(rightResult)) {
                result[key] = (result[key] || 0) + count;
            }
        } else {
            const transformed = stone * 2024;
            result = processStone(transformed, remainingBlinks - 1);
        }

        memo.set(memoKey, result);
        return result;
    }

    let stoneCounts = stones.reduce((acc, stone) => {
        acc[stone] = (acc[stone] || 0) + 1;
        return acc;
    }, {});

    for (let i = 0; i < blinks; i++) {
        //console.log(`Blink ${i + 1}/${blinks}: Processing ${Object.keys(stoneCounts).length} unique stones...`);
        const nextStoneCounts = {};

        for (const [stone, count] of Object.entries(stoneCounts)) {
            const transformedStones = processStone(parseInt(stone, 10), 1);
            for (const [key, keyCount] of Object.entries(transformedStones)) {
                nextStoneCounts[key] = (nextStoneCounts[key] || 0) + keyCount * count;
            }
        }

        stoneCounts = nextStoneCounts;
        const totalStones = Object.values(stoneCounts).reduce((sum, count) => sum + count, 0);
        //console.log(`Blink ${i + 1} complete. Total stones: ${totalStones}`);
    }

    return Object.values(stoneCounts).reduce((sum, count) => sum + count, 0);
}

// Main execution
try {
    const test_DataPath = path.resolve(__dirname, 'test_data.txt');
    const testInput = fs.readFileSync(test_DataPath, 'utf-8').trim();
    const test_initialStones = testInput.split(' ').map(Number);
    const test_blinks = 75;
    console.time('Test Execution Time');
    const test_result = simulateStonesEfficiently(test_initialStones, test_blinks);
    console.timeEnd('Test Execution Time');
    console.log("=====================");
    console.log("🌟 Day 11 - Part 2 🌟");
    console.log("=====================");
    console.log(`Test Number of stones after ${test_blinks} blinks:`, test_result);

    const DataPath = path.resolve(__dirname, 'data.txt');
    const input = fs.readFileSync(DataPath, 'utf-8').trim();
    const initialStones = input.split(' ').map(Number);
    const blinks = 75;
    console.time('Execution Time');
    const result = simulateStonesEfficiently(initialStones, blinks);
    console.log(`Number of stones after ${blinks} blinks:`, result);
    console.timeEnd('Execution Time');
} catch (error) {
    console.error('Error processing stones:', error);
}