const fs = require('fs');
const path = require('path');

function parseInput(input) {
    const sections = input.split('\n\n');
    const [rulesSection, updatesSection] = sections;
    const rules = rulesSection.split('\n').map(rule => rule.split('|').map(Number));
    const updates = updatesSection.split('\n').map(update => update.split(',').map(Number));
    return { rules, updates };
}

function isValidUpdate(update, rules) {
    const indexMap = new Map();
    update.forEach((page, index) => indexMap.set(page, index));
    for (const [before, after] of rules) {
        if (indexMap.has(before) && indexMap.has(after) && indexMap.get(before) > indexMap.get(after)) {
            return false;
        }
    }
    return true;
}

function findMiddlePage(update) {
    const middleIndex = Math.floor(update.length / 2);
    return update[middleIndex];
}

function sumMiddlePages(input) {
    const { rules, updates } = parseInput(input);
    let sum = 0;
    for (const update of updates) {
        if (isValidUpdate(update, rules)) {
            sum += findMiddlePage(update);
        }
    }
    return sum;
}

const test_input = fs.readFileSync(path.resolve(__dirname, 'test_data.txt'), 'utf8').trim().replace(/\r/g, '');
const test_result = sumMiddlePages(test_input);

const input = fs.readFileSync(path.resolve(__dirname, 'data.txt'), 'utf8').trim().replace(/\r/g, '');
const result = sumMiddlePages(input);

console.log("=====================");
console.log("🌟 Day 5 Part 2 🌟");
console.log("=====================");
console.log("Test Sum: " + test_result);
console.log("Actual Sum: " + result);