const { defineConfig } = require('cypress');
const path = require('path');
const dotenv = require('dotenv');

const envFile = '.env';
dotenv.config({ path: path.resolve(__dirname, './', envFile) });

module.exports = defineConfig({
    projectId: 'hkr6k7',
  e2e: {
    baseUrl: 'https://bo-dev-p1.paybo.io',
    viewportWidth: 1920,
    viewportHeight: 1080,
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
      // Task untuk logging
      on('task', {
        log(message) {
          console.log(`[${new Date().toISOString()}] ${message}`);
          return null;
        },
        
        // Task untuk database operations (jika diperlukan)
        queryDB(query) {
          // Implement database query if needed
          console.log('Database query:', query);
          return null;
        },

        // Task untuk file operations
        readFileMaybe(filename) {
          try {
            return require('fs').readFileSync(filename, 'utf8');
          } catch (e) {
            return null;
          }
        }
      });

      require('cypress-mochawesome-reporter/plugin')(on);
      require('@cypress/grep/src/plugin')(config);
      
      return config;
    },

    // Laporan Mochawesome konfigurasi
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: false,
      json: true,
    },

    env: {
      baseUrl: process.env.BASE_URL,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,

      // Test configuration
      defaultTimeout: 10000,
      retryCount: 2,
      screenshotOnFail: true,
    },

    specPattern: 'cypress/e2e/**/*.js',

    excludeSpecPattern: [
      '**/*.skip.cy.js',
      '**/*.wip.cy.js'
    ]
  },
});
