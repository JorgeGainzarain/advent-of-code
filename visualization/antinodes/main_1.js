const blessed = require('blessed');
const fs = require('fs');
const path = require('path');

function loadFile(data) {
    return data.trim().replace(/\r/g, '');
}

function findAntinodes(input, callback) {
    const grid = input.split('\n').map(line => line.split(''));
    const antennasByFrequency = {};

    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            if (grid[i][j] !== '.') {
                const freq = grid[i][j];
                if (!antennasByFrequency[freq]) {
                    antennasByFrequency[freq] = [];
                }
                antennasByFrequency[freq].push({ x: i, y: j });
            }
        }
    }

    const allAntinodes = new Set();
    const steps = [];

    for (const freq in antennasByFrequency) {
        const antennas = antennasByFrequency[freq];

        for (let i = 0; i < antennas.length; i++) {
            for (let j = i + 1; j < antennas.length; j++) {
                const a1 = antennas[i];
                const a2 = antennas[j];

                const dx = a2.x - a1.x;
                const dy = a2.y - a1.y;

                steps.push({ type: 'antenna', x: a1.x, y: a1.y, freq });
                steps.push({ type: 'antenna', x: a2.x, y: a2.y, freq });

                markAntinode(a1.x - dx, a1.y - dy, allAntinodes, grid, steps, freq);
                markAntinode(a2.x + dx, a2.y + dy, allAntinodes, grid, steps, freq);
            }
        }
    }

    callback(grid, steps, allAntinodes.size);
    return { grid, allAntinodes };
}

function markAntinode(x, y, antinodeSet, grid, steps, freq) {
    if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
        antinodeSet.add(`${x},${y}`);
        steps.push({ type: 'antinode', x, y, freq });
    }
}

function visualizeGrid(grid, steps, totalAntinodes) {
    const screen = blessed.screen({
        smartCSR: true,
        title: 'Antinodes Visualization'
    });

    const gridBox = blessed.box({
        top: 0,
        left: 'center',
        width: grid[0].length + 2, // Adjust width to fit the grid exactly
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

    const speedForm = blessed.form({
        parent: screen,
        bottom: 0,
        left: 'center',
        width: '50%',
        height: 5,
        keys: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'default',
            border: {
                fg: '#f0f0f0'
            }
        }
    });

    const speedLabel = blessed.text({
        parent: speedForm,
        top: 0,
        left: 2,
        content: 'Enter speed (ms):',
        style: {
            fg: 'white',
            bg: 'default'
        }
    });

    const speedInput = blessed.textbox({
        parent: speedForm,
        name: 'speed',
        top: 1,
        left: 2,
        height: 3,
        inputOnFocus: true,
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'default',
            border: {
                fg: '#f0f0f0'
            }
        }
    });

    speedInput.on('submit', value => {
        const speed = parseInt(value, 10);
        if (!isNaN(speed) && speed > 0) {
            speedForm.destroy();
            processNextStep(speed);
        } else {
            speedInput.focus();
        }
    });

    screen.append(gridBox);
    screen.append(speedForm);

    const colors = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];
    const antennaColors = {};
    let colorIndex = 0;

    function updateGridContent() {
        const content = grid.map(row => row.join('')).join('\n');
        gridBox.setContent(content);
        screen.render();
    }

    function highlightStep(step) {
        if (step.type === 'antenna') {
            if (!antennaColors[step.freq]) {
                antennaColors[step.freq] = colors[colorIndex % colors.length];
                colorIndex++;
            }
            const color = antennaColors[step.freq];
            grid[step.x][step.y] = `{${color}-fg}${grid[step.x][step.y]}{/${color}-fg}`;
        } else if (step.type === 'antinode') {
            const color = antennaColors[step.freq];
            grid[step.x][step.y] = `{${color}-bg}*{/${color}-bg}`;
        }
        updateGridContent();
    }

    let stepIndex = 0;
    function processNextStep(speed) {
        if (stepIndex < steps.length) {
            highlightStep(steps[stepIndex]);
            stepIndex++;
            setTimeout(() => processNextStep(speed), speed);
        } else {
            showTotalAntinodes(totalAntinodes);
        }
    }

    function showTotalAntinodes(total) {
        const totalBox = blessed.box({
            top: 'center',
            left: 'center',
            width: 'shrink',
            height: 'shrink',
            content: `Total unique antinodes: ${total}\nPress any key to exit.`,
            tags: true,
            border: {
                type: 'line'
            },
            style: {
                fg: 'white',
                bg: 'default'
            }
        });

        screen.append(totalBox);
        screen.render();

        screen.onceKey(['escape', 'q', 'C-c', 'enter', 'space'], () => process.exit(0));
    }

    updateGridContent();
    speedInput.focus();
    screen.render();

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
}

function showMenu() {
    const screen = blessed.screen({
        smartCSR: true,
        title: 'Select a Grid File'
    });

    const files = fs.readdirSync(__dirname).filter(file => path.extname(file) === '.txt');
    const listHeight = Math.min(files.length + 2, 20);

    const list = blessed.list({
        top: 'center',
        left: 'center',
        width: '50%',
        height: listHeight,
        items: files.map(file => file.replace('.txt', '')),
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

    list.on('select', (item, index) => {
        const filePath = path.join(__dirname, files[index]);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const input = loadFile(fileContent);
        screen.destroy();
        findAntinodes(input, visualizeGrid);
    });

    screen.append(list);
    list.focus();
    screen.render();

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
}

showMenu();