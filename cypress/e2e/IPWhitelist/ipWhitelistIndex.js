describe('BO - IP Whitelist', () => {
    const SELECTORS = {
        sidebarLink: '.c-sidebar-nav-link',
        cardHeader: '.card-header',
        mainButtons: '.c-main .btn',
        addButton: '.card-header-actions > #btn-add',
        filterRow: '.row > *'
    };

    const CONFIG = {
        dashboardUrl: '/demo_psp2/merchant/dashboard/dashboard-chart-v2',
        expectedFilterCount: 5,
        requiredButtons: ['Add', 'Search', 'Edit', 'Delete'],
        requiredFilters: ['Merchant', 'ip address', 'Type']
    };

    const visitIPWhitelist = () => {
        cy.logAction('➡️ Navigating to IP Whitelist page');
        cy.visit(CONFIG.dashboardUrl);
        cy.get(SELECTORS.sidebarLink)
            .contains('IP Whitelist')
            .click();
        cy.logAction('✅ IP Whitelist page loaded');
    };

    beforeEach(() => {
        cy.loginHelper();
        cy.logAction('✅ Session restored & user logged in');
    });

    it('Should display IP Whitelist page correctly', () => {
        visitIPWhitelist();
        
        cy.get(SELECTORS.cardHeader)
            .should('contain.text', 'IP Whitelist');
        
        cy.logAction('✅ IP Whitelist header verified');
    });

    it('Should display all required action buttons', () => {
        visitIPWhitelist();
        cy.logAction('➡️ Validating action buttons');

        const getButtonText = (btn) => {
            const text = btn.innerText.trim();
            if (text) return text;

            const svg = btn.querySelector('svg');
            if (!svg) return 'Unknown Button';

            const svgHTML = svg.outerHTML.toLowerCase();
            if (svgHTML.includes('pencil') || svgHTML.includes('edit')) return 'Edit';
            if (svgHTML.includes('trash') || svgHTML.includes('delete')) return 'Delete';
            if (svgHTML.includes('search')) return 'Search';
            
            return 'Unknown SVG Button';
        };

        cy.get(SELECTORS.mainButtons).then($buttons => {
            const detectedButtons = [...$buttons].map(getButtonText);
            
            cy.logAction(`🔍 Detected buttons: ${detectedButtons.join(', ')}`);

            // Validate required buttons
            CONFIG.requiredButtons.forEach(btnText => {
                const found = detectedButtons.some(text => 
                    text.toLowerCase().includes(btnText.toLowerCase())
                );

                if (!found) {
                    throw new Error(`❌ Required button "${btnText}" not found`);
                }
                cy.logAction(`✅ Button "${btnText}" found`);
            });

            // Check for unexpected buttons
            const extraButtons = detectedButtons.filter(text =>
                !CONFIG.requiredButtons.some(req =>
                    text.toLowerCase().includes(req.toLowerCase())
                )
            );

            if (extraButtons.length > 0) {
                cy.logAction(`⚠️ Unexpected buttons: ${extraButtons.join(', ')}`);
            }
        });

        cy.logAction('✅ All action buttons validated');
    });

    it('Should display all filter fields', () => {
        visitIPWhitelist();
        cy.logAction('➡️ Validating filter fields');

        cy.get(SELECTORS.filterRow).then($groups => {
            if ($groups.length > CONFIG.expectedFilterCount) {
                throw new Error(
                    `❌ Found ${$groups.length} filters, expected ${CONFIG.expectedFilterCount}`
                );
            }

            const foundFilters = [];

            // Check first 3 filter columns
            [1, 2, 3].forEach(i => {
                const group = $groups[i];
                if (!group) {
                    throw new Error(`❌ Filter column ${i + 1} not found`);
                }

                const labelEl = group.querySelector('label');
                const labelText = labelEl?.innerText.trim() || `Column ${i + 1}`;
                foundFilters.push(labelText);

                const input = group.querySelector('input, select');
                let value = '';

                if (input?.tagName.toLowerCase() === 'select') {
                    value = input.options[input.selectedIndex]?.text || '';
                } else if (input) {
                    value = input.value || input.placeholder || '';
                }

                const status = value ? `with value: "${value}"` : 'but has no value';
                cy.logAction(`${value ? '✅' : '⚠️'} Filter "${labelText}" ${status}`);
            });

            // Check for unexpected new filters
            const newFilters = foundFilters.filter(f => 
                !CONFIG.requiredFilters.includes(f)
            );
            
            if (newFilters.length > 0) {
                throw new Error(`❌ Unexpected filter(s): ${newFilters.join(', ')}`);
            }

            cy.logAction('✅ All filter fields validated');
        });
    });

    it('Should successfully add IP Whitelist with single usage', () => {
        visitIPWhitelist();
        
        cy.logAction('➡️ Opening Add IP Whitelist modal');
        cy.get(SELECTORS.addButton)
            .should('contain.text', 'Add')
            .click();
        
        cy.wait(1000);
        cy.logAction('➡️ Filling IP Whitelist form (usage: BO)');

        cy.IPWhitelist('bo', 'yes');
        
        cy.logAction('✅ IP Whitelist added successfully');
    });

    it('Should successfully add IP Whitelist with multiple usages', () => {
        visitIPWhitelist();
        
        cy.logAction('➡️ Opening Add IP Whitelist modal');
        cy.get(SELECTORS.addButton).click();
        
        cy.wait(1000);
        cy.logAction('➡️ Filling IP Whitelist form (usage: BO, WD, VA)');

        cy.IPWhitelist(['bo', 'wd', 'va'], 'yes');
        
        cy.logAction('✅ IP Whitelist with multiple usages added successfully');
    });

    it('Should successfully add IP Whitelist with custom IP and merchant', () => {
        visitIPWhitelist();
        
        cy.logAction('➡️ Opening Add IP Whitelist modal');
        cy.get(SELECTORS.addButton).click();
        
        cy.wait(1000);
        cy.logAction('➡️ Filling custom IP (192.168.1.1) and merchant');

        cy.IPWhitelist(['bo', 'wd'], 'yes', {
            ip: '192.168.1.1',
            merchantName: 'Testing'
        });
        
        cy.logAction('✅ Custom IP Whitelist added successfully');
    });

    it('Should handle cancellation when adding IP Whitelist', () => {
        visitIPWhitelist();
        
        cy.logAction('➡️ Opening Add IP Whitelist modal');
        cy.get(SELECTORS.addButton).click();
        
        cy.wait(1000);
        cy.logAction('➡️ Filling form and canceling');

        cy.IPWhitelist('bo', 'no');
        
        cy.logAction('✅ IP Whitelist addition cancelled successfully');
    });
});