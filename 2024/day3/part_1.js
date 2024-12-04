const fs = require('fs');
const path = require('path');

function loadFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function evaluateExpression(expression) {
    const mulPattern = /mul\((\d+),(\d+)\)/g;
    let sum = 0;
    expression.replace(mulPattern, (match, num1, num2) => {
        sum += Number(num1) * Number(num2);
    });
    return sum;
}

const test_input = loadFile(path.join(__dirname, 'test_data.txt'));
const test_result = evaluateExpression(test_input);
const input = loadFile(path.join(__dirname, 'data.txt'));
const result = evaluateExpression(input);

console.log("=====================");
console.log("🌟 Day 3 - Part 1 🌟");
console.log("=====================");
console.log("Test Input Result: " + test_result);
console.log("Actual Input Result: " + result);