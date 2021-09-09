/// <reference types="cypress" />
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import {aliasQuery, aliasMutation} from "./utils";

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-test=${selector}]`, ...args);
});

Cypress.Commands.add("getBySelLike", (selector, ...args) => {
  return cy.get(`[data-test*=${selector}]`, ...args);
});

Cypress.Commands.add("loginByCSRF", (csrfToken, username, password) => {
  cy.request({
    method: "POST",
    url: `${Cypress.env("authServiceUrl")}/login`,
    failOnStatusCode: false, // dont fail so we can make assertions
    form: true, // we are submitting a regular form body
    body: {
      // get username and password from environment variables
      email: username,
      password: password,
      csrf_token: csrfToken, // insert this as part of form body
      submit: "Login",
    },
  });
});

Cypress.Commands.add("loginByApi", (username, password) => {
  // if we cannot change our server code to make it easier
  // to parse out the CSRF token, we can simply use cy.request
  // to fetch the login page, and then parse the HTML contents
  // to find the CSRF token embedded in the page
  return cy
    .request(`${Cypress.env("authServiceUrl")}/login`)
    .its("body")
    .then((body) => {
      // we can use Cypress.$ to parse the string body
      // thus enabling us to query into it easily
      const $html = Cypress.$(body);
      const csrf = $html.find("input[name=csrf_token]").val();
      cy.loginByCSRF(csrf, username, password).then((resp) => {
        expect(resp.status).to.eq(200);
        expect(Cypress.$(resp.body).filter("title").text()).to.eq("Polaris Flow");
      });
    });
});

Cypress.Commands.add("aliasGraphQlRequests", () => {
  cy.intercept("POST", "/graphql", (req) => {
    // Queries
    aliasQuery(req, "getAccountConnectors");
    aliasQuery(req, "showImportState");

    // Mutations
    aliasMutation(req, "createConnector");
    aliasMutation(req, "refreshConnectorProjects")
  });
});
