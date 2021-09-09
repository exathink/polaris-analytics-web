/// <reference types="cypress" />

describe("Onboarding flows", () => {
  beforeEach(() => {
    cy.aliasGraphQlRequests();

    const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
    cy.loginByApi(username, password);

    cy.visit("/");
  });

  it("Import project flow for - Trello", () => {
    // assume there are no existing connectors setup already

    // 0th Step: Start import project flow
    cy.getBySel("import-project").click();
    cy.location("pathname").should("include", "/value-streams/new");

    // 1st Step
    cy.SelectProvider({cardId: "trello-card"});

    // 2nd Step
    cy.SelectConnector({
      connectorName: "Trello Test",
      credentialPairs: [
        ["input#trelloApiKey", Cypress.env("trelloApiKey")],
        ["input#trelloAccessToken", Cypress.env("trelloAccessToken")],
      ],
    });

    // 3rd Step
    cy.SelectProjects();

    // 4th Step
    cy.ConfigureImport();

    // 5th Step
    cy.ImportProjectStatus();
  });

  it("Import project flow for - Github", () => {
    // assume there are no existing connectors setup already

    // 0th Step: Start import project flow
    cy.getBySel("import-project").click();
    cy.location("pathname").should("include", "/value-streams/new");

    // 1st Step
    cy.SelectProvider({cardId: "github-card"});

    // 2nd Step
    cy.SelectConnector({
      connectorName: "Github Test",
      credentialPairs: [
        ["input#githubOrganization", Cypress.env("githubOrganization")],
        ["input#githubAccessToken", Cypress.env("githubAccessToken")],
      ],
    });

    // 3rd Step
    cy.SelectProjects();

    // 4th Step
    cy.ConfigureImport();

    // 5th Step
    cy.ImportProjectStatus();
  });
});
