const runDay = require('../../functions/dayTemplate');

function loadFunction(data) {
    //console.log(data);

    // Normalize line breaks and split
    const machineBlocks = data.replace(/\r\n/g, '\n').split('\n\n');

    return machineBlocks.map(machine => {
        const lines = machine.split('\n').filter(line => line.trim() !== '');

        const buttonA = lines[0].match(/X\+(\d+), Y\+(\d+)/).slice(1, 3).map(Number);
        const buttonB = lines[1].match(/X\+(\d+), Y\+(\d+)/).slice(1, 3).map(Number);
        const prize = lines[2].match(/X=(\d+), Y=(\d+)/).slice(1, 3).map(Number);

        return {buttonA, buttonB, prize};
    });
}

function processFunction(machines) {
    let totalTokens = 0;

    for (const { buttonA, buttonB, prize } of machines) {
        const [ax, ay] = buttonA;
        const [bx, by] = buttonB;
        const [px, py] = prize;

        //console.log(`Processing machine with buttonA: [${ax}, ${ay}], buttonB: [${bx}, ${by}], prize: [${px}, ${py}]`);

        let minTokens = Infinity;
        let found = false;

        for (let a = 0; a <= 100; a++) {
            for (let b = 0; b <= 100; b++) {
                if (a * ax + b * bx === px && a * ay + b * by === py) {
                    const tokens = a * 3 + b;
                    //console.log(`Found solution: a=${a}, b=${b}, tokens=${tokens}`);
                    if (tokens < minTokens) {
                        minTokens = tokens;
                        found = true;
                    }
                }
            }
        }

        if (found) {
            //console.log(`Minimum tokens for this machine: ${minTokens}`);
            totalTokens += minTokens;
        } else {
            //console.log(`No solution found for this machine`);
        }
    }

    //console.log(`Total tokens required: ${totalTokens}`);
    return totalTokens;
}

const correctResults = [480];
runDay(13, 1, loadFunction, processFunction, correctResults);