const runDay = require('../../functions/dayTemplate');

function loadFunction(data) {
    // Split the data into lines
    const lines = data.split('\n').filter(line => line.trim() !== '');

    // Parse the remaining lines to get the robots' positions and speeds
    let robots = lines.map(line => {
        const parts = line.split(' ');
        const position = parts[0].split('=')[1].split(',').map(x => parseInt(x));
        const speed = parts[1].split('=')[1].split(',').map(x => parseInt(x));
        return { x: position[0], y: position[1], vx: speed[0], vy: speed[1] };
    });

    // Calculate the grid width and height from the robot positions
    const minX = Math.min(...robots.map(r => r.x));
    const maxX = Math.max(...robots.map(r => r.x));
    const minY = Math.min(...robots.map(r => r.y));
    const maxY = Math.max(...robots.map(r => r.y));

    const width = maxX - minX + 1;
    const height = maxY - minY + 1;

    return { width, height, robots };
}

function simulateSeconds(data) {
    const { width, height, robots } = data;
    let second = 0;
    while (true) {
        // Move robots
        robots.forEach(robot => {
            robot.x = (robot.x + robot.vx + width) % width;
            robot.y = (robot.y + robot.vy + height) % height;
        });

        // Check for 10 or more consecutive robots in a column
        const grid = Array.from({ length: height }, () => Array(width).fill('.'));
        robots.forEach(robot => {
            grid[robot.y][robot.x] = grid[robot.y][robot.x] === '.' ? '1' : (parseInt(grid[robot.y][robot.x]) + 1).toString();
        });

        let foundConsecutive = false;

        // Check columns
        for (let x = 0; x < width; x++) {
            let count = 0;
            for (let y = 0; y < height; y++) {
                if (grid[y][x] !== '.') {
                    count++;
                    if (count >= 10) {
                        foundConsecutive = true;
                        break;
                    }
                } else {
                    count = 0;
                }
            }
            if (foundConsecutive) break;
        }

        if (foundConsecutive) {
            console.log(`Found 10 or more consecutive robots at second ${second + 1}`);
            return second + 1;
        }

        second++;
    }
}

// Note: I didn't actually solve it with this, I used the visualization in the folder visualization.
// My first approach was to find robots that had 6 or more robots in a row either vertically or horizontally and it worked after a few false positives.
// However, I noticed if I search for patters of 10 vertically it finds the correct answer in the first try.
// So in this script it just searches for the first one with 10 consecutive robots in a column.

// For a more visual way of visualizing this go to visualization/xmas_tree and run the main.js file.

const correctResults = [];
runDay(14, 2, loadFunction, simulateSeconds, correctResults);