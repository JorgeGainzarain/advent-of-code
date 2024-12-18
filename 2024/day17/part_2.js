const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    const lines = data.trim().split('\n');
    const registers = {
        A: parseInt(lines[0].split(': ')[1]),
        B: parseInt(lines[1].split(': ')[1]),
        C: parseInt(lines[2].split(': ')[1])
    };
    const program = lines[4].split(': ')[1].split(',').map(Number);
    return { registers, program };
}

const comboOperands = new Map([
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
    [4, (registers) => registers.A],
    [5, (registers) => registers.B],
    [6, (registers) => registers.C],
    [7, () => { throw new Error('Invalid operand: 7 is reserved and will not appear in valid programs.'); }]
]);

function getComboOperand(number, registers) {
    const operand = comboOperands.get(number);
    if (typeof operand === 'function') {
        return operand(registers);
    }
    return operand;
}

function processFunction(data) {
    const { registers, program } = data;
    let pc = 0;
    let outString = '';
    while (pc < program.length) {
        const initPc = pc;
        const opCode = program[pc];
        const operand = program[pc + 1];
        const comboOperand = getComboOperand(operand, registers);
        switch (opCode) {
            case 0:
                registers.A = Math.floor(registers.A / Math.pow(2, comboOperand));
                break;
            case 6:
                registers.B = Math.floor(registers.A / Math.pow(2, comboOperand));
                break;
            case 7:
                registers.C = Math.floor(registers.A / Math.pow(2, comboOperand));
                break;
            case 1:
                registers.B = (registers.B ^ operand) >>> 0;
                break;
            case 2:
                registers.B = comboOperand % 8;
                break;
            case 4:
                registers.B = (registers.B ^ registers.C) >>> 0;
                break;
            case 3:
                if (registers.A !== 0) {
                    pc = operand;
                }
                break;
            case 5:
                outString += comboOperand % 8 + ',';
                break;
        }
        if (pc === initPc) {
            pc += 2;
        }
    }
    return outString.slice(0, -1);
}

function bruteForce(min, max, registers, program, expectedOutput, q, Q) {
    for (let a = min; a <= max; a++) {
        const testRegisters = { ...registers, A: a };
        const r = processFunction({ registers: testRegisters, program });
        if (r === expectedOutput) {
            Q.push({ result: a.toString(2), len: q.len + 1 });
        }
    }
}

function bfs(registers, program) {
    const Q = [];
    Q.push({ result: '', len: 0 });

    while (Q.length) {
        const q = Q.shift();
        if (q.len === program.length) {
            return parseInt(q.result, 2);
        }
        const min = parseInt(q.result + '000', 2);
        const max = parseInt(q.result + '111', 2);
        const expectedOutput = program.slice((q.len + 1) * -1).join(',');
        bruteForce(min, max, registers, program, expectedOutput, q, Q);
    }

    return null;
}

function findLowestA(data) {
    const { registers, program } = data;
    // This approach works searching for the lowest A value in binary
    // It uses a combination of bfs for first 3 bits and brute force for the rest
    // This reduces the number of combinations significantly
    return bfs(registers, program);
}

const correctResults = [202797954918051, 117440];
runDay(17, 2, loadData, findLowestA, correctResults);