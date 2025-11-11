// LoginHelper.js
class LoginHelper {
    fillCredentials(email, password) {
        cy.get('body').then(($body) => {
            if ($body.find('#username').length > 0) {
                if (email !== null && email !== undefined) {
                    cy.get('#username').type(email);
                } else {
                    cy.get('#username').clear();
                }
            } else {
                throw new Error('Email field not found');
            }

            if ($body.find('#password').length > 0) {
                if (password !== null && password !== undefined) {
                    cy.get('#password').type(password);
                } else {
                    cy.get('#password').clear();
                }
            } else {
                throw new Error('Password field not found');
            }
        });

        return this;
    }

    submitForm() {
        cy.get('body').then(($body) => {
            let submitted = false;
            cy.get('.btn').contains('Login').then($btn => {
                if ($btn.length > 0) {
                    cy.wrap($btn).click();
                    submitted = true;
                } else {
                    cy.get('#password').type('{enter}');
                }
            });
        });
    }

    verifySuccessfulLogin() {
        const successIndicators = [
            '[data-cy="dashboard"]',
            '.dashboard',
            '.main-content',
            'nav',
            '.sidebar',
            'body:contains("Dashboard")',
            'body:contains("Welcome")'
        ];

        cy.get('body').then(($body) => {
            let found = false;
            successIndicators.forEach(selector => {
                if (!found && $body.find(selector).length > 0) {
                    cy.get(selector, { timeout: 10000 }).should('be.visible');
                    found = true;
                }
            });
        });
    }

    verifyLoginError(expectedMessage = null) {
        const errorSelectors = [
            '[data-cy="error-message"]', '.error', '.alert-danger', '.invalid-feedback', '.form-error'
        ];

        cy.get('body').then(($body) => {
            let found = false;
            errorSelectors.forEach(selector => {
                if (!found && $body.find(selector).length > 0) {
                    const errorEl = cy.get(selector).should('be.visible');
                    if (expectedMessage) {
                        errorEl.should('contain.text', expectedMessage);
                    }
                    found = true;
                }
            });
        });
    }
}

export default LoginHelper;
