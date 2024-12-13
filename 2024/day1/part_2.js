const runDay = require('../../functions/dayTemplate');

function loadLists(data) {
    const lines = data.split('\n');
    const list1 = [];
    const list2 = [];

    lines.forEach(line => {
        const [col1, col2] = line.split(/\s+/);
        list1.push(parseInt(col1, 10));
        list2.push(parseInt(col2, 10));
    });

    return { list1, list2 };
}

function calculateSimilarityScore({ list1, list2 }) {
    const frequencyMap = list2.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
    }, {});

    let totalSimilarityScore = 0;
    list1.forEach(num => {
        if (frequencyMap[num]) {
            totalSimilarityScore += num * frequencyMap[num];
        }
    });

    return totalSimilarityScore;
}

const correctResults = [31];
runDay(1, 2, loadLists, calculateSimilarityScore, correctResults);