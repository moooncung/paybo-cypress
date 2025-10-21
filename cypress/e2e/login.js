describe('Login Test', () => {
  it('should login successfully and verify homepage', () => {
    const username = Cypress.env('username');
    const password = Cypress.env('password');
    const url = Cypress.env('apiUrl');

    // buka halaman login
    cy.visit(url);

    // tunggu input email muncul dan ketik
    cy.get('input[name="email"]', { timeout: 15000 })
      .should('be.visible')
      .as('emailInput');
    cy.get('@emailInput').type(username, { delay: 50 });

    // tunggu input password muncul dan ketik
    cy.get('input[name="password"]', { timeout: 15000 })
      .should('be.visible')
      .as('passwordInput');
    cy.get('@passwordInput').type(password, { delay: 50, force: true });

    // klik tombol login
    cy.get('button[type="submit"]', { timeout: 15000 })
      .should('be.visible')
      .click({ force: true });

    // tunggu URL berubah dari halaman login
    cy.url({ timeout: 20000 }).should('not.include', '/login');

    cy.log('Login berhasil dan homepage terlihat');
  });
});
