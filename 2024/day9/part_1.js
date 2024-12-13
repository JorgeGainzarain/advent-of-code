const runDay = require('../../functions/dayTemplate');
const ora = require('ora');

function parseDiskMap(diskMap) {
    let result = [];
    let fileId = 0;
    let isFile = true;

    for (let i = 0; i < diskMap.length; i++) {
        const length = parseInt(diskMap[i], 10);

        if (isFile) {
            for (let j = 0; j < length; j++) {
                result.push(fileId);
            }
            fileId++;
        } else {
            for (let j = 0; j < length; j++) {
                result.push('.');
            }
        }

        isFile = !isFile;
    }

    return result;
}

function compactDiskMap(diskMap) {
    let chars = diskMap.slice();

    // Continue moving blocks until no movement is possible
    while (true) {
        let moved = false;

        // Scan from left to right
        for (let i = 0; i < chars.length; i++) {
            if (chars[i] === '.') {
                // Look for the rightmost non-dot character
                for (let j = chars.length - 1; j > i; j--) {
                    if (chars[j] !== '.') {
                        // Swap the first dot with the rightmost non-dot character
                        chars[i] = chars[j];
                        chars[j] = '.';
                        moved = true;
                        break;
                    }
                }
            }

            if (moved) break; // Restart the process after each move
        }

        if (!moved) break; // Stop when no more moves are possible
    }

    return chars;
}

function calculateChecksum(diskMap) {
    let checksum = 0;
    for (let i = 0; i < diskMap.length; i++) {
        if (diskMap[i] !== '.') {
            checksum += i * diskMap[i];
        }
    }
    return checksum;
}

function processFunction(input) {
    const spinner = ora('Processing...').start();

    const parsedDiskMap = parseDiskMap(input);
    const compactedDiskMap = compactDiskMap(parsedDiskMap).filter(char => char !== '.');
    const result = calculateChecksum(compactedDiskMap);

    spinner.succeed('Processing complete!');
    return result;
}

const correctResults = [1928];
runDay(9, 1, "", processFunction, correctResults);