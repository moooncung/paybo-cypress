const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'hkr6k7',
  e2e: {
    defaultCommandTimeout: 15000,
    requestTimeout: 15000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    watchForFileChanges: false,
    chromeWebSecurity: false,
    experimentalStudio: true,

    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },

    env: {
      username: 'demo_psp3@mail.com',
      password: 'E8rP4qA3',
      apiUrl: 'https://bo-dev-p1.paybo.io'
    },
    
    specPattern: "cypress/e2e/**/*.js",
  },
});
