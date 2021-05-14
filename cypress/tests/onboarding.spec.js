/// <reference types="cypress" />

describe("Onboarding flows", () => {
  it("Import Board flow for Trello", () => {
    cy.interceptGraphQl("createConnector");
    cy.interceptGraphQl("getAccountConnectors");

    const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
    cy.loginByApi(username, password);

    cy.visit("/");

    // assume there is no existing connectors setup already
    cy.contains(/Connect Work Tracking System/i).click();
    cy.contains(/Connect Remote Projects/i).click();

    // Provider Specific
    cy.contains(/Trello/i).click();
    cy.contains(/Create Trello Connector/i).click();

    cy.contains("Next").click();

    cy.get("input#name").type("Polaris Test");

    const [trelloApiKey, trelloAccessToken] = [Cypress.env("trelloApiKey"), Cypress.env("trelloAccessToken")];
    cy.get("input#trelloApiKey").type(trelloApiKey);
    cy.get("input#trelloAccessToken").type(trelloAccessToken);

    cy.contains(/Register/i).click();

    cy.wait("@createConnector");
    cy.wait("@getAccountConnectors");

    cy.contains("Available Trello Connectors").should("be.visible");
    cy.contains("Polaris Test").should("be.visible");

    cy.get("button.ant-btn")
      .contains(/select/i)
      .click();

    cy.contains(/fetch available boards/i).click();

    cy.get("input[type=checkbox]").check();

    cy.contains(/Next/i).click();

    cy.get("button.ant-btn")
      .contains(/Import Board/i)
      .click();

    cy.get("button.ant-btn").contains(/done/i).click();
  });
});
