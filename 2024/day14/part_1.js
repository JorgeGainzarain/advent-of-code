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
    for (let i = 0; i < 100; i++) {
        data.robots.forEach(robot => {
            robot.x = (robot.x + robot.vx + data.width) % data.width;
            robot.y = (robot.y + robot.vy + data.height) % data.height;
        });
    }
}

function getGrid(data) {
    const { width, height, robots } = data;
    let grid = [];

    // Initialize the grid with dots
    for (let i = 0; i < height; i++) {
        grid.push([]);
        for (let j = 0; j < width; j++) {
            grid[i].push('.');
        }
    }

    // Place the robots on the grid
    robots.forEach(robot => {
        const { x, y } = robot;
        if (grid[y][x] === '.') {
            grid[y][x] = '1';
        } else {
            grid[y][x] = (parseInt(grid[y][x]) + 1).toString();
        }
    });

    return grid;
}

function countRobotsInQuadrants(grid) {
    const height = grid.length;
    const width = grid[0].length;

    // Calculate the middle points
    const midX = Math.floor(width / 2);
    const midY = Math.floor(height / 2);

    // Initialize quadrant counts
    const quadrants = [0, 0, 0, 0];

    // Iterate through the grid
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            // Skip the middle lines and dots
            if (x === midX || y === midY || grid[y][x] === '.') continue;

            // Parse the number of robots on this tile
            const robotCount = parseInt(grid[y][x]);

            // Determine the quadrant
            if (x < midX && y < midY) {
                // Top-left quadrant
                quadrants[0] += robotCount;
            } else if (x >= midX && y < midY) {
                // Top-right quadrant
                quadrants[1] += robotCount;
            } else if (x < midX && y >= midY) {
                // Bottom-left quadrant
                quadrants[2] += robotCount;
            } else if (x >= midX && y >= midY) {
                // Bottom-right quadrant
                quadrants[3] += robotCount;
            }
        }
    }

    // Calculate the safety factor
    const safetyFactor = quadrants.reduce((acc, count) => acc * count, 1);

    return {
        quadrants: quadrants,
        safetyFactor: safetyFactor
    };
}

function processFunction(data) {
    simulateSeconds(data);

    let grid = getGrid(data);
    const result = countRobotsInQuadrants(grid);

    return result.safetyFactor;
}

const correctResults = [12];
runDay(14, 1, loadFunction, processFunction, correctResults);