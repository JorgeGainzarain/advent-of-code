const path = require('path');
const fs = require('fs');
const cliProgress = require('cli-progress');
const blessed = require('blessed');

const GRID_SIZE = 35;

// Load and parse the data
function loadFunction(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    let robots = lines.map(line => {
        const parts = line.split(' ');
        const position = parts[0].split('=')[1].split(',').map(x => parseInt(x));
        const speed = parts[1].split('=')[1].split(',').map(x => parseInt(x));
        return { x: position[0], y: position[1], vx: speed[0], vy: speed[1] };
    });

    const minX = Math.min(...robots.map(r => r.x));
    const maxX = Math.max(...robots.map(r => r.x));
    const minY = Math.min(...robots.map(r => r.y));
    const maxY = Math.max(...robots.map(r => r.y));

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    return { width, height, robots };
}

// Simulate robot movements over a number of iterations
function simulateSeconds(data, iterations) {
    const { width, height, robots } = data;
    for (let i = 0; i < iterations; i++) {
        robots.forEach(robot => {
            robot.x = (robot.x + robot.vx + width) % width;
            robot.y = (robot.y + robot.vy + height) % height;
        });
    }
}

// Create a grid representation of the robot positions
function getGrid(data) {
    const { width, height, robots } = data;
    let grid = Array.from({ length: height }, () => Array(width).fill('.'));
    robots.forEach(robot => {
        const { x, y } = robot;
        grid[y][x] = '@';
    });
    return grid;
}

// Count robots in each quadrant and calculate a safety factor
function countRobotsInQuadrants(grid) {
    const height = grid.length;
    const width = grid[0].length;
    const midX = Math.floor(width / 2);
    const midY = Math.floor(height / 2);
    const quadrants = [0, 0, 0, 0];

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (x === midX || y === midY || grid[y][x] === '.') continue;
            if (grid[y][x] === '@') {
                if (x < midX && y < midY) {
                    quadrants[0]++;
                } else if (x >= midX && y < midY) {
                    quadrants[1]++;
                } else if (x < midX && y >= midY) {
                    quadrants[2]++;
                } else if (x >= midX && y >= midY) {
                    quadrants[3]++;
                }
            }
        }
    }

    return quadrants.reduce((acc, count) => acc * count, 1);
}

function findDenseArea(grid) {
    const height = grid.length;
    const width = grid[0].length;
    let maxRobots = 0;
    let centerX = 0;
    let centerY = 0;

    for (let y = 0; y < height - GRID_SIZE; y++) {
        for (let x = 0; x < width - GRID_SIZE; x++) {
            let robotCount = 0;
            for (let i = 0; i < GRID_SIZE; i++) {
                for (let j = 0; j < GRID_SIZE; j++) {
                    if (grid[y + i][x + j] === '@') {
                        robotCount++;
                    }
                }
            }
            if (robotCount > maxRobots) {
                maxRobots = robotCount;
                centerX = x + Math.floor(GRID_SIZE / 2);
                centerY = y + Math.floor(GRID_SIZE / 2);
            }
        }
    }

    return { centerX, centerY };
}

function getCenteredGrid(grid, centerX, centerY) {
    const centeredGrid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill('.'));
    const startX = Math.max(0, centerX - Math.floor(GRID_SIZE / 2));
    const startY = Math.max(0, centerY - Math.floor(GRID_SIZE / 2));

    for (let y = 0; y < GRID_SIZE; y++) {
        for (let x = 0; x < GRID_SIZE; x++) {
            if (startY + y < grid.length && startX + x < grid[0].length) {
                centeredGrid[y][x] = grid[startY + y][startX + x];
            }
        }
    }

    return centeredGrid;
}

function processFunction(data) {
    console.clear();
    const { width, height } = data;
    const iterations = width * height;
    const safetyFactors = [];
    let lowestSafetyFactor = Infinity;
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    bar.start(iterations, 0);

    for (let i = 1; i <= iterations; i++) {
        simulateSeconds(data, 1);
        const grid = getGrid(data);
        const safetyFactor = countRobotsInQuadrants(grid);
        if (safetyFactor < lowestSafetyFactor) {
            safetyFactors.push({ iteration: i, safetyFactor, grid });
            lowestSafetyFactor = safetyFactor;
        }
        bar.update(i);
    }
    bar.stop();

    const topDeviations = safetyFactors.slice(-10);
    topDeviations.reverse();

    // Create a screen object.
    const screen = blessed.screen({
        smartCSR: true
    });

    screen.title = 'Top 10 Iterations with Lowest Safety Factors';

    let currentIndex = 0;

    function renderSolutions() {
        while (layout.children.length) {
            layout.children[0].detach();
        }

        for (let i = 0; i < 2; i++) {
            if (currentIndex + i >= topDeviations.length) break;
            const f = topDeviations[currentIndex + i];
            const { centerX, centerY } = findDenseArea(f.grid);
            const centeredGrid = getCenteredGrid(f.grid, centerX, centerY);
            const gridText = centeredGrid.map(row => row.join(' ')).join('\n');
            const content = `Top ${currentIndex + i + 1}\nIteration: ${f.iteration}\nSafety Factor: ${f.safetyFactor}\n\n${gridText}`;
            const contentHeight = content.split('\n').length;

            const box = blessed.box({
                parent: layout,
                row: 0,
                col: i,
                width: '50%',
                height: contentHeight,
                content: content,
                tags: true,
                border: {
                    type: 'line'
                },
                style: {
                    border: {
                        fg: '#f0f0f0'
                    }
                }
            });
        }

        screen.render();
    }

    // Create a grid layout
    const layout = blessed.layout({
        parent: screen,
        width: '100%',
        height: '100%',
        layout: 'grid',
        rows: 1,
        cols: 2
    });

    // Create a button to navigate to the next 2 solutions
    const nextButton = blessed.button({
        parent: screen,
        right: 0,
        top: 0,
        width: 10,
        height: 3,
        content: 'Next',
        align: 'center',
        valign: 'middle',
        border: {
            type: 'line'
        },
        style: {
            fg: 'white',
            bg: 'blue',
            focus: {
                bg: 'red'
            }
        },
        focusable: true
    });

    nextButton.on('press', () => {
        currentIndex += 2;
        if (currentIndex >= topDeviations.length) {
            currentIndex = 0;
        }
        renderSolutions();
    });

    screen.append(nextButton);
    nextButton.focus();

    // Quit on Escape, q, or Control-C.
    screen.key(['escape', 'q', 'C-c'], function(_ch, _key) {
        return process.exit(0);
    });

    renderSolutions();
    screen.render();

    return safetyFactors;
}

function showFileMenu(screen, files) {
    return new Promise(resolve => {
        const form = blessed.form({
            parent: screen,
            top: 'center',
            left: 'center',
            width: '50%',
            height: '50%',
            keys: true,
            vi: true,
            border: 'line',
            style: {
                border: {
                    fg: 'white'
                }
            }
        });

        const fileList = blessed.list({
            parent: form,
            label: 'Select File:',
            top: 1,
            left: 1,
            width: '90%',
            height: '90%',
            border: 'line',
            items: files.map(file => file.replace('.txt', '')),
            keys: true,
            vi: true,
            style: {
                selected: {
                    bg: 'blue'
                }
            }
        });

        fileList.on('select', (item, index) => {
            const selectedFile = files[index];
            screen.remove(form);
            resolve(selectedFile);
        });

        fileList.focus();
        screen.render();
    });
}

// List files in the current directory and allow selection
function selectFile() {
    const screen = blessed.screen({
        smartCSR: true
    });

    fs.readdir(__dirname, (err, files) => {
        if (err) throw err;
        const txtFiles = files.filter(file => file.endsWith('.txt'));
        showFileMenu(screen, txtFiles).then(selectedFile => {
            const data = loadFunction(fs.readFileSync(path.join(__dirname, selectedFile), 'utf8'));
            processFunction(data);
        });
    });
}

selectFile();