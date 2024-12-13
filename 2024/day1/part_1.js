const runDay  = require('../../functions/dayTemplate');

function loadLists(data) {
    const lines = data.split('\n');
    const list1 = [];
    const list2 = [];

    lines.forEach(line => {
        const [col1, col2] = line.split(/\s+/);
        list1.push(parseInt(col1, 10));
        list2.push(parseInt(col2, 10));
    });

    return { list1, list2 };
}

function processLists({ list1, list2 }) {
    list1.sort((a, b) => a - b);
    list2.sort((a, b) => a - b);

    let sum = 0;
    for (let i = 0; i < list1.length; i++) {
        let offset = Math.abs(list1[i] - list2[i]);
        sum += offset;
    }
    return sum;
}

const correctResults = [11];
runDay(1, 1, loadLists, processLists, correctResults);