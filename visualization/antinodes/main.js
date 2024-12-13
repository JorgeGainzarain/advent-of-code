const blessed = require('blessed');

function showMenu() {
    const screen = blessed.screen({
        smartCSR: true,
        title: 'Select Part'
    });

    const list = blessed.list({
        top: 'center',
        left: 'center',
        width: '50%',
        height: 4,
        items: ['Part 1', 'Part 2'],
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
        const script = index === 0 ? './main_1' : './main_2';
        try {
            require(script);
        } catch (error) {
            console.error(`Error loading ${script}:`, error);
        }
        screen.destroy();
    });

    screen.append(list);
    list.focus();
    screen.render();

    screen.key(['escape', 'q', 'C-c'], () => process.exit(0));
}

showMenu();