/// <reference types="cypress" />

import {ACCOUNT, ORGANIZATION, VALUE_STREAM, viewer_info} from "../support/queries-constants";
import {getMutationFullName, getQueryFullName} from "../support/utils";

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
    cy.intercept(    {
      method: "POST",
      url: "/graphql",
      headers: {
        "x-gql-operation-name": ACCOUNT.getAccountConnectors,
      },
      times: 1
    }, {fixture: `${ACCOUNT.getAccountConnectors}_empty.json`}).as(getQueryFullName(ACCOUNT.getAccountConnectors));

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
      cy.log("SelectProvider");
      cy.getBySel("integration-step-title").should("be.visible");
      cy.getBySel(config.cardId).click();

      // 2nd Step SelectConnector
      cy.log("SelectConnector");
      cy.getBySel("create-connector-button").click();

      cy.contains("Next").click();
    
      cy.get("input#name").type(config.connectorName).should("have.value", config.connectorName);
    
      config.credentialPairs.forEach((pair) => {
        const [domId, value] = pair;
        cy.get(domId).type(value).should("have.value", value);
      });
    
      cy.contains(/Register/i).click();
    
      cy.wait(`@${getMutationFullName(ACCOUNT.createConnector)}`);
      cy.wait(`@${getQueryFullName(ACCOUNT.getAccountConnectors)}`);
    
      cy.getBySel("available-connectors-title").should("be.visible");
      cy.contains(config.connectorName).should("be.visible");
    
      cy.get("table")
        .find("tbody>tr")
        .first()
        .find("button.ant-btn")
        .contains(/select/i)
        .click();

      // 3rd Step SelectProjects
      cy.log("SelectProjects");
      cy.getBySel("select-projects-title").should("be.visible");
      cy.getBySel("fetch-available-projects").click();
    
      cy.wait([
        `@${getMutationFullName(ACCOUNT.refreshConnectorProjects)}`,
        `@${getQueryFullName(ACCOUNT.getConnectorWorkItemsSources)}`,
      ]);
      cy.get("input[type=checkbox]").eq(1).check({force: true});
    
      cy.getBySel("workflow-next-button").click();
      cy.wait(`@${getQueryFullName(ORGANIZATION.getOrganizationProjectCount)}`);

      // 4th Step ConfigureImport
      cy.log("ConfigureImport");
      cy.getBySel("configure-import-title").should("be.visible");
      cy.getBySel("import-project-button").click();
      cy.wait(`@${getMutationFullName(VALUE_STREAM.importProjects)}`);
      cy.wait(`@${getQueryFullName(ACCOUNT.getConnectorWorkItemsSources)}`);

      // 5th Step ImportProjectStatus
      cy.log("ImportProjectStatus");
      cy.getBySel("progress-circle").should("be.visible");

      // as there are multiple calls for import state check
      cy.wait(`@${getQueryFullName(ACCOUNT.showImportState)}`);
      cy.wait(`@${getQueryFullName(ACCOUNT.showImportState)}`);
      cy.wait(`@${getQueryFullName(ACCOUNT.showImportState)}`);
    
      // make sure there is completed check icon
      cy.getBySel("completed-check-icon").should("be.visible");
    
      cy.getBySel("workflow-done-button").click();

    });
  });
});
