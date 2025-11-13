class LoginHelper {
    fillCredentials(username = Cypress.env('username'), password = Cypress.env('password')) {
        cy.get('body').then(($body) => {
            if ($body.find('#username').length > 0) {
                if (username) {
                    cy.logAction('Filling in username with ' + username);
                    cy.get('#username').clear().type(username);
                } else {
                    cy.get('#username').clear();
                }
            } else {
                throw new Error('Username field not found');
            }

            if ($body.find('#password').length > 0) {
                if (password) {
                    cy.logAction('Filling in password with ' + password);
                    cy.get('#password').clear().type(password);
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
            const loginButton = $body.find('.btn:contains("Login")');
            if (loginButton.length > 0) {
                cy.wrap(loginButton).click();
            } else {
                cy.get('#password').type('{enter}');
            }
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
            '[data-cy="error-message"]',
            '.error',
            '.alert-danger',
            '.invalid-feedback',
            '.form-error'
        ];

        cy.get('body').then(($body) => {
            const found = errorSelectors.some(selector => $body.find(selector).length > 0);
            expect(found, 'Error message found').to.be.true;

            if (expectedMessage) {
                cy.get(errorSelectors.join(',')).should('contain.text', expectedMessage);
            }
        });
    }
}

export default LoginHelper;
