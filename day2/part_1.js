const fs = require('fs');
const path = require('path');

function loadAndSplitFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split('\n');
    return lines.map(line => line.split(' ').map(Number));
}

const inputLists = loadAndSplitFile(path.join(__dirname, 'data.txt'));
const testLists = loadAndSplitFile(path.join(__dirname, 'test_data.txt'));
//console.log(lists);

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

const validLists = inputLists.filter(isValidList)
const testValidLists = testLists.filter(isValidList);

console.log("=====================");
console.log("🌟 Day 2 - Part 1 🌟");
console.log("=====================");
console.log("Test Valid Lists Size: " + testValidLists.length);
console.log("Actual Valid Lists Size: " + validLists.length);