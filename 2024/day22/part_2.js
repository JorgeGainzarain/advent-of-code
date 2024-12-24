const runDay = require('../../functions/dayTemplate');

function loadData(data) {
    return data.split('\n').map(Number);
}

function processFunction(data) {
    if (VERBOSE) console.log("Starting with initial numbers:", data);

    // First, generate a Map of all possible 4-change sequences and their resulting prices for each buyer
    const buyerResults = new Map();

    data.forEach((initialPrice, buyerIndex) => {
        if (VERBOSE) console.log(`Processing buyer ${buyerIndex + 1}...`);
        let price = initialPrice;
        let prices = [price % 10];
        let changes = [];

        // Generate prices and changes
        for (let i = 0; i < 2000; i++) {
            price = mutatePrice(price);
            prices.push(price % 10);
            changes.push(prices[i + 1] - prices[i]);
        }

        // For each position, store the sequence that occurs there
        for (let i = 0; i <= changes.length - 4; i++) {
            const sequence = changes.slice(i, i + 4).join(',');
            if (!buyerResults.has(sequence)) {
                buyerResults.set(sequence, new Map());
            }

            // For each buyer, store the first price they'd give for this sequence
            if (!buyerResults.get(sequence).has(buyerIndex)) {
                buyerResults.get(sequence).set(buyerIndex, prices[i + 4]);
            }
        }
    });

    if (VERBOSE) console.log(`Found ${buyerResults.size} unique sequences`);

    // Now find the sequence that gives the most bananas
    let bestBananas = 0;
    let bestSequence = null;

    let sequencesChecked = 0;
    let lastProgress = Date.now();

    for (let [sequence, buyerPrices] of buyerResults) {
        sequencesChecked++;

        if (Date.now() - lastProgress > 5000) {
            const progress = (sequencesChecked / buyerResults.size * 100).toFixed(2);
            if (VERBOSE) {
                console.log(`Progress: ${progress}% (${sequencesChecked}/${buyerResults.size})`);
                console.log(`Current best: sequence=[${bestSequence}] bananas=${bestBananas}`);
            }
            lastProgress = Date.now();
        }

        // Sum up all the bananas we'd get from this sequence
        let totalBananas = 0;
        for (let [_buyerIndex, price] of buyerPrices) {
            totalBananas += price;
        }

        if (totalBananas > bestBananas) {
            bestBananas = totalBananas;
            bestSequence = sequence;
            if (VERBOSE) console.log(`New best found! Sequence=[${sequence}] Bananas=${totalBananas}`);
        }
    }

    if (VERBOSE) {
        console.log(`\nFinal Results:`);
        console.log(`Best sequence: [${bestSequence}] with ${bestBananas} bananas`);
    }
    return bestBananas;
}

function mutatePrice(price) {
    // Step 1: Multiply by 64, mix, and prune
    let newPrice = price * 64;
    price = ((price ^ newPrice) >>> 0) % 16777216;

    // Save a copy of the secret number before step 2
    let copyPrice = price;
    // Step 2: Divide by 32, mix, and prune
    newPrice = Math.floor(price / 32);
    price = ((copyPrice ^ newPrice) >>> 0) % 16777216;

    // Save a copy of the secret number before step 3
    copyPrice = price;
    // Step 3: Multiply by 2048, mix, and prune
    newPrice = price * 2048;
    price = ((copyPrice ^ newPrice) >>> 0) % 16777216;

    return price;
}

const VERBOSE = true; // Set false to deactivate logs

const correctResults = [23];
runDay(22, 2, loadData, processFunction, correctResults);