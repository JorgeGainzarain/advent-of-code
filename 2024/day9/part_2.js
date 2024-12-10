const fs = require('fs');
const path = require('path');

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

    //console.log("File Blocks:", fileBlocks);

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
                    //console.log(`Skipping move for file ${fileId} to span ${i} as it is further right than current position ${currentPosition}`);
                    break;
                }
                //console.log("Moving file", fileId, "to span", i);
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

// Main execution
try {
    const test_DataPath = path.resolve(__dirname, 'test_data.txt');
    const test_diskMapInput = fs.readFileSync(test_DataPath, 'utf-8').trim();
    const test_parsedDiskMap = parseDiskMap(test_diskMapInput);
    const test_compactedDiskMapV2 = compactDiskMapV2(test_parsedDiskMap);
    const test_checksumV2 = calculateChecksum(test_compactedDiskMapV2);

    const DataPath = path.resolve(__dirname, 'data.txt');
    const diskMapInput = fs.readFileSync(DataPath, 'utf-8').trim();
    const parsedDiskMap = parseDiskMap(diskMapInput);
    const compactedDiskMapV2 = compactDiskMapV2(parsedDiskMap);
    const checksumV2 = calculateChecksum(compactedDiskMapV2);

    console.log("=====================");
    console.log("🌟 Day 9 - Part 2 🌟");
    console.log("=====================");
    console.log("Test Checksum:", test_checksumV2);
    console.log("Input Checksum:", checksumV2);
} catch (error) {
    console.error("Error processing disk map:", error);
}