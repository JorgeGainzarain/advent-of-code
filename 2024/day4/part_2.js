function countMASandSAM(grid) {
    const rows = grid.length;
    const cols = grid[0].length;

    console.log(rows, cols);
    let count = 0;


    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {

            if (grid[row][col] === 'A') {
                // Ensure we are not on the edge of the grid
                if (grid[row - 1] === undefined) continue;
                if (grid[row + 1] === undefined) continue;
                if (grid[row][col - 1] === undefined) continue;
                if (grid[row][col + 1] === undefined) continue;

                let a = grid[row - 1][col - 1];
                let b = grid[row + 1][col + 1];
                let c = grid[row + 1][col - 1];
                let d = grid[row - 1][col + 1];

                // Ensure all positions are either 'M' or 'S'
                if (a === 'M' && b === 'S' || a === 'S' && b === 'M') {
                    if (c === 'M' && d === 'S' || c === 'S' && d === 'M') {
                        count++;
                    }
                }
            }
        }
    }


    return count;
}


const fs = require('fs');
const path = require('path');

const testData = fs.readFileSync(path.resolve(__dirname, 'test_data_2.txt'), 'utf8');
const testGrid = testData.split("\n").map(row => row.split(""));
const testResult = countMASandSAM(testGrid);

const data = fs.readFileSync(path.resolve(__dirname, 'data.txt'), 'utf8');
const grid = data.split("\n").map(row => row.split(""));
const result = countMASandSAM(grid);


console.log();
console.log("=====================");
console.log("🌟 Day 4 - Part 2 🌟");
console.log("=====================");
console.log("Test Input Result: " + testResult);
console.log("Actual Input Result: " + result);




