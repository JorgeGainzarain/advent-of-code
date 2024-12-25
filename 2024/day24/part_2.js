const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    const parts = data.replaceAll('\r', '').split('\n\n').map(part =>
        part.split('\n').map(line => line.split(' '))
    );

    const wires = new Map();
    parts[0].forEach(([key, value]) => {
        wires.set(key.slice(0, -1), parseInt(value));
    });

    const gates = parts[1].map(([input1, operation, input2, , output]) => ({
        input1,
        operation,
        input2,
        output
    }));

    return { wires, gates };
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

function searchGates(gates, flags, inputBitCount) {
    const FAGate0s = gates.filter(gate => gate.operation === "XOR" && (gate.input1.startsWith("x") || gate.input2.startsWith("x")));
    for (const gate of FAGate0s) {
        const { input1, input2, output } = gate;
        const isFirst = input1 === "x00" || input2 === "x00";
        if (isFirst) {
            if (output !== "z00") {
                flags.add(output);
            }
            continue;
        } else if (output === "z00") {
            flags.add(output);
        }
        if (output.startsWith("z")) {
            flags.add(output);
        }
    }

    const correctGates = gates.filter(gate => gate.operation === "XOR" && !(gate.input1.startsWith("x") || gate.input2.startsWith("x")));
    for (const gate of correctGates) {
        if (!gate.output.startsWith("z")) {
            flags.add(gate.output);
        }
    }

    const outputGates = gates.filter(gate => gate.output.startsWith("z"));
    for (const gate of outputGates) {
        const isLast = gate.output === `z${inputBitCount}`.padStart(3, "0");
        if (isLast) {
            if (gate.operation !== "OR") {
                flags.add(gate.output);
            }
        } else if (gate.operation !== "XOR") {
            flags.add(gate.output);
        }
    }

    return { FAGate0s, correctGates };
}

function processFunction(data) {
    const { wires, gates } = data;
    const processed = new Map(wires);

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

    // Flagging functionality
    const flags = new Set();
    const inputBitCount = wires.size / 2;

    const { FAGate0s, correctGates } = searchGates(gates, flags, inputBitCount);

    let checkNext = [];
    for (const gate of FAGate0s) {
        const { output } = gate;
        if (flags.has(output)) continue;
        if (output === "z00") continue;
        const matches = correctGates.filter(g => g.input1 === output || g.input2 === output);
        if (matches.length === 0) {
            checkNext.push(gate);
            flags.add(output);
        }
    }

    for (const gate of checkNext) {
        const { input1 } = gate;
        const intendedResult = `z${input1.slice(1)}`;
        const matches = correctGates.filter(g => g.output === intendedResult);

        const match = matches[0];
        const toCheck = [match.input1, match.input2];
        const orMatches = gates.filter(g => g.operation === "OR" && toCheck.includes(g.output));
        if (orMatches.length !== 1) {
            throw new Error("This solver isn't complex enough to solve this");
        }
        const orMatchOutput = orMatches[0].output;
        const correctOutput = toCheck.find(output => output !== orMatchOutput);
        flags.add(correctOutput);
    }

    if (flags.size !== 8) {
        throw new Error("This solver isn't complex enough to solve this");
    }

    const flagsArr = [...flags];
    flagsArr.sort((a, b) => a.localeCompare(b));
    return flagsArr.join(",");
}

const correctResults = [];
runDay(24, 2, loadData, processFunction, correctResults);