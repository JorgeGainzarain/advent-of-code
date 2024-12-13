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

function isSafeWithDampener(list) {
    if (isValidList(list)) return true;

    for (let i = 0; i < list.length; i++) {
        const newList = list.slice(0, i).concat(list.slice(i + 1));
        if (isValidList(newList)) return true;
    }

    return false;
}

function countSafeLists(lists) {
    return lists.filter(isSafeWithDampener).length;
}

const correctResults = [4];
runDay(2, 2, loadAndSplitFile, countSafeLists, correctResults);