/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
const dotenv = require("dotenv");
dotenv.config({ path: ".env.cypress" });
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  config.env.testusername = process.env.CYPRESS_TEST_USERNAME;
  config.env.testpassword = process.env.CYPRESS_TEST_PASSWORD;

  // trello creds
  config.env.trelloApiKey = process.env.CYPRESS_TRELLO_API_KEY;
  config.env.trelloAccessToken = process.env.CYPRESS_TRELLO_ACCESS_TOKEN;

  return config;
}
