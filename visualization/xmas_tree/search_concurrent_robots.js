const fs = require('fs');
const path = require('path');
const blessed = require('blessed');

function loadRobotsFromFile(filePath) {
    const data = fs.readFileSync(filePath, 'utf8').split('\n');
    const robots = data.map(line => {
        const [p, v] = line.split(' ');
        const [px, py] = p.slice(2).split(',').map(Number);
        const [vx, vy] = v.slice(2).split(',').map(Number);
        return { x: px, y: py, vx, vy };
    });

    const minX = Math.min(...robots.map(r => r.x));
    const maxX = Math.max(...robots.map(r => r.x));
    const minY = Math.min(...robots.map(r => r.y));
    const maxY = Math.max(...robots.map(r => r.y));

    const w = maxX - minX + 1;
    const h = maxY - minY + 1;

    return { robots, w, h };
}

function displayGrid(gridBox, robots, w, h, startX, startY, subW, subH, foundSegment) {
    let content = '';
    for (let y = startY; y < startY + subH; y++) {
        for (let x = startX; x < startX + subW; x++) {
            const robot = robots.find(r => r.x === x && r.y === y);
            if (foundSegment.some(([fx, fy]) => fx === x && fy === y)) {
                content += '{green-fg}@{/green-fg}';
            } else {
                content += robot ? '@' : ' ';
            }
        }
        content += '\n';
    }
    gridBox.setContent(content);
    gridBox.screen.render();
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

function showMenu(screen) {
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

        const consecutiveInput = blessed.textbox({
            parent: form,
            label: 'Consecutive:',
            top: 3,
            left: 1,
            width: '90%',
            height: 3,
            border: 'line',
            inputOnFocus: true
        });

        const submitButton = blessed.button({
            parent: form,
            content: 'Start',
            top: 7,
            left: 'center',
            shrink: true,
            padding: {
                top: 1,
                bottom: 1,
                left: 2,
                right: 2
            },
            border: {
                type: 'line'
            },
            style: {
                bg: 'none',
                fg: 'white',
                focus: {
                    bg: 'none',
                    fg: 'red'
                }
            }
        });

        submitButton.on('press', () => {
            form.submit();
        });

        form.on('submit', () => {
            const subW = 100;
            const subH = 35;
            const consecutive = parseInt(consecutiveInput.getValue(), 10) || 7;
            screen.remove(form);
            resolve({ subW, subH, consecutive });
        });

        consecutiveInput.key('enter', () => {
            form.submit();
        });

        consecutiveInput.focus();
        screen.render();
    });

}

const MAX_SECONDS = 20000; // Maximum number of seconds to simulate

async function simulateSeconds(screen, gridBox, robots, w, h, subW, subH, consecutive) {
    let second = 0;
    const loadingMessage = blessed.text({
        top: 'center',
        left: 'center',
        content: '',
        style: {
            fg: 'white'
        }
    });
    screen.append(loadingMessage);

    while (second < MAX_SECONDS) { // Add a condition to break out of the loop
        // Move robots
        robots.forEach(robot => {
            robot.x = (robot.x + robot.vx + w) % w;
            robot.y = (robot.y + robot.vy + h) % h;
        });

        // Check for consecutive robots
        const grid = Array.from({ length: h }, () => Array(w).fill(0));
        robots.forEach(robot => {
            grid[robot.y][robot.x]++;
        });

        let foundConsecutive = false;
        let centerX = 0, centerY = 0;
        let foundSegment = [];

        // Check columns only
        for (let x = 0; x < w; x++) {
            let count = 0;
            let segmentStart = 0;
            for (let y = 0; y < h; y++) {
                if (grid[y][x] > 0) {
                    if (count === 0) segmentStart = y;
                    count++;
                    if (count >= consecutive) {
                        foundConsecutive = true;
                        centerX = x;
                        centerY = Math.floor((segmentStart + y) / 2);
                        foundSegment = Array.from({ length: count }, (_, i) => [x, segmentStart + i]);
                    }
                } else {
                    count = 0;
                }
            }
            if (foundConsecutive) break;
        }

        if (foundConsecutive) {
            const startX = Math.max(0, centerX - Math.floor(subW / 2));
            const startY = Math.max(0, centerY - Math.floor(subH / 2));
            displayGrid(gridBox, robots, w, h, startX, startY, subW, subH, foundSegment);
            const message = blessed.text({
                top: '100%-1',
                left: 'center',
                content: `Found ${foundSegment.length} consecutive robots at second ${second + 1}. Press any key to continue...`,
                style: {
                    fg: 'white'
                }
            });
            screen.append(message);
            screen.render();
            await new Promise(resolve => screen.onceKey(['enter', 'space'], async () => {
                screen.remove(message);
                gridBox.setContent('');
                loadingMessage.setContent(`Searching for Tree... Second: ${second}`);
                screen.render();
                await new Promise(res => setTimeout(res, 100));
                loadingMessage.setContent('');
                screen.render();
                resolve();
            }));
        }

        second++;

        if (second % 100 === 0) {
            loadingMessage.setContent(`Searching for Tree... Second: ${second}`);
            screen.render();
            await new Promise(resolve => setTimeout(resolve, 100));
            loadingMessage.setContent('');
            screen.render();
        }
    }

    loadingMessage.setContent('Simulation ended.');
    screen.render();
}

(async () => {
    const screen = blessed.screen({
        smartCSR: true,
        title: 'Robot Simulation',
        tags: true // Enable tags for the screen
    });

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));

    const gridBox = blessed.box({
        parent: screen,
        top: 'center',
        left: 'center',
        width: '90%',
        height: '90%',
        border: {
            type: 'line'
        },
        style: {
            border: {
                fg: 'white'
            }
        },
        tags: true // Enable tags for the grid box
    });

    const files = fs.readdirSync(__dirname).filter(file => file.endsWith('.txt'));
    const selectedFile = await showFileMenu(screen, files);
    const { robots, w, h } = loadRobotsFromFile(path.resolve(__dirname, selectedFile));
    const { subW, subH, consecutive } = await showMenu(screen);
    simulateSeconds(screen, gridBox, robots, w, h, subW, subH, consecutive);
})();