const runDay = require('../../functions/dayTemplate');

function loadFunction(data) {
    const machineBlocks = data.replace(/\r\n/g, '\n').split('\n\n');

    return machineBlocks.map(machine => {
        const lines = machine.split('\n').filter(line => line.trim() !== '');

        const buttonA = lines[0].match(/X\+(\d+), Y\+(\d+)/).slice(1, 3).map(Number);
        const buttonB = lines[1].match(/X\+(\d+), Y\+(\d+)/).slice(1, 3).map(Number);
        const prize = lines[2].match(/X=(\d+), Y=(\d+)/).slice(1, 3).map(Number);

        return {
            buttonA,
            buttonB,
            prize: prize.map(p => p + 10_000_000_000_000)
        };
    });
}

function processFunction(machines) {
    const solvedMachines = [];

    machines.forEach((machine, index) => {
        const [ax, ay] = machine.buttonA;
        const [bx, by] = machine.buttonB;
        const [px, py] = machine.prize;

        // Calculate the greatest common divisor of the differences
        const g = gcd(ax * by - ay * bx, px * by - py * bx);

        if (g === 0) {
            return;
        }

        // Calculate the number of presses for A and B
        const a_presses = (px * by - py * bx) / g;
        const b_presses = (ax * py - ay * px) / g;

        // Ensure the number of presses are integers and within a reasonable range
        if (!Number.isInteger(a_presses) || !Number.isInteger(b_presses) || a_presses < 0 || b_presses < 0 || a_presses > 1e12 || b_presses > 1e12) {
            return;
        }

        // Calculate the total cost
        const total_cost = a_presses * 3 + b_presses;

        solvedMachines.push({ index, total_cost });
    });

    // Calculate the total tokens spent on solved machines
    const totalTokens = solvedMachines.reduce((sum, machine) => sum + machine.total_cost, 0);

    // Output only the test case results
    if (solvedMachines.length < 5) {
        console.log("--------------------------------------------------")
        console.log("Solved Machines:", solvedMachines);
    }

    return totalTokens;
}

// Helper function to calculate the greatest common divisor
function gcd(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
}

const correctResults = []; // In this case we don't know the correct result for the test case.
// We only know that the test case should only be able to solve machines 2 and 4 (1 and 3 indexes starting from 0)
// For this I added a debug console.log in the processFunction to show which machines were solved and manually checked the output
runDay(13, 2, loadFunction, processFunction, correctResults);