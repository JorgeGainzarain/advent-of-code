const runDay = require('../../functions/dayTemplate.js');

function loadData(data) {
    const patterns = data.replaceAll('\r', '').split('\n\n').map(pattern => pattern.split('\n'));
    const keys = [];
    const locks = [];

    patterns.forEach(pattern => {
        if (pattern[0] === '#####') {
            const lockPins = [];
            for (let col = 0; col < pattern[0].length; col++) {
                let count = 0;
                for (let row = 1; row < pattern.length; row++) {
                    if (pattern[row][col] === '#') count++;
                }
                lockPins.push(count);
            }
            locks.push(lockPins);
        } else if (pattern[pattern.length - 1] === '#####') {
            const keyPins = [];
            for (let col = 0; col < pattern[0].length; col++) {
                let count = 0;
                for (let row = 0; row < pattern.length - 1; row++) {
                    if (pattern[row][col] === '#') count++;
                }
                keyPins.push(count);
            }
            keys.push(keyPins);
        }
    });

    //console.log('Keys:', keys);
    //console.log('Locks:', locks);

    return { keys, locks };
}

function processFunction(data) {
    const { keys, locks } = data;

    let lockKeyPairs = 0;

    for (let lock of locks) {
        //console.log('Processing lock:', lock);
        for (let key of keys) {
            //console.log('  Against key:', key);
            let fits = true;
            for (let i = 0; i < lock.length; i++) {
                if (lock[i] + key[i] >= 6) {
                    fits = false;
                    break;
                }
            }
            if (fits) {
                //console.log('  Key fits lock');
                lockKeyPairs++;
            }
        }
    }
    //console.log('Total lock-key pairs:', lockKeyPairs);
    return lockKeyPairs;
}

const correctResults = [3];

runDay(25, 1, loadData, processFunction, correctResults);