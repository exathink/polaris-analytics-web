const dotenv = require("dotenv");
const {defineConfig} = require("cypress");

// load env vars from file .env.cypress at development time
// these env vars can come from CI providers when these tests are running as part of CI
dotenv.config({path: ".env.cypress"});

module.exports = defineConfig({
  viewportHeight: 1000,
  viewportWidth: 1280,
  env: {
    authServiceUrl: "http://polaris-services.exathink.localdev:8000",
    apiUrl: "http://polaris-services.exathink.localdev:8200",
    username: "polaris-dev@exathink.com",
    password: "polaris",
    testusername: process.env.CYPRESS_TEST_USERNAME,
    testpassword: process.env.CYPRESS_TEST_PASSWORD,
    trelloApiKey: process.env.CYPRESS_TRELLO_API_KEY,
    trelloAccessToken: process.env.CYPRESS_TRELLO_ACCESS_TOKEN,
    githubAccessToken: process.env.CYPRESS_GITHUB_ACCESS_TOKEN,
    githubOrganization: process.env.CYPRESS_GITHUB_ORGANIZATION,
    gitlabAccessToken: process.env.CYPRESS_GITLAB_ACCESS_TOKEN,
  },
  blockHosts: ["*.google-analytics.com"],
  chromeWebSecurity: false,
  defaultCommandTimeout: 10000,
  e2e: {
    baseUrl: 'http://polaris-services.exathink.localdev:3000',
    experimentalSessionAndOrigin: true
  },
});
