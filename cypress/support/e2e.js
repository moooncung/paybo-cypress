// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';
import './helpers/index';
import 'cypress-mochawesome-reporter/register';
import '@cypress/grep';

// Global configuration
Cypress.config('defaultCommandTimeout', Cypress.env('defaultTimeout') || 10000);

// Hide XHR logs for cleaner test runs
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
    const style = app.document.createElement('style');
    style.innerHTML = `
        .command-name-request, 
        .command-name-xhr, 
        .command-name-route { 
        display: none 
        }
    `;
    style.setAttribute('data-hide-command-log-request', '');
    app.document.head.appendChild(style);
}

Cypress.on('uncaught:exception', (err, runnable) => {
    cy.task('log', `Uncaught exception: ${err.message}`);
    
    const ignoredErrors = [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'Script error',
        'Network request failed'
    ];
    
    return !ignoredErrors.some(errorMsg => err.message.includes(errorMsg));
});

beforeEach(() => {
    cy.viewport(1280, 720);
    
    cy.clearCookies();
    cy.clearLocalStorage();
    
    cy.intercept('GET', '**/api/**').as('apiCall');
});

afterEach(function() {
    // Take screenshot on failure
    if (this.currentTest.state === 'failed' && Cypress.env('screenshotOnFail')) {
        const testName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '-');
        cy.takeScreenshot(`failed-${testName}`);
    }
});