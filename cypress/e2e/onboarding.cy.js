/// <reference types="cypress" />

import {ACCOUNT, ORGANIZATION, VALUE_STREAM, viewer_info} from "../support/queries-constants";
import {getQueryFullName} from "../support/utils";

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
    // Queries
    cy.interceptQuery(viewer_info, `${viewer_info}.json`);
    cy.interceptQuery(ORGANIZATION.with_organization_instance, `${ORGANIZATION.with_organization_instance}.json`);

    cy.interceptQuery(ACCOUNT.getAccountConnectors, `${ACCOUNT.getAccountConnectors}.json`);
    cy.interceptQuery(ACCOUNT.showImportState, `${ACCOUNT.showImportState}.json`);
    cy.interceptQuery(ACCOUNT.getConnectorWorkItemsSources, `${ACCOUNT.getConnectorWorkItemsSources}.json`);
    cy.interceptQuery(ORGANIZATION.getOrganizationProjectCount, `${ORGANIZATION.getOrganizationProjectCount}.json`);

    // Mutations
    cy.interceptMutation(ACCOUNT.createConnector, `${ACCOUNT.createConnector}.json`);
    cy.interceptMutation(ACCOUNT.refreshConnectorProjects, `${ACCOUNT.refreshConnectorProjects}.json`)
    cy.interceptMutation(VALUE_STREAM.importProjects, `${VALUE_STREAM.importProjects}.json`)

    const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
    cy.loginByApi(username, password);

    // our auth cookie should be present
    cy.getCookie("session").should("exist");
    Cypress.Cookies.preserveOnce("session");
  });

  importProjectFlowConfig.forEach((config) => {
    it(`Import project flow for - ${config.provider}`, () => {
      cy.visit("/");

      cy.wait([`@${getQueryFullName(viewer_info)}`, `@${getQueryFullName(ORGANIZATION.with_organization_instance)}`]);

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
