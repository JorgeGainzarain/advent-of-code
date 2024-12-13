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

function compactDiskMapV2(diskMap) {
    let chars = diskMap.slice();
    let fileBlocks = {};

    // Collect file blocks
    for (let i = 0; i < chars.length; i++) {
        if (chars[i] !== '.') {
            if (!fileBlocks[chars[i]]) {
                fileBlocks[chars[i]] = [];
            }
            fileBlocks[chars[i]].push(i);
        }
    }

    // Sort files by descending file ID
    let sortedFiles = Object.keys(fileBlocks).sort((a, b) => b - a);

    for (let fileId of sortedFiles) {
        let blocks = fileBlocks[fileId];
        let blockLength = blocks.length;
        let currentPosition = Math.min(...blocks);

        // Find the leftmost span of free space that can fit the file
        for (let i = 0; i <= chars.length - blockLength; i++) {
            if (chars.slice(i, i + blockLength).every(c => c === '.')) {
                if (i > currentPosition) {
                    break;
                }
                // Move the file to this span
                for (let j = 0; j < blockLength; j++) {
                    chars[blocks[j]] = '.';
                    chars[i + j] = fileId;
                }
                break;
            }
        }
    }

    return chars;
}

function calculateChecksum(diskMap) {
    let checksum = 0;
    for (let i = 0; i < diskMap.length; i++) {
        if (diskMap[i] !== '.') {
            checksum += i * parseInt(diskMap[i], 10);
        }
    }
    return checksum;
}

function processFunction(input) {
    const spinner = ora('Processing...').start();

    const parsedDiskMap = parseDiskMap(input);
    const compactedDiskMapV2 = compactDiskMapV2(parsedDiskMap);
    const result = calculateChecksum(compactedDiskMapV2);

    spinner.succeed('Processing complete!');
    return result;
}

const correctResults = [2858];
runDay(9, 2, "", processFunction, correctResults);