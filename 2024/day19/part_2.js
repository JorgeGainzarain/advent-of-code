const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    data = data.replaceAll("\r", "").trim();
    const lines = data.split("\n");
    const towels = lines[0].split(", ");
    const patterns = lines.slice(2);
    return { patterns, towels };
}

function countArrangements(pattern, towels, memo = new Map()) {
    // Base case: empty pattern means we found one valid arrangement
    if (pattern.length === 0) return 1;

    // Check memoized results
    const memoKey = pattern;
    if (memo.has(memoKey)) return memo.get(memoKey);

    // Find all towels that could start this pattern
    const matchedTowels = towels.filter(towel => pattern.startsWith(towel));

    // If no towels match the start, this arrangement is impossible
    if (matchedTowels.length === 0) {
        memo.set(memoKey, 0);
        return 0;
    }

    // Count arrangements for each possible starting towel
    let totalArrangements = 0;
    for (const matchedTowel of matchedTowels) {
        const remainingPattern = pattern.slice(matchedTowel.length);
        totalArrangements += countArrangements(remainingPattern, towels, memo);
    }

    // Memoize and return result
    memo.set(memoKey, totalArrangements);
    return totalArrangements;
}

function processFunction(data) {
    const { patterns, towels } = data;
    let totalArrangements = 0;

    // Process each pattern
    patterns.forEach((pattern) => {
        const arrangements = countArrangements(pattern, towels);
        //console.log(`Pattern ${index + 1}: ${pattern} - ${arrangements} arrangements`);
        totalArrangements += arrangements;
    });

    return totalArrangements;
}

const correctResults = [16];
runDay(19, 2, loadData, processFunction, correctResults);