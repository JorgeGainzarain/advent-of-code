const runDay = require('../../functions/dayTemplate');

function loadAndSplitFile(data) {
    const lines = data.split('\n');
    return lines.map(line => line.split(' ').map(Number));
}

function isValidList(list) {
    let increasing = null;
    const seenNumbers = new Set();

    for (let i = 0; i < list.length - 1; i++) {
        if (seenNumbers.has(list[i])) return false;
        seenNumbers.add(list[i]);

        const diff = list[i + 1] - list[i];
        if (Math.abs(diff) > 3) return false;

        if (diff > 0) {
            if (increasing === false) return false;
            increasing = true;
        } else if (diff < 0) {
            if (increasing === true) return false;
            increasing = false;
        }
    }

    return !seenNumbers.has(list[list.length - 1]);
}

function countValidLists(lists) {
    return lists.filter(isValidList).length;
}

const correctResults = [2];
runDay(2, 1, loadAndSplitFile, countValidLists, correctResults);