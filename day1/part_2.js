const fs = require('fs');
const path = require('path');

function loadLists(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
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

const { list1: list1Data, list2: list2Data } = loadLists(path.join(__dirname, 'data.txt'));
const { list1: list1Test, list2: list2Test } = loadLists(path.join(__dirname, 'test_data.txt'));


// Create a frequency map for list2
function calculateSimilarityScore(list1, list2) {
const frequencyMap = list2.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
}, {});

// Calculate the total similarity score
let totalSimilarityScore = 0;
list1.forEach(num => {
    if (frequencyMap[num]) {
        totalSimilarityScore += num * frequencyMap[num];
    }
});

    return totalSimilarityScore;
}

const testSimilarityScore = calculateSimilarityScore(list1Test, list2Test);
const dataSimilarityScore = calculateSimilarityScore(list1Data, list2Data);

console.log();
console.log("=====================");
console.log("🌟 Day 1 - Part 2 🌟");
console.log("=====================");
console.log("Test Data Similarity Score: " + testSimilarityScore);
console.log("Actual Data Similarity Score: " + dataSimilarityScore);