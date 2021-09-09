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
    cy.location("pathname").should("include", "/value-streams/new");

    // 1st Step
    cy.SelectProvider({cardId: "trello-card"});

    // 2nd Step: Select Connector
    cy.getBySel("create-connector-button").click();

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

    cy.get("table")
      .find("tbody>tr")
      .first()
      .find("button.ant-btn")
      .contains(/select/i)
      .click();

    // 3rd Step
    cy.SelectProjects();

    // 4th Step
    cy.ConfigureImport();

    // 5th Step
    cy.ImportProjectStatus();
  });
});
