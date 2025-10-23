// LoginHelper.js
class LoginHelper {
    fillCredentials(email, password) {
        const emailSelectors = ['[name="email"]', '#username', '.username'];
        const passwordSelectors = ['[name="password"]', 'input[type="password"]', '#password'];

        cy.get('body').then(($body) => {
            // Email
            let emailFilled = false;
            emailSelectors.forEach(selector => {
                if (!emailFilled && $body.find(selector).length > 0) {
                    if (email !== null && email !== undefined) { // hanya type kalau ada value
                        cy.get(selector).clear().type(email);
                    } else {
                        cy.get(selector).clear();
                    }
                    emailFilled = true;
                }
            });

            // Password
            let passwordFilled = false;
            passwordSelectors.forEach(selector => {
                if (!passwordFilled && $body.find(selector).length > 0) {
                    if (password !== null && password !== undefined) {
                        cy.get(selector).clear().type(password);
                    } else {
                        cy.get(selector).clear();
                    }
                    passwordFilled = true;
                }
            });

            if (!emailFilled || !passwordFilled) {
                throw new Error('Could not find email or password fields');
            }
        });

        return this;
    }


    submitForm() {
        const submitSelectors = [
            '[data-cy="login-button"]',
            'button[type="submit"]',
            'input[type="submit"]',
            'button:contains("Login")',
            'button:contains("Sign In")'
        ];

        cy.get('body').then(($body) => {
            let submitted = false;
            submitSelectors.forEach(selector => {
                if (!submitted && $body.find(selector).length > 0) {
                    cy.get(selector).click();
                    submitted = true;
                }
            });

            if (!submitted) {
                cy.get('input[type="password"]').type('{enter}');
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
