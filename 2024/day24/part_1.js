const runDay = require('../../functions/dayTemplate');


function loadData(data) {
    const parts = data.replaceAll('\r', '').split('\n\n').map(part =>
        part.split('\n').map(line => line.split(' '))
    );

    const registers = new Map();
    parts[0].forEach(([key, value]) => {
        registers.set(key.slice(0, -1), parseInt(value));
    });

    const gates = parts[1].map(([input1, operation, input2, , output]) => ({
        input1,
        operation,
        input2,
        output
    }));

    return { registers, gates };
}

function getValue(processed, wire) {
    if (!isNaN(parseInt(wire))) return parseInt(wire);
    return processed.get(wire);
}

function canProcess(processed, gate) {
    const input1 = getValue(processed, gate.input1);
    const input2 = getValue(processed, gate.input2);
    return input1 !== undefined && input2 !== undefined;
}

function processGate(processed, gate) {
    const input1 = getValue(processed, gate.input1);
    const input2 = getValue(processed, gate.input2);

    let result;
    switch (gate.operation) {
        case 'AND': result = input1 & input2; break;
        case 'OR': result = input1 | input2; break;
        case 'XOR': result = input1 ^ input2; break;
    }

    processed.set(gate.output, result);
}

function processFunction(data) {
    const { registers, gates } = data;
    const processed = new Map(registers);

    let remainingGates = [...gates];
    while (remainingGates.length > 0) {
        const initialLength = remainingGates.length;
        remainingGates = remainingGates.filter(gate => {
            if (canProcess(processed, gate)) {
                processGate(processed, gate);
                return false;
            }
            return true;
        });

        if (remainingGates.length === initialLength) {
            throw new Error('Circuit deadlock detected');
        }
    }

    const zWires = Array.from(processed.entries())
        .filter(([key]) => key.startsWith('z'))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([, value]) => value)
        .reverse()
        .join('');

    return parseInt(zWires, 2);
}

const correctResults = [2024, 4];
runDay(24, 1, loadData, processFunction, correctResults);