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
  {
    provider: "Gitlab",
    cardId: "gitlab-card",
    connectorName: "Gitlab Test",
    credentialPairs: [["input#gitlabPersonalAccessToken", Cypress.env("gitlabAccessToken")]],
  },
];

describe("Onboarding flows", () => {
  beforeEach(() => {
    cy.intercept("POST", "/graphql", (req) => {
      // Queries
      cy.aliasQuery(req, "getAccountConnectors");
      cy.aliasQuery(req, "showImportState");
  
      // Mutations
      cy.aliasMutation(req, "createConnector");
      cy.aliasMutation(req, "refreshConnectorProjects")
    });

    const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
    cy.loginByApi(username, password);

    // our auth cookie should be present
    cy.getCookie("session").should("exist");
    Cypress.Cookies.preserveOnce("session");
  });

  importProjectFlowConfig.forEach((config) => {
    it(`Import project flow for - ${config.provider}`, () => {
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
