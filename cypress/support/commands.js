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
  cy.session(username, () =>
    cy
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
      })
  );

  // when login is successful, our auth cookie should be present
  cy.getCookie("session").should("exist");
});

Cypress.Commands.add("loginWithoutApi", () => {
  const session_key = "random_key";
  const sessionExpiration = new String(Date.now() + 1000 * 60 * 60 * 24 * 5);
  const session = "session";
  
  cy.session("session_cookie", () => {
    cy.setCookie("session_key", session_key, {
      path: "/",
      domain: ".exathink.localdev",
      secure: false,
      httpOnly: false,
    });
    cy.setCookie("session_expiration", sessionExpiration, {
      path: "/",
      domain: ".exathink.localdev",
      secure: false,
      httpOnly: false,
    });
    cy.setCookie("session", session, {path: "/", domain: ".exathink.localdev", secure: false, httpOnly: true});
  });

  // when login is successful, our auth cookie should be present
  cy.getCookie("session").should("exist");
});

Cypress.Commands.add("interceptMutation", ({operationName, fixturePath, times}) => {
  cy.intercept(
    {
      method: "POST",
      url: "/graphql",
      headers: {
        "x-gql-operation-name": operationName,
      },
      ...(times && {times: times}),
    },
    {fixture: fixturePath}
  ).as(getMutationFullName(operationName));
});

Cypress.Commands.add("interceptQuery", ({operationName, fixturePath, times}) => {
  cy.intercept(
    {
      method: "POST",
      url: "/graphql",
      headers: {
        "x-gql-operation-name": operationName,
      },
      ...(times && {times: times}),
    },
    {fixture: fixturePath}
  ).as(getQueryFullName(operationName));
});

Cypress.Commands.add("interceptQueryWithResponse", ({operationName, body, times}) => {
  cy.intercept(
    {
      method: "POST",
      url: "/graphql",
      headers: {
        "x-gql-operation-name": operationName,
      },
      ...(times && {times: times}),
    },
    {body: body}
  ).as(getQueryFullName(operationName));
});
