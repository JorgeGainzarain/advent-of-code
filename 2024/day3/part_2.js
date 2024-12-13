const runDay = require('../../functions/dayTemplate');

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

const correctResults = [48];
runDay(3, 2, "", evaluateExpression, correctResults);