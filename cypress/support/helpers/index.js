Cypress.on('window:before:load', (win) => {
    // Nonaktifkan context menu
    Object.defineProperty(win, 'oncontextmenu', {
        get: () => null,
        set: () => {},
    });

    // Stop event listener keydown
    win.document.addEventListener('keydown', (e) => {
        e.stopImmediatePropagation();
    }, true);

    // Nonaktifkan alert dan console
    win.console.log = () => {};
    win.console.warn = () => {};
    win.console.error = () => {};
    win.alert = () => {};

    // Hapus navigator.webdriver
    delete win.navigator.__proto__.webdriver;
});
