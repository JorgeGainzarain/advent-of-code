const fs = require('fs');
const path = require('path');
const blessed = require('blessed');

function loadFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8');
    return data.trim().split(' ').map(Number);
}

function simulateStonesEfficiently(stones, blinks) {
    const memo = new Map();

    function processStone(stone, remainingBlinks) {
        if (remainingBlinks === 0) return { [stone]: 1 };

        const memoKey = `${stone},${remainingBlinks}`;
        if (memo.has(memoKey)) return memo.get(memoKey);

        let result = {};
        if (stone === 0) {
            result = processStone(1, remainingBlinks - 1);
        } else if (stone.toString().length % 2 === 0) {
            const strStone = stone.toString();
            const mid = Math.floor(strStone.length / 2);
            const left = parseInt(strStone.slice(0, mid), 10);
            const right = parseInt(strStone.slice(mid), 10);
            const leftResult = processStone(left, remainingBlinks - 1);
            const rightResult = processStone(right, remainingBlinks - 1);

            for (const [key, count] of Object.entries(leftResult)) {
                result[key] = (result[key] || 0) + count;
            }
            for (const [key, count] of Object.entries(rightResult)) {
                result[key] = (result[key] || 0) + count;
            }
        } else {
            const transformed = stone * 2024;
            result = processStone(transformed, remainingBlinks - 1);
        }

        memo.set(memoKey, result);
        return result;
    }

    let stoneCounts = stones.reduce((acc, stone) => {
        acc[stone] = (acc[stone] || 0) + 1;
        return acc;
    }, {});

    for (let i = 0; i < blinks; i++) {
        const nextStoneCounts = {};

        for (const [stone, count] of Object.entries(stoneCounts)) {
            const transformedStones = processStone(parseInt(stone, 10), 1);
            for (const [key, keyCount] of Object.entries(transformedStones)) {
                nextStoneCounts[key] = (nextStoneCounts[key] || 0) + keyCount * count;
            }
        }

        stoneCounts = nextStoneCounts;
    }

    return stoneCounts;
}

// Blessed UI setup
const screen = blessed.screen({
    smartCSR: true,
    title: 'Plutonian Pebbles Simulation'
});

const grid = blessed.box({
    top: 6, // Adjust the top position to add margin
    left: 'center',
    width: '80%',
    height: '80%',
    content: '',
    tags: true,
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: '#f0f0f0'
        }
    }
});

const blinkButton = blessed.button({
    top: '90%',
    left: 'center',
    width: '15%', // Make the button smaller in width
    height: 3,
    content: 'Blink',
    align: 'center',
    border: {
        type: 'line'
    },
    style: {
        border: {
            fg: '#f0f0f0'
        },
        focus: {
            bg: 'red'
        }
    }
});

const blinkCountBox = blessed.box({
    top: 0,
    left: 'center',
    width: 'shrink',
    height: 3,
    content: 'Blinks: 0',
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        }
    }
});

const stoneCountBox = blessed.box({
    top: 3,
    left: 'center',
    width: 'shrink',
    height: 3,
    content: 'Stones: 0',
    border: {
        type: 'line'
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0'
        }
    },
    wrap: true
});

screen.append(grid);
screen.append(blinkButton);
screen.append(blinkCountBox);
screen.append(stoneCountBox);

// Allow the button to be focused
blinkButton.focus();

let stones = loadFile(path.resolve(__dirname, 'data.txt')); // Load initial stones from data.txt
let blinks = 0;

function updateGrid(stoneCounts) {
    const groupedStones = { '0': 0, 'evenDigits': 0, 'others': 0 };

    for (const [stone, count] of Object.entries(stoneCounts)) {
        if (stone === '0') {
            groupedStones['0'] += count;
        } else if (stone.length % 2 === 0) {
            groupedStones['evenDigits'] += count;
        } else {
            groupedStones['others'] += count;
        }
    }

    const content = [
        `0: ${groupedStones['0']}`,
        `Even Digits: ${groupedStones['evenDigits']}`,
        `Others: ${groupedStones['others']}`
    ].join('\n');

    // Calculate the required width and height
    const contentLines = content.split('\n');
    const maxWidth = Math.max(...contentLines.map(line => line.length));
    const height = contentLines.length;

    // Update the grid box dimensions
    grid.width = maxWidth + 2; // Add padding for the border
    grid.height = height + 2; // Add padding for the border

    grid.setContent(content);
    screen.render();
}

function updateBlinkCount() {
    blinkCountBox.setContent(`Blinks: ${blinks}`);
    screen.render();
}

function updateStoneCount(stoneCounts) {
    let totalStones = 0;
    for (const count of Object.values(stoneCounts)) {
        totalStones += count;
    }
    stoneCountBox.setContent(`Stones: ${totalStones}`);
    screen.render();
}

// Display initial stones
const initialStoneCounts = stones.reduce((acc, stone) => {
    acc[stone] = (acc[stone] || 0) + 1;
    return acc;
}, {});
updateGrid(initialStoneCounts);
updateStoneCount(initialStoneCounts);

// Update the blinkButton press event handler
blinkButton.on('press', () => {
    blinks++;
    const stoneCounts = simulateStonesEfficiently(stones, blinks);
    updateGrid(stoneCounts);
    updateBlinkCount();
    updateStoneCount(stoneCounts);
});

screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

screen.render();