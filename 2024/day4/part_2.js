const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.split('\n').map(line => line.split(''));
}

function countMASandSAM(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (grid[row][col] === 'A') {
                if (grid[row - 1] === undefined || grid[row + 1] === undefined || grid[row][col - 1] === undefined || grid[row][col + 1] === undefined) continue;

                let a = grid[row - 1][col - 1];
                let b = grid[row + 1][col + 1];
                let c = grid[row + 1][col - 1];
                let d = grid[row - 1][col + 1];

                if ((a === 'M' && b === 'S') || (a === 'S' && b === 'M')) {
                    if ((c === 'M' && d === 'S') || (c === 'S' && d === 'M')) {
                        count++;
                    }
                }
            }
        }
    }
    return count;
}

const correctResults = [9, 1];
runDay(4, 2, loadFile, countMASandSAM, correctResults);