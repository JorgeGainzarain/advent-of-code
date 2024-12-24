const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    const lines = data.replaceAll('\r', '').split('\n').filter(line => line.trim());
    const connectionsMap = new Map();

    for (let line of lines) {
        const [from, to] = line.split('-');
        if (!connectionsMap.has(from)) connectionsMap.set(from, new Set());
        if (!connectionsMap.has(to)) connectionsMap.set(to, new Set());
        connectionsMap.get(from).add(to);
        connectionsMap.get(to).add(from);
    }

    return connectionsMap;
}

function getConnectedSet(computer, connectionsMap) {
    if (!connectionsMap.has(computer)) return new Set();

    const connected = new Set([computer]);
    const connections = connectionsMap.get(computer);

    for (const neighbor of connections) {
        if (connectionsMap.has(neighbor) && connectionsMap.get(neighbor).has(computer)) {
            connected.add(neighbor);
        }
    }
    return connected;
}

function getMemoKey(current, remaining) {
    return current.sort().join(',') + '|' + remaining.sort().join(',');
}

function canFormLargerSet(current, remaining, maxSet) {
    return current.length + remaining.length > maxSet.length;
}

function isFullyConnected(computers, connectedSets) {
    if (computers.length === 0) return false;
    const firstComputer = computers[0];
    if (!connectedSets.has(firstComputer)) return false;

    const potentialSet = connectedSets.get(firstComputer);
    return computers.every(c => potentialSet.has(c));
}

function expandSet(current, remaining, startIdx, connectionsMap, memo, maxSet, connectedSets) {
    if (!canFormLargerSet(current, remaining, maxSet)) return maxSet;

    if (current.length > 0) {
        const memoKey = getMemoKey(current, remaining);
        if (memo.has(memoKey)) return memo.get(memoKey);

        if (isFullyConnected(current, connectedSets)) {
            if (current.length > maxSet.length) {
                maxSet = [...current];
            }
        }
    }

    for (let i = startIdx; i < remaining.length; i++) {
        const computer = remaining[i];
        if (!connectionsMap.has(computer)) continue;

        const newRemaining = remaining.slice(i + 1);

        if (current.length > 0 && !current.every(c =>
            connectionsMap.has(c) &&
            connectionsMap.get(computer).has(c) &&
            connectionsMap.get(c).has(computer)
        )) {
            continue;
        }

        current.push(computer);
        maxSet = expandSet(current, newRemaining, 0, connectionsMap, memo, maxSet, connectedSets);
        current.pop();
    }

    if (current.length > 0) {
        memo.set(getMemoKey(current, remaining), maxSet);
    }

    return maxSet;
}

function findLargestFullyConnectedSet(connectionsMap) {
    const memo = new Map();
    let maxSet = [];

    const connectedSets = new Map();
    for (const computer of connectionsMap.keys()) {
        connectedSets.set(computer, getConnectedSet(computer, connectionsMap));
    }

    const allComputers = Array.from(connectionsMap.keys()).filter(c => connectionsMap.has(c));
    return expandSet([], allComputers, 0, connectionsMap, memo, maxSet, connectedSets);
}

function processFunction(connectionsMap) {
    const largestSet = findLargestFullyConnectedSet(connectionsMap);
    return largestSet.sort().join(',');
}

const correctResults = ["co,de,ka,ta"];

runDay(23, 2, loadData, processFunction, correctResults);