const fs = require('fs');
const path = require('path');

function parseInput(input) {
    return input.split('\n').map(line => {
        const [testValue, numbers] = line.split(': ');
        return {
            testValue: parseInt(testValue, 10),
            numbers: numbers.split(' ').map(Number)
        };
    });
}

function evaluateExpression(numbers, operators) {
    let result = numbers[0];
    for (let i = 0; i < operators.length; i++) {
        if (operators[i] === '+') {
            result += numbers[i + 1];
        } else if (operators[i] === '*') {
            result *= numbers[i + 1];
        }
    }
    return result;
}

function generateOperatorCombinations(length) {
    const combinations = [];
    const generate = (current) => {
        if (current.length === length) {
            combinations.push(current);
            return;
        }
        generate(current + '+');
        generate(current + '*');
    };
    generate('');
    return combinations;
}

function canBeTrue(testValue, numbers) {
    const operatorCombinations = generateOperatorCombinations(numbers.length - 1);
    for (const operators of operatorCombinations) {
        if (evaluateExpression(numbers, operators) === testValue) {
            return true;
        }
    }
    return false;
}

function sumOfValidTestValues(input) {
    const equations = parseInput(input);
    let sum = 0;
    for (const { testValue, numbers } of equations) {
        if (canBeTrue(testValue, numbers)) {
            sum += testValue;
        }
    }
    return sum;
}


const test_input = fs.readFileSync(path.resolve(__dirname, 'test_data.txt'), 'utf8').trim();
const test_result = sumOfValidTestValues(test_input);

const input = fs.readFileSync(path.resolve(__dirname, 'data.txt'), 'utf8').trim();
const result = sumOfValidTestValues(input);

console.log("=====================");
console.log("🌟 Day 7 - Part 1 🌟");
console.log("=====================");
console.log("Sum of Valid Input Values:", result);
console.log("Sum of Valid Test Values:", test_result);
