describe('BO - IP Whitelist', () => {
    const visitIPWhitelist = () => {
        cy.visit('/demo_psp2/merchant/dashboard/dashboard-chart-v2');
        cy.get('.c-sidebar-nav-link')
        .contains('IP Whitelist')
        .click();
    };

    beforeEach(() => {
        // Login dan restore session
        cy.loginHelper();
        cy.logAction('✅ Session restored & user logged in');
    });

    it('Should can see ip whitelist', () => {
        cy.logAction('➡️ Find IP Whitelist Menu');
        visitIPWhitelist();
        cy.get('.card-header').should('contain.text', 'IP Whitelist');
        cy.logAction('✅ IP Whitelist Menu is visible');
    });

    it('Should can see Add, Search, Edit and Delete Button', () => {
        cy.logAction('➡️ Find buttons on IP Whitelist page');
        visitIPWhitelist();

        const requiredButtons = ['Add', 'Search', 'Edit', 'Delete'];

        cy.get('.c-main .btn').then(($buttons) => {
            const detectedButtons = [...$buttons].map((btn) => {
                const text = btn.innerText.trim();
                if (text) return text;

                const svg = btn.querySelector('svg');
                if (svg) {
                    const svgHTML = svg.outerHTML.toLowerCase();

                    if (svgHTML.includes('pencil') || svgHTML.includes('edit')) return 'Edit';
                    if (svgHTML.includes('trash') || svgHTML.includes('delete')) return 'Delete';
                    if (svgHTML.includes('search')) return 'Search';

                    return 'Unknown SVG Button';
                }

                return 'Unknown Button';
            });

            cy.log(`🔍 Detected buttons: ${detectedButtons.join(', ')}`);

            requiredButtons.forEach((btnText) => {
            const found = detectedButtons.some(
                (text) => text.toLowerCase().includes(btnText.toLowerCase())
            );

            if (found) {
                cy.logAction(`✅ Button "${btnText}" found`);
            } else {
                throw new Error(`❌ Button "${btnText}" not found on IP Whitelist page`);
            }
            });

            const extraButtons = detectedButtons.filter(
            (text) =>
                !requiredButtons.some((req) =>
                    text.toLowerCase().includes(req.toLowerCase())
                )
            );

            if (extraButtons.length > 0) {
                cy.logAction(`⚠️ Unexpected buttons detected: ${extraButtons.join(', ')}`);
            }
        });

        cy.logAction('✅ All required buttons validated on IP Whitelist page');
    });

    it('Should can see filter', () => {
        cy.logAction('➡️ Find filter on IP Whitelist page');
        visitIPWhitelist();

        const expectedFilterCount = 5; // jumlah filter sekarang
        const expectedFilters = [
            'Merchant',
            'ip address',
            'Type',
        ]; // tambahkan label jika ada filter baru

        cy.get('.row > *').then(($groups) => {
            const foundFilters = [];

            if ($groups.length > expectedFilterCount) {
                throw new Error(`❌ Found ${$groups.length} filters, but only ${expectedFilterCount} expected. There might be a new filter added!`);
            }

            [1, 2, 3].forEach((i) => {
                const group = $groups[i];
                if (!group) throw new Error(`❌ Filter column ${i + 1} not found`);

                const labelEl = group.querySelector('label');
                const labelText = labelEl ? labelEl.innerText.trim() : `Column ${i + 1}`;
                foundFilters.push(labelText);

                cy.logAction(`➡️ Finding Filter "${labelText}"`);

                const input = group.querySelector('input, select');
                let value = '';

                if (input) {
                    if (input.tagName.toLowerCase() === 'select') {
                        value = input.options[input.selectedIndex]?.text || '';
                    } else {
                        value = input.value || input.placeholder || '';
                    }
                }

                if (value) {
                    cy.logAction(`✅ Filter "${labelText}" found with value: "${value}"`);
                } else {
                    cy.logAction(`⚠️ Filter "${labelText}" found but has no value/text`);
                }
            });

            const newFilters = foundFilters.filter(f => !expectedFilters.includes(f));
            if (newFilters.length > 0) {
                throw new Error(`❌ New unexpected filter(s) found: ${newFilters.join(', ')}`);
            }

            cy.logAction('✅ All required Filters are visible on IP Whitelist page');
        });
    });

    it('Add IP Whitelist', () => {
        cy.logAction('➡️ Find IP Whitelist Menu');
        visitIPWhitelist();
        cy.get('.card-header-actions > #btn-add').should('contain.text', 'Add').click();
        
        cy.wait(1000);

        cy.IPWhitelist('bo', 'yes');
        cy.logAction('✅ Successfully added IP Whitelist');
    });
});
