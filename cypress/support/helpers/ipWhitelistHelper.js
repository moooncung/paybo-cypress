class IPWhitelist {
    fillTheData() {
        cy.get('#addIP > .modal-body').then(($body) => {
            cy.get('#ip').type('127.0.0.1');
            cy.get('#select2-merchant_id_create-container').click();
            cy.get('.select2-search__field').type('Testing');
            cy.get('[id^="select2-merchant_id_create-result-"]')
                .contains('Testing')
                .click();

            cy.get('#addIP .modal-body')
                .children()
                .children()
                .children().then(($els) => {
                    cy.log($els);
                });
        });
    }

    selectUsage(usage) {
        if (usage === 'bo') {
            cy.get('#check_bo_add').check();
        } else if (usage === 'wd') {
            cy.get('#check_withdraw_add').check();
        } else if (usage === 'va') {
            cy.get('#check_create_get_va_add').check();
        } else {
            throw new Error('Invalid usage type provided');
        }
    }

    saveIP() {
        cy.get('.pull-left > #btn-add').contains('Save').click();
    }
}

const ipWhitelist = new IPWhitelist();

export function IPWhitelistCommands(Cypress) {
    Cypress.Commands.add('IPWhitelist', (usage, action) => {
        ipWhitelist.fillTheData();
        ipWhitelist.selectUsage(usage);
        ipWhitelist.saveIP();

        if (action === 'yes') {
            cy.contains('.swal2-confirm', 'Yes', { timeout: 10000 })
                .should('be.visible')
                .click();
        } else if (action === 'no') {
            cy.contains('.swal2-cancel', 'No', { timeout: 10000 })
                .should('be.visible')
                .click();
        } else {
            throw new Error('Invalid action for confirmation popup');
        }

        return cy.wrap(ipWhitelist);
    });

    Cypress.Commands.add('selectUsage', (usage) => {
        return ipWhitelist.selectUsage(usage);
    });

    Cypress.Commands.add('saveIP', () => {
        return ipWhitelist.saveIP();
    });
}
