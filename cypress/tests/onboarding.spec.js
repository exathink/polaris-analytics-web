/// <reference types="cypress" />

describe("Onboarding flows", () => {
  it("Import Board flow for Trello", () => {
    cy.aliasGraphQlRequests();

    const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
    cy.loginByApi(username, password);

    cy.visit("/");

    // assume there is no existing connectors setup already
    cy.getBySel("import-project").click();

    // make sure we are on the first step of import project workflow
    cy.location("pathname").should("include", "/value-streams/new");
    // step title should be visible
    cy.getBySel("integration-step-title").should("be.visible")

    // Provider Specific
    cy.getBySel("trello-card").click();
    cy.contains(/Create Trello Connector/i).click();

    cy.contains("Next").click();

    cy.get("input#name").type("Polaris Test");

    const [trelloApiKey, trelloAccessToken] = [Cypress.env("trelloApiKey"), Cypress.env("trelloAccessToken")];
    cy.get("input#trelloApiKey").type(trelloApiKey);
    cy.get("input#trelloAccessToken").type(trelloAccessToken);

    cy.contains(/Register/i).click();

    cy.wait("@gqlcreateConnectorMutation");
    cy.wait("@gqlgetAccountConnectorsQuery");

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
