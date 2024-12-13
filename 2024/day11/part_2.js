const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.trim().split(' ').map(Number);
}

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
        const nextStoneCounts = {};

        for (const [stone, count] of Object.entries(stoneCounts)) {
            const transformedStones = processStone(parseInt(stone, 10), 1);
            for (const [key, keyCount] of Object.entries(transformedStones)) {
                nextStoneCounts[key] = (nextStoneCounts[key] || 0) + keyCount * count;
            }
        }

        stoneCounts = nextStoneCounts;
    }

    return Object.values(stoneCounts).reduce((sum, count) => sum + count, 0);
}

function processFunction(input) {
    const initialStones = input;
    const blinks = 75;
    return simulateStonesEfficiently(initialStones, blinks);
}

const correctResults = [65601038650482]; // This result for sample code wasn't in the advent of code website but i got it from the advent of code reddit
runDay(11, 2, loadFile, processFunction, correctResults);