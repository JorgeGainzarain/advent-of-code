const fs = require('fs');
const path = require('path');




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

const test_data = fs.readFileSync(path.resolve(__dirname, 'test_data.txt'), 'utf8');
const test_lines = test_data.replaceAll("\r","").split('\n');
const test_matrix = test_lines.map(line => line.split(''));
const test_result = searchWord(test_matrix, word);

const data = fs.readFileSync(path.resolve(__dirname, 'data.txt'), 'utf8');
const lines = data.replaceAll("\r","").split('\n');
const matrix = lines.map(line => line.split(''));
const result = searchWord(matrix, word);



console.log("=====================");
console.log("🌟 Day 4 - Part 1 🌟");
console.log("=====================");
console.log("Test Input Result: " + test_result);
console.log("Actual Input Result: " + result);
