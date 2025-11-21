describe('BO - Block Reference', () => {
    const visitDashboard = () => {
        cy.visit('/demo_psp2/merchant/dashboard/dashboard-chart-v2');
        cy.get('.c-sidebar-nav-dropdown-toggle')
        .contains('Automation Settings')
        .click();
    };

    beforeEach(() => {
        cy.loginHelper();
        cy.logAction('✅ Session restored & user logged in');
    });

    it('Should can see the blocked reference list', () => {
        cy.logAction('➡️ Find Block Reference Menu');
        visitDashboard();
        cy.get('.c-show')
            .contains('Block reference')
            .should('be.visible')
            .click();
        cy.logAction('✅ Block Reference Menu is visible');
    });
});


