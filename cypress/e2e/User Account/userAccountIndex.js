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
        cy.loginHelper();
        cy.logAction('✅ Session restored & user logged in');
    });

    it('Should can see the dashboard', () => {
        cy.logAction('➡️ Find User Account Menu');
        visitDashboard();
        cy.get('.c-show')
        .contains('User Account')
        .should('be.visible');
        cy.logAction('✅ User Account Menu is visible');
    });

    it('Should can see change password', () => {
        cy.logAction('➡️ Find Change Password Menu');
        visitDashboard();
        clickMenuAndAssert('Change Password', '/password');
        cy.logAction('✅ Change Password Menu is visible');
    });

    it('Should can see role permission', () => {
        cy.logAction('➡️ Find Role Permission Menu');
        visitDashboard();
        clickMenuAndAssert('Role Permission', '/role-permission', 'Role Permission');
        cy.logAction('✅ Role Permission page is visible');
    });

    it('Should can see sub account', () => {
        cy.logAction('➡️ Find Sub Account Menu');
        visitDashboard();
        clickMenuAndAssert('Sub Account', '/user', 'Sub Account');
        cy.logAction('✅ Sub Account page is visible');
    });
});
