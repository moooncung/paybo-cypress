export default class LoginHelper {
    fillCredentials(username = Cypress.env('username'), password = Cypress.env('password')) {
        cy.get('#username').should('exist').then($username => {
            if (username) {
                cy.logAction(`Filling in username with ${username}`);
                cy.wrap($username).clear().type(username);
            } else {
                cy.wrap($username).clear();
            }
        });

        cy.get('#password').should('exist').then($password => {
            if (password) {
                cy.logAction(`Filling in password with ${password}`);
                cy.wrap($password).clear().type(password);
            } else {
                cy.wrap($password).clear();
            }
        });

        return this;
    }

    submitForm() {
        cy.get('body').then($body => {
            if ($body.find('.btn:contains("Login")').length > 0) {
                cy.get('.btn:contains("Login")').first().click();
            } else {
                cy.get('#password').type('{enter}');
            }
        });
        
        return this;
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

        cy.get(successIndicators.join(','), { timeout: 10000 })
            .first()
            .should('be.visible');
        
        return this;
    }

    verifyLoginError(expectedMessage = null) {
        const errorSelectors = [
            '[data-cy="error-message"]',
            '.error',
            '.alert-danger',
            '.invalid-feedback',
            '.form-error'
        ];

        const selector = errorSelectors.join(',');
        cy.get(selector).should('exist').and('be.visible');

        if (expectedMessage) {
            cy.get(selector).first().should('contain.text', expectedMessage);
        }
        
        return this;
    }
}

export function loginCommands(Cypress) {
    Cypress.Commands.add('loginHelper', (email = null, password = null) => {
        const user = {
            email: email || Cypress.env('username'),
            password: password || Cypress.env('password'),
        };

        cy.session(`login-${user.email}`, () => {
            cy.visit('/login');
            
            const helper = new LoginHelper();
            helper
                .fillCredentials(user.email, user.password)
                .submitForm()
                .verifySuccessfulLogin();
        });
    });

    Cypress.Commands.add('submitLogin', () => {
        return new LoginHelper().submitForm();
    });

    Cypress.Commands.add('verifyLoginSuccess', () => {
        return new LoginHelper().verifySuccessfulLogin();
    });

    Cypress.Commands.add('verifyLoginError', (msg = null) => {
        return new LoginHelper().verifyLoginError(msg);
    });
}