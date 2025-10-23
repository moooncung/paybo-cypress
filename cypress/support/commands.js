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
import LoginHelper from './helpers/loginHelper';

// Inisialisasi helper
const loginHelper = new LoginHelper();

Cypress.on('uncaught:exception', () => false);

Cypress.Commands.add('loginHelper', (email = null, password = null) => {
    const user = {
        email: email || Cypress.env('username'),
        password: password || Cypress.env('password'),
    };

    cy.session(`login-${user.email}`, () => {
        cy.visit('/login'); // URL login
        cy.then(() => {
        loginHelper.fillCredentials(user.email, user.password);
        loginHelper.submitForm();
        loginHelper.verifySuccessfulLogin();
        });
    });

    // Return helper supaya bisa chaining
    return cy.wrap(loginHelper);
});

Cypress.Commands.add('submitLogin', () => {
    return loginHelper.submitForm();
});

Cypress.Commands.add('verifyLoginSuccess', () => {
    return loginHelper.verifySuccessfulLogin();
});

Cypress.Commands.add('verifyLoginError', (msg = null) => {
    return loginHelper.verifyLoginError(msg);
});

// ===================== API, CHECK & LOGGING =====================
Cypress.Commands.add('takeScreenshot', (name) => {
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    cy.screenshot(`${name}-${ts}`);
});

Cypress.Commands.add('logAction', (msg, data = null) => {
    cy.task('log', `[${new Date().toISOString()}] ${msg}`);
    if (data) cy.task('log', JSON.stringify(data, null, 2));
});
