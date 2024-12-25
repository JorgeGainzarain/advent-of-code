const blessed = require('blessed');
const chalk = require('chalk');

// Create a screen object.
const screen = blessed.screen({
  smartCSR: true
});

screen.title = 'Christmas Message';

// Create a box that shrinks to fit the content and is centered.
const box = blessed.box({
  top: 'center',
  left: 'center',
  shrink: true,
  content: `
${chalk.green('           *')}
${chalk.green('          ***')}
${chalk.green('         *****')}
${chalk.green('        *******')}
${chalk.green('       *********')}
${chalk.green('      ***********')}
${chalk.green('     *************')}
${chalk.green('    ***************')}
${chalk.yellow('          ||')}

${chalk.white.bold(' ❄️  MERRY CHRISTMAS!  ❄️ ')}

${chalk.blue('    Happy Holidays! ')}
`,
  tags: true,
  border: {
    type: 'line'
  },
  style: {
    fg: 'white',
    border: {
      fg: '#f0f0f0'
    }
  }
});

// Append our box to the screen.
screen.append(box);

// Function to simulate falling snowflakes.
function createSnowflake() {
  const snowflake = blessed.box({
    top: 0,
    left: Math.floor(Math.random() * screen.width),
    width: 1,
    height: 1,
    content: '*',
    style: {
      fg: 'white'
    }
  });

  screen.append(snowflake);

  const interval = setInterval(() => {
    if (snowflake.top < screen.height - 1) {
      snowflake.top++;
      screen.render();
    } else {
      clearInterval(interval);
      screen.remove(snowflake);
    }
  }, 100);
}

// Create snowflakes at intervals.
setInterval(createSnowflake, 200);

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(_ch, _key) {
  return process.exit(0);
});

// Render the screen.
screen.render();