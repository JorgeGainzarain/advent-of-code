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

// Main execution
try {
    const test_DataPath = path.resolve(__dirname, 'test_data.txt');
    const test_diskMapInput = fs.readFileSync(test_DataPath, 'utf-8').trim();
    const test_parsedDiskMap = parseDiskMap(test_diskMapInput);
    const test_compactedDiskMap = compactDiskMap(test_parsedDiskMap).filter(char => char !== '.');
    const test_checksum = calculateChecksum(test_compactedDiskMap);

    const DataPath = path.resolve(__dirname, 'data.txt');
    const diskMapInput = fs.readFileSync(DataPath, 'utf-8').trim();
    const parsedDiskMap = parseDiskMap(diskMapInput);
    const compactedDiskMap = compactDiskMap(parsedDiskMap).filter(char => char !== '.');
    const checksum = calculateChecksum(compactedDiskMap);

    console.log("=====================");
    console.log("🌟 Day 9 - Part 1 🌟");
    console.log("=====================");
    console.log("Test Checksum:", test_checksum);
    console.log("Input Checksum:", checksum);
} catch (error) {
    console.error("Error processing disk map:", error);
}