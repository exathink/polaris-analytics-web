/// <reference types="cypress" />

const importProjectFlowConfig = [
  {
    provider: "Trello",
    cardId: "trello-card",
    connectorName: "Trello Test",
    credentialPairs: [
      ["input#trelloApiKey", Cypress.env("trelloApiKey")],
      ["input#trelloAccessToken", Cypress.env("trelloAccessToken")],
    ],
  },
  {
    provider: "Github",
    cardId: "github-card",
    connectorName: "Github Test",
    credentialPairs: [
      ["input#githubOrganization", Cypress.env("githubOrganization")],
      ["input#githubAccessToken", Cypress.env("githubAccessToken")],
    ],
  },
];

describe("Onboarding flows", () => {
  beforeEach(() => {
    cy.aliasGraphQlRequests();
  });

  importProjectFlowConfig.forEach((config) => {
    it(`Import project flow for - ${config.provider}`, () => {
      const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
      cy.loginByApi(username, password);

      cy.visit("/");

      // assume there are no existing connectors setup already

      // 0th Step: Start import project flow
      cy.getBySel("import-project").click();
      cy.location("pathname").should("include", "/value-streams/new");

      // 1st Step
      cy.SelectProvider({cardId: config.cardId});

      // 2nd Step
      cy.SelectConnector({
        connectorName: config.connectorName,
        credentialPairs: config.credentialPairs,
      });

      // 3rd Step
      cy.SelectProjects();

      // 4th Step
      cy.ConfigureImport();

      // 5th Step
      cy.ImportProjectStatus();
    });
  });
});
