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
    console.log("\n\n\n");
    const { registers, program } = data;
    let pc = 0;
    let outString = '';
    while (pc < program.length) {
        const initPc = pc;
        const opCode = program[pc];
        const operand = program[pc + 1];
        const comboOperand = getComboOperand(operand, registers);
        console.log(`pc: [${pc}, ${pc + 1}], opCode: ${opCode}, operand: ${operand}, comboOperand: ${comboOperand}`);
        switch (opCode) {
            case 0: // Division A = A / 2^comboOperand (truncated to an integer)
                console.log(`Operation: A = ${registers.A} / 2^${comboOperand}`);
                registers.A = Math.floor(registers.A / Math.pow(2, comboOperand));
                console.log(`Result: A = ${registers.A}`);
                break;
            case 6: // Division B = A / 2^comboOperand (truncated to an integer)
                console.log(`Operation: B = ${registers.A} / 2^${comboOperand}`);
                registers.B = Math.floor(registers.A / Math.pow(2, comboOperand));
                console.log(`Result: B = ${registers.A}`);
                break;
            case 7: // Division C = A / 2^comboOperand (truncated to an integer)
                console.log(`Operation: C = ${registers.A} / 2^${comboOperand}`);
                registers.C = Math.floor(registers.A / Math.pow(2, comboOperand));
                console.log(`Result: C = ${registers.A}`);
                break;
            case 1: // B = B XOR operand
                console.log(`Operation: B = ${registers.B} XOR ${operand}`);
                registers.B = (registers.B ^ operand) >>> 0;
                console.log(`Result: B = ${registers.B}`);
                break;
            case 2: // B = comboOperand % 8
                console.log(`Operation: B = ${comboOperand} % 8`);
                registers.B = comboOperand % 8;
                console.log(`Result: B = ${registers.B}`);
                break;
            case 4: // B = B XOR C
                console.log(`Operation: B = ${registers.B} XOR ${registers.C}`);
                registers.B = (registers.B ^ registers.C) >>> 0;
                console.log(`Result: B = ${registers.B}`);
                break;
            case 3: // if A != 0 jump to operand
                console.log(`Operation: if A (${registers.A}) != 0 jump to ${operand}`);
                if (registers.A !== 0) {
                    pc = operand;
                }
                break;
            case 5: // print(comboOperand % 8)
                console.log(`Operation: print(${comboOperand} % 8)`);
                outString += comboOperand % 8 + ',';
                break;
        }
        if (pc === initPc) {
            pc += 2;
        }
        console.log(`registers: ${JSON.stringify(registers)}`);
    }
    // Remove last comma
    outString = outString.slice(0, -1);
    return outString;
}

const correctResults = ['6,0,4,5,4,5,2,0', '4,2,5,6,7,7,7,7,3,1,0', '4,6,3,5,6,3,5,2,1,0'];
runDay(17, 1, loadData, processFunction, correctResults);