/// <reference types="cypress" />

describe("Onboarding flows", () => {
  it("Import Board flow for Trello", () => {
    cy.aliasGraphQlRequests();

    const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
    cy.loginByApi(username, password);

    cy.visit("/");

    // assume there are no existing connectors setup already

    // Start import project flow
    cy.getBySel("import-project").click();

    // 1st Step: Select Provider
    cy.location("pathname").should("include", "/value-streams/new");

    cy.getBySel("integration-step-title").should("be.visible");

    cy.getBySel("trello-card").click();

    // 2nd Step: Select Connector
    cy.contains(/Create Trello Connector/i).click();

    cy.contains("Next").click();

    const connectorName = "Trello Test";
    cy.get("input#name").type(connectorName).should("have.value", connectorName);

    const [trelloApiKey, trelloAccessToken] = [Cypress.env("trelloApiKey"), Cypress.env("trelloAccessToken")];
    cy.get("input#trelloApiKey").type(trelloApiKey).should ("have.value", trelloApiKey);
    cy.get("input#trelloAccessToken").type(trelloAccessToken).should("have.value", trelloAccessToken);

    cy.contains(/Register/i).click();

    cy.wait("@gqlcreateConnectorMutation");
    cy.wait("@gqlgetAccountConnectorsQuery");

    cy.contains(/Available Trello Connectors/).should("be.visible");
    cy.contains(connectorName).should("be.visible");

    cy.get("button.ant-btn")
      .contains(/select/i)
      .click();

    // 3rd Step: Select Boards
    cy.contains(/Select boards to import from connector/).should("be.visible");
    cy.contains(/fetch available boards/i).click();

    cy.get("input[type=checkbox]").check();

    cy.contains(/Next/i).click();

    // 4th Step: Configure Import
    cy.contains(/Select Import Mode/).should("be.visible");
    cy.get("button.ant-btn")
      .contains(/Import Board/i)
      .click();

    // 5th Step: Import Boards Status
    cy.getBySel("progress-circle").should("be.visible");

    cy.get("button.ant-btn").contains(/done/i).click();
  });
});
