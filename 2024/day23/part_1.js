const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    const lines = data.replaceAll('\r', '').split('\n');
    const connectionsMap = new Map();

    for (let line of lines) {
        const [from, to] = line.split('-');

        if (!connectionsMap.has(from)) {
            connectionsMap.set(from, new Set());
        }
        if (!connectionsMap.has(to)) {
            connectionsMap.set(to, new Set());
        }

        connectionsMap.get(from).add(to);
        connectionsMap.get(to).add(from);
    }

    return connectionsMap;
}

function processFunction(connectionsMap) {
    const setsOfThree = new Set();

    for (let [computer1, connections1] of connectionsMap) {
        for (let computer2 of connections1) {
            if (connectionsMap.has(computer2)) {
                const connections2 = connectionsMap.get(computer2);
                for (let computer3 of connections2) {
                    if (connectionsMap.has(computer3) && connectionsMap.get(computer3).has(computer1)) {
                        const set = [computer1, computer2, computer3].sort().join(',');
                        setsOfThree.add(set);
                    }
                }
            }
        }
    }

    const setsOfThree_t = Array.from(setsOfThree)
        .map(set => set.split(','))
        .filter(set => set.some(computer => computer.startsWith('t')))
        .sort((a, b) => a.join().localeCompare(b.join()));

    console.log(setsOfThree_t);
    return setsOfThree_t.length;
}

const correctResults = [7];

runDay(23, 1, loadData, processFunction, correctResults);