const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.split('\n');
}

function evaluateExpression(expression) {
    const mulPattern = /mul\((\d+),(\d+)\)/g;
    let sum = 0;
    expression.forEach(line => {
        line.replace(mulPattern, (match, num1, num2) => {
            sum += Number(num1) * Number(num2);
        });
    });
    return sum;
}

const correctResults = [161];
runDay(3, 1, loadFile, evaluateExpression, correctResults);