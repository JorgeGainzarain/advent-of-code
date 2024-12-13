const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.trim().split(' ').map(Number);
}

function transformStones(stones) {
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
    return newStones;
}

function simulateBlinks(initialStones, blinks) {
    let stones = initialStones;
    for (let i = 0; i < blinks; i++) {
        stones = transformStones(stones);
    }
    return stones.length;
}

function processFunction(input) {
    const initialStones = input;
    const blinks = 25;
    return simulateBlinks(initialStones, blinks);
}

const correctResults = [55312];
runDay(11, 1, loadFile, processFunction, correctResults);