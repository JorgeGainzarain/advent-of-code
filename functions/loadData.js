const fs = require('fs');
const path = require('path');

function loadData(dirPath, loadFunction, currentPart) {
    const files = fs.readdirSync(dirPath);

    const partPattern = /part_(\d+)\.txt$/;

    const filteredFiles = files.filter(file => {
        if (path.extname(file) !== '.txt') {
            return false;
        }
        const match = file.match(partPattern);
        if (match) {
            const partNumber = parseInt(match[1], 10);
            return partNumber === currentPart;
        }
        return true;
    });

    //console.log(filteredFiles);

    return filteredFiles.map(file => {
        const filePath = path.join(dirPath, file);
        const data = fs.readFileSync(filePath, 'utf8');
        data.replaceAll('\r', '');
        if (data.trim() === '') {
            return null; // Return null if the file is empty
        }
        return loadFunction(data);
    });
}

module.exports = loadData;