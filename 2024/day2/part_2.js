const fs = require('fs');
const path = require('path');

function loadAndSplitFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    return lines.map(line => line.split(' ').map(Number));
}

const lists = loadAndSplitFile(path.join(__dirname, 'data.txt'));
const testLists = loadAndSplitFile(path.join(__dirname, 'test_data.txt'));

function isValidList(list) {
    let increasing = null;
    const seenNumbers = new Set();

    for (let i = 0; i < list.length - 1; i++) {
        if (seenNumbers.has(list[i])) return false;
        seenNumbers.add(list[i]);

        const diff = list[i + 1] - list[i];
        if (Math.abs(diff) > 3) return false;

        if (diff > 0) {
            if (increasing === false) return false;
            increasing = true;
        } else if (diff < 0) {
            if (increasing === true) return false;
            increasing = false;
        }
    }

    return !seenNumbers.has(list[list.length - 1]);

}

function isSafeWithDampener(list) {
    if (isValidList(list)) return true;

    for (let i = 0; i < list.length; i++) {
        const newList = list.slice(0, i).concat(list.slice(i + 1));
        if (isValidList(newList)) return true;
    }

    return false;
}

const validLists = lists.filter(isSafeWithDampener);
const testValidLists = testLists.filter(isSafeWithDampener);

console.log();
console.log("=====================");
console.log("🌟 Day 2 - Part 2 🌟");
console.log("=====================");
console.log("Test Valid Lists Size: " + testValidLists.length);
console.log("Actual Valid Lists Size: " + validLists.length);