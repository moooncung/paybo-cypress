import LoginHelper from '../../support/helpers/loginHelper';

describe('BO - Login Tests', () => {
  beforeEach(() => {
    cy.visit('/login');
    cy.logAction('Starting login test');
  });

  it('Should login with valid credentials', () => {
    cy.loginHelper(Cypress.env('username'), Cypress.env('password'));
    cy.takeScreenshot('successful-login');
  });

  it('Should show validation errors for empty fields', () => {
    cy.then(() => {
      const helper = new LoginHelper();
      helper.fillCredentials(null, null);
      helper.submitForm();
      helper.verifyLoginError();
    });
    cy.takeScreenshot('empty-fields-error');
  });

  it('Should show error for invalid credentials', () => {
    cy.then(() => {
      const helper = new LoginHelper();
      helper.fillCredentials('invalid@email.com', 'wrongpassword');
      helper.submitForm();
      helper.verifyLoginError('The provided credentials do not match our records.');
    });
    cy.takeScreenshot('invalid-credentials-error');
  });
});
