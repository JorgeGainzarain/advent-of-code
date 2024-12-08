const fs = require('fs');
const path = require('path');
const cliProgress = require('cli-progress');

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
    let result = numbers[0]; // Start with the first number
    for (let i = 0; i < operators.length; i++) {
        const nextNumber = numbers[i + 1];
        if (nextNumber === undefined) return NaN;

        switch (operators[i]) {
            case '+':
                result += nextNumber;
                break;
            case '*':
                result *= nextNumber;
                break;
            case '||':
                result = parseInt(result.toString() + nextNumber.toString(), 10);
                if (isNaN(result)) return NaN;
                break;
            default:
                return NaN;
        }
    }
    return result;
}

function generateOperatorCombinations(length) {
    const operators = ['+', '*', '||'];
    const combinations = [];
    const totalCombinations = Math.pow(operators.length, length);

    for (let i = 0; i < totalCombinations; i++) {
        const combination = [];
        let temp = i;
        for (let j = 0; j < length; j++) {
            combination.unshift(operators[temp % operators.length]);
            temp = Math.floor(temp / operators.length);
        }
        combinations.push(combination);
    }

    return combinations;
}

function canBeTrue(testValue, numbers) {
    const operatorCombinations = generateOperatorCombinations(numbers.length - 1);
    return operatorCombinations.some(operators => {
        const result = evaluateExpression(numbers, operators);
        return !isNaN(result) && result === testValue;
    });
}

function sumOfValidTestValues(input) {
    const equations = parseInput(input);
    let sum = 0;

    // Create and start the progress bar
    const progressBar = new cliProgress.SingleBar(
        { format: 'Progress | {bar} | {value}/{total}' },
        cliProgress.Presets.shades_classic
    );
    progressBar.start(equations.length, 0);

    for (const { testValue, numbers } of equations) {
        if (canBeTrue(testValue, numbers)) {
            sum += testValue;
        }
        progressBar.increment();
    }

    // Stop the progress bar
    progressBar.stop();

    return sum;
}

console.log();
console.log("=====================");
console.log("🌟 Day 7 - Part 2 🌟");
console.log("=====================");

console.log("Processing test data...");
const test_input = fs.readFileSync(path.resolve(__dirname, 'test_data.txt'), 'utf8').trim();
const test_result = sumOfValidTestValues(test_input);
console.log("Sum of Valid Test Values:", test_result);


console.log("\nProcessing input data...");
const input = fs.readFileSync(path.resolve(__dirname, 'data.txt'), 'utf8').trim();
const result = sumOfValidTestValues(input);
console.log("Sum of Valid Input Values:", result);
