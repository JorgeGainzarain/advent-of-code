const chalk = require('chalk');
const Table = require('cli-table3');  // Importing cli-table3

async function printResults(results, correctTestResults, day, part) {

    // Print a separator line before each day's output
    console.log(chalk.yellow('\n' + '-'.repeat(50) + '\n'));

    // Dynamically import boxen for box creation
    const boxen = (await import('boxen')).default;

    // Title box width should fit the title + some padding, no excessive width
    const title = `🎄 ❄️ Day ${day} - Part ${part} ❄️ 🎄`;
    const titleWidth = Math.max(title.length + 4, 30); // Adjust the width here

    // Create a box around the title with padding, minimal width, and rounded corners
    const titleBox = boxen(
        title,
        {
            padding: 0,
            margin: 0,
            borderStyle: 'round',
            borderColor: 'yellow',
            align: 'center',
            width: titleWidth
        }
    );

    // Print the title box
    console.log(titleBox);

    // Create a table to display test data results
    const table = new Table({
        head: [chalk.cyan('Test Case'), chalk.cyan('Result'), chalk.cyan('Expected'), chalk.cyan('Status')],
        colWidths: ['auto', 'auto', 'auto', 'auto'],  // Automatically adjust column widths
        style: { head: ['cyan'], border: ['green'] },
        colAligns: ['center', 'center', 'center', 'center']  // Center align the text in columns
    });

    // Populate the table with test data results
    results.slice(1).forEach((result, index) => {
        const expected = correctTestResults[index];
        const status = result === expected ? chalk.green("Correct") : chalk.red("Incorrect");

        table.push([`Test Data ${index + 1}`, result, expected, status]);
    });

    // Print the table
    console.log(table.toString());

    const data = results[0].toString();
    const dataWidth = Math.max(data.length + 20, 25);

    // Create a box around the data result
    const dataResultBox = boxen(
        `${chalk.bold.blue('Data result:')} ${data}`,
        {
            padding: 0,
            margin: 0,
            borderColor: 'blue',
            align: 'center',
            width: dataWidth
        }
    );

    // Print the data result box
    console.log(dataResultBox);

}

module.exports = printResults;