const fs = require('fs');
const path = require('path');

function loadFile(filePath) {
    return fs.readFileSync(filePath, 'utf8');
}

function evaluateExpression(expression) {
    const mulPattern = /mul\((\d+),(\d+)\)/;
    const doPattern = /do\(\)/;
    const dontPattern = /don't\(\)/;
    let sum = 0;
    let enabled = true;

    const matches = expression.match(/do\(\)|don't\(\)|mul\(\d+,\d+\)/g);
    if (matches) {
        matches.forEach(match => {
            if (doPattern.test(match)) {
                enabled = true;
            } else if (dontPattern.test(match)) {
                enabled = false;
            } else if (enabled && mulPattern.test(match)) {
                const mulMatch = match.match(mulPattern);
                if (mulMatch) {
                    const num1 = Number(mulMatch[1]);
                    const num2 = Number(mulMatch[2]);
                    sum += num1 * num2;
                }
            }
        });
    }
    return sum;
}

const test_input = loadFile(path.join(__dirname, 'test_data_2.txt'));
const test_result = evaluateExpression(test_input);
const input = loadFile(path.join(__dirname, 'data.txt'));
const result = evaluateExpression(input);

console.log();
console.log("=====================");
console.log("🌟 Day 3 - Part 2 🌟");
console.log("=====================");
console.log("Test Input Result: " + test_result);
console.log("Actual Input Result: " + result);