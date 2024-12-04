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



const { list1: list1Test, list2: list2Test } = loadLists(path.join(__dirname, 'test_data.txt'));
const { list1: list1Data, list2: list2Data } = loadLists(path.join(__dirname, 'data.txt'));

// sort the lists
list1Test.sort((a, b) => a - b);
list2Test.sort((a, b) => a - b);

list1Data.sort((a, b) => a - b);
list2Data.sort((a, b) => a - b);

let sumTest = 0;
for (let i = 0; i < list1Test.length; i++) {
    let offset = Math.abs(list1Test[i] - list2Test[i]);
    sumTest += offset;
}


let sumData = 0;
for (let i = 0; i < list1Data.length; i++) {
    let offset = Math.abs(list1Data[i] - list2Data[i]);
    sumData += offset;
}

console.log("=====================");
console.log("🌟 Day 1 - Part 1 🌟");
console.log("=====================");
console.log("Test Data Result: " + sumTest);
console.log("Actual Input Result: " + sumData);
