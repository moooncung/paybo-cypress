describe('BO - User Account', () => {
    const visitDashboard = () => {
        cy.visit('/demo_psp2/merchant/dashboard/dashboard-chart-v2');
        cy.get('.c-sidebar-nav-dropdown-toggle')
        .contains('User Account')
        .click();
    };

    const clickMenuAndAssert = (menuText, urlInclude, cardHeaderText) => {
        cy.contains(menuText).click();

        if (cardHeaderText) {
            cy.get('.card-header').then(($el) => {
                const text = $el.text();
                expect(text).to.include(cardHeaderText);
            });
        }

        if (urlInclude) {
            cy.url().should('include', urlInclude);
        }

        cy.logAction(`✅ ${menuText} page is visible`);
    };

    beforeEach(() => {
        // Login dan restore session
        cy.loginHelper(Cypress.env('username'), Cypress.env('password'));
        cy.logAction('✅ Session restored & user logged in');
    });

    it('Should can see the dashboard', () => {
        cy.logAction('➡️ User Account Access');
        visitDashboard();
        cy.get('.c-show')
        .contains('User Account')
        .should('be.visible');
        cy.logAction('✅ User Account Menu is visible');
    });

    it('Should can see change password', () => {
        cy.logAction('➡️ Change Password Access');
        visitDashboard();
        clickMenuAndAssert('Change Password', '/password');
    });

    it('Should can see role permission', () => {
        cy.logAction('➡️ Role Permission Access');
        visitDashboard();
        clickMenuAndAssert('Role Permission', '/role-permission', 'Role Permission');
    });

    it('Should can see sub account', () => {
        cy.logAction('➡️ Sub Account Access');
        visitDashboard();
        clickMenuAndAssert('Sub Account', '/user', 'Sub Account');
    });
});
