const runDay = require('../../functions/dayTemplate');


function loadData(data) {
    return data.split('\n').map(Number);
}

function processFunction(data) {
    let total = 0;
    for(let price of data) {
        let origPrice = price;
        for (let i = 0; i < 2000; i++) {
            price = mutatePrice(price);
        }
        total += price;
        console.log(origPrice + " : " + price);
    }
    return total;
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


const correctResults = [37327623]
runDay(22,1, loadData, processFunction, correctResults);