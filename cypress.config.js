const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportHeight: 1000,
  viewportWidth: 1280,
  env: {
    authServiceUrl: 'http://polaris-services.exathink.localdev:8000',
    username: 'polaris-dev@exathink.com',
    password: 'polaris',
  },
  blockHosts: ['*.google-analytics.com'],
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://polaris-services.exathink.localdev:3000',
    specPattern: 'cypress/tests/**/*.cy.{js,jsx,ts,tsx}',
  },
})
