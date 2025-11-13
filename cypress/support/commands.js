// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// Import helper
import { loginCommands } from './helpers/loginHelper';
import { IPWhitelistCommands } from './helpers/ipWhitelistHelper';

loginCommands(Cypress);
IPWhitelistCommands(Cypress);

Cypress.on('uncaught:exception', () => false);

// ===================== Logging =====================
Cypress.Commands.add('takeScreenshot', (name) => {
    const getLocalTimestamp = () => {
    const d = new Date(Date.now() + 7 * 60 * 60 * 1000); // GMT+7
    return d.toISOString()
        .replace('T', ' ')
        .replace(/\..+/, '')
        .replace(/:/g, '-');
    };
    cy.screenshot(`${getLocalTimestamp()}-${name}`, { capture: 'fullPage' });
});

Cypress.Commands.add('logAction', (msg, data = null) => {
    cy.task('log', `[${new Date().toISOString()}] ${msg}`);
    if (data) cy.task('log', JSON.stringify(data, null, 2));
});