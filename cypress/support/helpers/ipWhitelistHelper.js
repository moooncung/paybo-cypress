class IPWhitelist {
    fillTheData(ip = '127.0.0.1', merchantName = 'Testing') {
        cy.get('#ip').clear().type(ip);
        
        cy.get('#select2-merchant_id_create-container').click();
        cy.get('.select2-search__field').type(merchantName);
        cy.get(`[id^="select2-merchant_id_create-result-"]:contains("${merchantName}")`)
            .first()
            .click();

        return this;
    }

    selectUsage(usage) {
        const usageMap = {
            bo: '#check_bo_add',
            wd: '#check_withdraw_add',
            va: '#check_create_get_va_add'
        };

        const usages = Array.isArray(usage) ? usage : [usage];

        usages.forEach(type => {
            const selector = usageMap[type];
            if (!selector) {
                throw new Error(`Invalid usage type: ${type}. Valid types: bo, wd, va`);
            }
            cy.get(selector).check();
        });

        return this;
    }

    saveIP() {
        cy.get('.pull-left > #btn-add').contains('Save').click();
        return this;
    }

    handleConfirmation(action) {
        const actionMap = {
            yes: '.swal2-confirm',
            no: '.swal2-cancel'
        };

        const selector = actionMap[action];
        if (!selector) {
            throw new Error(`Invalid action: ${action}. Valid actions: yes, no`);
        }

        cy.get(selector, { timeout: 10000 })
            .should('be.visible')
            .click();

        return this;
    }
}

export function IPWhitelistCommands(Cypress) {
    Cypress.Commands.add('IPWhitelist', (usage, action, options = {}) => {
        const { ip = '127.0.0.1', merchantName = 'Testing' } = options;
        const helper = new IPWhitelist();
        
        helper
            .fillTheData(ip, merchantName)
            .selectUsage(usage)
            .saveIP()
            .handleConfirmation(action);

        return cy.wrap(helper);
    });

    Cypress.Commands.add('fillIPData', (ip, merchantName) => {
        return new IPWhitelist().fillTheData(ip, merchantName);
    });

    Cypress.Commands.add('selectUsage', (usage) => {
        return new IPWhitelist().selectUsage(usage);
    });

    Cypress.Commands.add('saveIP', () => {
        return new IPWhitelist().saveIP();
    });

    Cypress.Commands.add('handleIPConfirmation', (action) => {
        return new IPWhitelist().handleConfirmation(action);
    });
}