const blessed = require('blessed');
const fs = require('fs');
const path = require('path');

// Configuration object
const config = {
    guardSpeed: 50, // Speed of the guard in milliseconds
    dataFilePath: '', // Path to the data file
    screenOptions: {
        smartCSR: true
    },
    boxOptions: {
        top: 'center',
        left: 'center',
        width: '100%',
        height: '100%',
        content: '',
        tags: true,
        border: {
            type: 'line'
        },
        style: {
            border: {
                fg: '#f0f0f0'
            }
        }
    }
};

function parseInput(input) {
    const lines = input.split('\n').map(line => line.trim());
    let guardPosition = null;
    let guardDirection = null;
    const map = lines.map((line, y) => {
        return line.split('').map((char, x) => {
            if (char === '^' || char === '>' || char === 'v' || char === '<') {
                guardPosition = { x, y };
                guardDirection = char;
                return '.';
            }
            return char;
        });
    });
    return { map, guardPosition, guardDirection };
}

function turnRight(direction) {
    const directions = ['^', '>', 'v', '<'];
    const index = directions.indexOf(direction);
    return directions[(index + 1) % 4];
}

function moveForward(position, direction) {
    const moves = {
        '^': { x: 0, y: -1 },
        '>': { x: 1, y: 0 },
        'v': { x: 0, y: 1 },
        '<': { x: -1, y: 0 }
    };
    return {
        x: position.x + moves[direction].x,
        y: position.y + moves[direction].y
    };
}

function isWithinBounds(position, map) {
    return position.y >= 0 && position.y < map.length && position.x >= 0 && position.x < map[0].length;
}

function simulateGuard(map, guardPosition, guardDirection, drawStep) {
    const visited = new Set();
    visited.add(`${guardPosition.x},${guardPosition.y}`);
    let steps = 0;

    function step() {
        const nextPosition = moveForward(guardPosition, guardDirection);
        if (!isWithinBounds(nextPosition, map)) {
            return false;
        }
        if (map[nextPosition.y][nextPosition.x] === '#') {
            guardDirection = turnRight(guardDirection);
        } else {
            guardPosition = nextPosition;
            visited.add(`${guardPosition.x},${guardPosition.y}`);
        }
        drawStep(guardPosition, visited, guardDirection);
        steps++;
        return true;
    }

    return { step, getSteps: () => steps };
}

function drawMap(screen, map, visited, guardPosition, guardDirection) {
    const viewWidth = screen.width;
    const viewHeight = screen.height;
    const halfWidth = Math.floor(viewWidth / 1.5); // Increase the width around the guard
    const halfHeight = Math.floor(viewHeight / 1.5); // Increase the height around the guard

    const startX = Math.max(0, guardPosition.x - halfWidth);
    const startY = Math.max(0, guardPosition.y - halfHeight);
    const endX = Math.min(map[0].length, guardPosition.x + halfWidth);
    const endY = Math.min(map.length, guardPosition.y + halfHeight);

    const mapString = map.slice(startY, endY).map((row, y) => {
        return row.slice(startX, endX).map((cell, x) => {
            const actualX = startX + x;
            const actualY = startY + y;
            if (guardPosition.x === actualX && guardPosition.y === actualY) {
                let guardIcon;
                switch (guardDirection) {
                    case '^':
                        guardIcon = '{red-fg}↑{/red-fg}';
                        break;
                    case '>':
                        guardIcon = '{red-fg}→{/red-fg}';
                        break;
                    case 'v':
                        guardIcon = '{red-fg}↓{/red-fg}';
                        break;
                    case '<':
                        guardIcon = '{red-fg}←{/red-fg}';
                        break;
                }
                return guardIcon;
            } else if (visited.has(`${actualX},${actualY}`)) {
                return '{blue-fg}*{/blue-fg}';
            } else if (cell === '#') {
                return '{white-fg}#{/white-fg}';
            } else {
                return ' ';
            }
        }).join('');
    }).join('\n');

    screen.children[0].setContent(mapString);
    screen.render();
}

function processData(data) {
    const { map, guardPosition, guardDirection } = parseInput(data);
    const screen = blessed.screen(config.screenOptions);

    const box = blessed.box(config.boxOptions);

    screen.append(box);

    function drawStep(guardPosition, visited, guardDirection) {
        drawMap(screen, map, visited, guardPosition, guardDirection);
    }

    const { step, getSteps } = simulateGuard(map, guardPosition, guardDirection, drawStep);

    function animate() {
        if (step()) {
            setTimeout(animate, config.guardSpeed); // Use guard speed from config
        } else {
            const steps = getSteps();
            const messageBox = blessed.message({
                top: 'center',
                left: 'center',
                width: '50%',
                height: 'shrink',
                label: 'Simulation Complete',
                content: `Simulation complete. Guard took ${steps} steps.`,
                border: {
                    type: 'line'
                },
                style: {
                    border: {
                        fg: '#f0f0f0'
                    }
                }
            });

            screen.append(messageBox);
            messageBox.display(`Simulation complete. Guard took ${steps} steps.`, 0, () => {
                process.exit(0);
            });

            screen.key(['escape', 'q', 'C-c', 'enter', 'space'], function(_ch, _key) {
                screen.destroy();
                showMenu();
            });

            screen.render();
        }
    }

    animate();

    screen.key(['escape', 'q', 'C-c'], function(_ch, _key) {
        return process.exit(0);
    });

    screen.render();
}

function showMenu() {
    const screen = blessed.screen(config.screenOptions);

    const menu = blessed.list({
        top: 'center',
        left: 'center',
        width: '50%',
        height: '50%',
        items: [],
        keys: true,
        vi: true,
        style: {
            selected: {
                bg: 'blue'
            }
        }
    });

    const files = fs.readdirSync(path.resolve(__dirname, '')).filter(file => file.endsWith('.txt'));
    files.forEach(file => menu.addItem(file));

    const exitButton = blessed.button({
        top: '90%',
        left: 'center',
        width: '50%',
        height: 3,
        content: 'Exit',
        align: 'center',
        border: {
            type: 'line'
        },
        style: {
            border: {
                fg: '#f0f0f0'
            },
            focus: {
                bg: 'red'
            }
        }
    });

    screen.append(menu);
    screen.append(exitButton);

    menu.focus();

    menu.on('select', (item) => {
        config.dataFilePath = path.resolve(__dirname, '', item.getText());
        const data = fs.readFileSync(config.dataFilePath, 'utf-8');
        const { map, guardPosition, guardDirection } = parseInput(data);
        screen.destroy();
        showSpeedInput(map, guardPosition, guardDirection);
    });

    exitButton.on('press', () => {
        return process.exit(0);
    });

    screen.key(['escape', 'q', 'C-c'], function(_ch, _key) {
        return process.exit(0);
    });

    screen.render();
}

function showSpeedInput(map, guardPosition, guardDirection) {
    const screen = blessed.screen(config.screenOptions);

    const box = blessed.box(config.boxOptions);
    screen.append(box);

    function drawStep(guardPosition, visited, guardDirection) {
        drawMap(screen, map, visited, guardPosition, guardDirection);
    }

    drawStep(guardPosition, new Set(), guardDirection);

    const speedInput = blessed.textbox({
        top: '70%',
        left: 'center',
        width: '50%',
        height: 3,
        label: 'Guard Speed (ms)',
        inputOnFocus: true,
        border: {
            type: 'line'
        },
        style: {
            border: {
                fg: '#f0f0f0'
            }
        }
    });

    screen.append(speedInput);

    speedInput.focus();

    speedInput.on('submit', (value) => {
        config.guardSpeed = parseInt(value, 10);
        screen.destroy();
        processData(fs.readFileSync(config.dataFilePath, 'utf-8'));
    });


    screen.key(['escape', 'q', 'C-c'], function(_ch, _key) {
        return process.exit(0);
    });

    screen.render();
}

// Main execution
showMenu();