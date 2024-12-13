const runDay = require('../../functions/dayTemplate');

function loadFile(data) {
    return data.split('\n').map(line => line.split(''));
}

const word = 'XMAS';
const directions = [
  [0, 1],  // right
  [1, 0],  // down
  [1, 1],  // down-right
  [1, -1], // down-left
  [0, -1], // left
  [-1, 0], // up
  [-1, -1],// up-left
  [-1, 1]  // up-right
];

function searchWord(matrix, word) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const wordLength = word.length;
  let count = 0;

  function isValid(x, y) {
    return x >= 0 && x < rows && y >= 0 && y < cols;
  }

  function searchDirection(x, y, dx, dy) {
    for (let i = 0; i < wordLength; i++) {
      if (!isValid(x + i * dx, y + i * dy) || matrix[x + i * dx][y + i * dy] !== word[i]) {
        return false;
      }
    }
    return true;
  }

  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      if (matrix[x][y] === word[0]) {
        for (const [dx, dy] of directions) {
          if (searchDirection(x, y, dx, dy)) {
            count++;
          }
        }
      }
    }
  }
  return count;
}

const correctResults = [18];
runDay(4, 1, loadFile, (matrix) => searchWord(matrix, word), correctResults);