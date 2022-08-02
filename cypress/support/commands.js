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

import {getQueryFullName, getMutationFullName} from "./utils";

Cypress.Commands.add("getBySel", (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args);
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
        expect(Cypress.$(resp.body).filter("title").text()).to.eq("Polaris");
      });
    });
});

Cypress.Commands.add("aliasMutation", (operationName, fixture) => {
  cy.intercept(
    {
      method: "POST",
      url: "/graphql",
      headers: {
        "x-gql-operation-name": "",
      },
    },
    typeof fixture === "string"
      ? (req) => {
          if (fixture) {
            req.reply({
              fixture: fixture,
            });
          }
        }
      : typeof fixture === "function"
      ? fixture
      : undefined
  ).as(getMutationFullName(operationName));
});

Cypress.Commands.add("aliasQuery", (operationName, fixture) => {
  cy.intercept(
    {
      method: "POST",
      url: "/graphql",
      headers: {
        "x-gql-operation-name": operationName,
      },
    },
    typeof fixture === "string"
    ? (req) => {
        if (fixture) {
          req.reply({
            fixture: fixture,
          });
        }
      }
    : typeof fixture === "function"
    ? fixture
    : undefined
  ).as(getQueryFullName(operationName));
});
/**
 *  Useful Commands for onboarding flow (Connect Project Workflow)
 */

Cypress.Commands.add("SelectProvider", ({cardId}) => {
  cy.getBySel("integration-step-title").should("be.visible");
  cy.getBySel(cardId).click();
});

Cypress.Commands.add("SelectConnector", ({connectorName, credentialPairs}) => {
  cy.getBySel("create-connector-button").click();

  cy.contains("Next").click();

  cy.get("input#name").type(connectorName).should("have.value", connectorName);

  credentialPairs.forEach((pair) => {
    const [domId, value] = pair;
    cy.get(domId).type(value).should("have.value", value);
  });

  cy.contains(/Register/i).click();

  cy.wait("@gqlcreateConnectorMutation");
  cy.wait("@gqlgetAccountConnectorsQuery");

  cy.getBySel("available-connectors-title").should("be.visible");
  cy.contains(connectorName).should("be.visible");

  cy.get("table")
    .find("tbody>tr")
    .first()
    .find("button.ant-btn")
    .contains(/select/i)
    .click();
});

Cypress.Commands.add("SelectProjects", () => {
  cy.getBySel("select-projects-title").should("be.visible");
  cy.getBySel("fetch-available-projects").click();

  cy.wait("@gqlrefreshConnectorProjectsMutation");
  cy.get("input[type=checkbox]").first().check({force: true});

  cy.getBySel("workflow-next-button").click();
});

Cypress.Commands.add("ConfigureImport", () => {
  cy.getBySel("configure-import-title").should("be.visible");
  cy.getBySel("import-project-button").click();
});

Cypress.Commands.add("ImportProjectStatus", () => {
  cy.getBySel("progress-circle").should("be.visible");

  // as there are multiple calls for import state check
  cy.wait("@gqlshowImportStateQuery");
  cy.wait("@gqlshowImportStateQuery");
  cy.wait("@gqlshowImportStateQuery");

  // make sure there is completed check icon
  cy.getBySel("completed-check-icon").should("be.visible");

  cy.getBySel("workflow-done-button").click();
});
