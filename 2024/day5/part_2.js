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

function correctOrder(update, rules) {
    const graph = new Map();
    const inDegree = new Map();
    update.forEach(page => {
        graph.set(page, []);
        inDegree.set(page, 0);
    });

    rules.forEach(([before, after]) => {
        if (graph.has(before) && graph.has(after)) {
            graph.get(before).push(after);
            inDegree.set(after, inDegree.get(after) + 1);
        }
    });

    const queue = [];
    inDegree.forEach((degree, page) => {
        if (degree === 0) {
            queue.push(page);
        }
    });

    const sorted = [];
    while (queue.length > 0) {
        const page = queue.shift();
        sorted.push(page);
        graph.get(page).forEach(neighbor => {
            inDegree.set(neighbor, inDegree.get(neighbor) - 1);
            if (inDegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        });
    }

    return sorted;
}

function findMiddlePage(update) {
    const middleIndex = Math.floor(update.length / 2);
    return update[middleIndex];
}

function sumMiddlePages(input) {
    const { rules, updates } = parseInput(input);
    let sum = 0;
    for (const update of updates) {
        if (!isValidUpdate(update, rules)) {
            const correctedUpdate = correctOrder(update, rules);
            sum += findMiddlePage(correctedUpdate);
        }
    }
    return sum;
}

const correctResults = [123];
runDay(5, 2, loadFile, sumMiddlePages, correctResults);