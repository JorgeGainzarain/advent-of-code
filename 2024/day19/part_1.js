const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    data = data.replaceAll("\r", "").trim();
    const lines = data.split("\n");
    // First line are the towels
    const towels = lines[0].split(", ");
    // The rest are the patterns
    const patterns = lines.slice(2);
    return { patterns, towels };
}

function process(pattern, towels, memo) {
    if (pattern.length === 0) return true;

    if (memo.has(pattern)) return memo.get(pattern);

    const matchedTowels = towels.filter(towel => pattern.startsWith(towel));
    if (matchedTowels.length === 0) {
        memo.set(pattern, false);
        return false;
    }

    const anyPossible = matchedTowels.reduce((acc, matchedTowel) => {
        const newPattern = pattern.slice(matchedTowel.length);
        return acc || process(newPattern, towels, memo);
    }, false);

    memo.set(pattern, anyPossible);
    return anyPossible;
}

function processFunction(data) {
    const { patterns, towels } = data;
    const memo = new Map();

    return patterns.reduce((count, pattern) => {
        return process(pattern, towels, memo) ? count + 1 : count;
    }, 0);
}

const correctResults = [6, 1, 1, 0];
runDay(19, 1, loadData, processFunction, correctResults);