const blessed = require('blessed');
const fs = require('fs');
const path = require('path');

function loadFile(filePath) {
    return fs.readFileSync(filePath, 'utf8').trim().split('\n').map(row => row.split(''));
}

function findXCharacters(map, callback) {
    const xPositions = [];
    for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] === 'X') {
                xPositions.push({ x, y });
                callback(x, y);
            }
        }
    }
    return xPositions.length;
}

function visualizeXCharacters(map) {
    const screen = blessed.screen({
        smartCSR: true,
        title: 'X Character Visualization'
    });

    const gridBox = blessed.box({
        top: 0,
        left: 'center',
        width: map[0].length + 2,
        height: 'shrink',
        content: '',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'default'
        }
    });

    const speedBox = blessed.textbox({
        bottom: 0,
        left: 'center',
        width: '50%',
        height: 3,
        label: 'Enter Speed (ms)',
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'blue'
        }
    });

    screen.append(gridBox);
    screen.append(speedBox);

    function renderGrid() {
        const content = map.map(row => row.join('')).join('\n');
        gridBox.setContent(content);
        screen.render();
    }

    function updateGridContent(x, y) {
        map[y][x] = `{red-fg}X{/red-fg}`;
        renderGrid();
    }

    speedBox.on('submit', (value) => {
        const interval = parseInt(value, 10);
        let currentIndex = 0;
        const xPositions = [];
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y][x] === 'X') {
                    xPositions.push({ x, y });
                }
            }
        }
        const xCount = xPositions.length;

        function processNextX() {
            if (currentIndex < xCount) {
                const { x, y } = xPositions[currentIndex];
                updateGridContent(x, y);
                currentIndex++;
                setTimeout(processNextX, interval);
            } else {
                const resultBox = blessed.box({
                    top: 'center',
                    left: 'center',
                    width: '50%',
                    height: 3,
                    content: `Number of X's found: ${xCount}\nPress any key to end`,
                    border: {
                        type: 'line'
                    },
                    style: {
                        fg: 'white',
                        bg: 'green'
                    }
                });
                screen.append(resultBox);
                screen.render();
                screen.onceKey(['escape', 'q', 'C-c', 'enter', 'space'], () => process.exit(0));
            }
        }

        processNextX();
    });

    speedBox.focus();
    speedBox.readInput();
    renderGrid();

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
}

function showFileMenu() {
    const screen = blessed.screen({
        smartCSR: true,
        title: 'Select File'
    });

    const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.txt'));

    const list = blessed.list({
        top: 'center',
        left: 'center',
        width: '50%',
        height: files.length + 2,
        items: files,
        keys: true,
        border: {
            type: 'line'
        },
        style: {
            selected: {
                bg: 'blue'
            }
        }
    });

    list.on('select', (item) => {
        const filePath = path.join(__dirname, item.getText());
        const map = loadFile(filePath);
        screen.destroy();
        visualizeXCharacters(map);
    });

    screen.append(list);
    list.focus();
    screen.render();

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
}

showFileMenu();