const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'hkr6k7',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners
    },
    env: {
      username: 'demo_psp3@mail.com',
      password: 'E8rP4qA3',
      apiUrl: 'https://bo-dev-p1.paybo.io/login'
    },
    chromeWebSecurity: false,        
    defaultCommandTimeout: 15000,    
    pageLoadTimeout: 60000           
  },
});
