const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.trim().replace(/\r/g, '');
}

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

const correctResults = [143];
runDay(5, 1, loadFile, sumMiddlePages, correctResults);