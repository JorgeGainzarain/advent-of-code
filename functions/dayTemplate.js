const loadData = require('./loadData');
const printResults = require('./printResults');
const path = require('path');

function runDay(day, part, loadFunction, processFunction, correctResults) {
    const dirPath = path.join(__dirname, `../2024/day${day}`);
    const dataSets = loadData(dirPath, loadFunction || ((data) => data), part);

    const results = dataSets.map(dataSet => {
        if (dataSet === null) {
            return ''; // Add empty result for empty dataset
        }
        return processFunction(dataSet);
    });

    printResults(results, correctResults, day, part);
}

module.exports = runDay;