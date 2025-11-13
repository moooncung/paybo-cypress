describe('BO - Dashboard', () => {
    beforeEach(() => {
        // Login dan restore session
        cy.loginHelper();
        cy.logAction('✅ Session restored & user logged in');
    });

    it('Should can see the dashboard', () => {
        cy.logAction('➡️ Opening dashboard page');
        cy.visit('/demo_psp2/merchant/dashboard/dashboard-chart-v2');

        // Tunggu sampai elemen dashboard muncul
        cy.get('body', { timeout: 10000 })
            .should('contain.text', 'Dashboard')
            .then(() => cy.takeScreenshot('dashboard-page'));
    });

    it('Should get all card titles and values', () => {
        cy.visit('/demo_psp2/merchant/dashboard/dashboard-chart-v2');

        // Tunggu sampai card muncul
        cy.get('.card-body', { timeout: 20000 }).should('exist');

        cy.get('.card .card-body').each(($card) => {
            const title = $card.find('h5.card-title').text().trim();
            const value = $card.find('h1').text().trim();
            cy.log(`Title: ${title} | Value: ${value}`);
        });
    });

    it('Should get Account Balance value specifically', () => {
        cy.visit('/demo_psp2/merchant/dashboard/dashboard-chart-v2');

        cy.contains('Account Balance', { matchCase: false, timeout: 20000 })
            .closest('.card-body')
            .find('h1')
            .invoke('text')
            .then((text) => {
                const balance = parseFloat(text.replace(/[^0-9.-]/g, ''));
                cy.log(`Account Balance: ${balance}`);
                expect(balance).to.be.a('number');
            });
    });

    it('Should get all Total Accumulated Credits values', () => {
        cy.visit('/demo_psp2/merchant/dashboard/dashboard-chart-v2');

        cy.contains('Total Accumulated Credits', { matchCase: false, timeout: 20000 })
            .each(($el) => {
                cy.wrap($el)
                    .closest('.card-body')
                    .find('h1')
                    .invoke('text')
                    .then((text) => {
                        cy.log(`Credits: ${text.trim()}`);
                    });
            });
    });
});
