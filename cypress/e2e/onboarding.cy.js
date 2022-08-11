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
    apiFixtures: {
      [ACCOUNT.getAccountConnectors]: `trello/${ACCOUNT.getAccountConnectors}.json`,
      [`${ACCOUNT.getAccountConnectors}_empty`]: `trello/${ACCOUNT.getAccountConnectors}_empty.json`,
      [`${ACCOUNT.getConnectorWorkItemsSources}_before`]: `trello/${ACCOUNT.getConnectorWorkItemsSources}_before.json`,
      [`${ACCOUNT.getConnectorWorkItemsSources}_after`]: `trello/${ACCOUNT.getConnectorWorkItemsSources}_after.json`,
      [`${ORGANIZATION.getOrganizationProjectCount}`]: `trello/${ORGANIZATION.getOrganizationProjectCount}.json`,
      [`${ACCOUNT.showImportState}_ready`]: `trello/${ACCOUNT.showImportState}_ready.json`,
      [`${ACCOUNT.showImportState}_autoupdate`]: `trello/${ACCOUNT.showImportState}_autoupdate.json`,
      [`${ACCOUNT.createConnector}`]: `trello/${ACCOUNT.createConnector}.json`,
      [`${ACCOUNT.refreshConnectorProjects}`]: `trello/${ACCOUNT.refreshConnectorProjects}.json`,
      [VALUE_STREAM.importProjects]: `trello/${VALUE_STREAM.importProjects}.json`,
    },
  },
  {
    provider: "Github",
    cardId: "github-card",
    connectorName: "Github Test",
    credentialPairs: [
      ["input#githubOrganization", Cypress.env("githubOrganization")],
      ["input#githubAccessToken", Cypress.env("githubAccessToken")],
    ],
    apiFixtures: {
      [ACCOUNT.getAccountConnectors]: `github/${ACCOUNT.getAccountConnectors}.json`,
      [`${ACCOUNT.getAccountConnectors}_empty`]: `github/${ACCOUNT.getAccountConnectors}_empty.json`,
      [`${ACCOUNT.getConnectorWorkItemsSources}_before`]: `github/${ACCOUNT.getConnectorWorkItemsSources}_before.json`,
      [`${ACCOUNT.getConnectorWorkItemsSources}_after`]: `github/${ACCOUNT.getConnectorWorkItemsSources}_after.json`,
      [`${ORGANIZATION.getOrganizationProjectCount}`]: `github/${ORGANIZATION.getOrganizationProjectCount}.json`,
      [`${ACCOUNT.showImportState}_ready`]: `github/${ACCOUNT.showImportState}_ready.json`,
      [`${ACCOUNT.showImportState}_autoupdate`]: `github/${ACCOUNT.showImportState}_autoupdate.json`,
      [`${ACCOUNT.createConnector}`]: `github/${ACCOUNT.createConnector}.json`,
      [`${ACCOUNT.refreshConnectorProjects}`]: `github/${ACCOUNT.refreshConnectorProjects}.json`,
      [VALUE_STREAM.importProjects]: `github/${VALUE_STREAM.importProjects}.json`,
    },
  },
  {
    provider: "Gitlab",
    cardId: "gitlab-card",
    connectorName: "Gitlab Test",
    credentialPairs: [["input#gitlabPersonalAccessToken", Cypress.env("gitlabAccessToken")]],
    apiFixtures: {
      [ACCOUNT.getAccountConnectors]: `gitlab/${ACCOUNT.getAccountConnectors}.json`,
      [`${ACCOUNT.getAccountConnectors}_empty`]: `gitlab/${ACCOUNT.getAccountConnectors}_empty.json`,
      [`${ACCOUNT.getConnectorWorkItemsSources}_before`]: `gitlab/${ACCOUNT.getConnectorWorkItemsSources}_before.json`,
      [`${ACCOUNT.getConnectorWorkItemsSources}_after`]: `gitlab/${ACCOUNT.getConnectorWorkItemsSources}_after.json`,
      [`${ORGANIZATION.getOrganizationProjectCount}`]: `gitlab/${ORGANIZATION.getOrganizationProjectCount}.json`,
      [`${ACCOUNT.showImportState}_ready`]: `gitlab/${ACCOUNT.showImportState}_ready.json`,
      [`${ACCOUNT.showImportState}_autoupdate`]: `gitlab/${ACCOUNT.showImportState}_autoupdate.json`,
      [`${ACCOUNT.createConnector}`]: `gitlab/${ACCOUNT.createConnector}.json`,
      [`${ACCOUNT.refreshConnectorProjects}`]: `gitlab/${ACCOUNT.refreshConnectorProjects}.json`,
      [VALUE_STREAM.importProjects]: `gitlab/${VALUE_STREAM.importProjects}.json`,
    },
  },
];

describe("Onboarding flows", () => {
  beforeEach(() => {
    // Queries
    cy.interceptQuery({operationName: viewer_info, fixturePath: `${viewer_info}.json`});
    cy.interceptQuery({
      operationName: ORGANIZATION.with_organization_instance,
      fixturePath: `${ORGANIZATION.with_organization_instance}.json`,
    });

    const [username, password] = [Cypress.env("testusername"), Cypress.env("testpassword")];
    cy.loginByApi(username, password);

    // our auth cookie should be present
    cy.getCookie("session").should("exist");
    Cypress.Cookies.preserveOnce("session");
  });

  importProjectFlowConfig.forEach((config) => {
    it(`Import project flow for - ${config.provider}`, () => {
      cy.interceptQuery({
        operationName: ACCOUNT.getAccountConnectors,
        fixturePath: config.apiFixtures[ACCOUNT.getAccountConnectors],
      });
      cy.interceptQuery({
        operationName: ACCOUNT.getAccountConnectors,
        fixturePath: config.apiFixtures[`${ACCOUNT.getAccountConnectors}_empty`],
        times: 1
      });


      cy.interceptQuery({
        operationName: ACCOUNT.getConnectorWorkItemsSources,
        fixturePath: config.apiFixtures[`${ACCOUNT.getConnectorWorkItemsSources}_after`],
      });
      cy.interceptQuery({
        operationName: ACCOUNT.getConnectorWorkItemsSources,
        fixturePath: config.apiFixtures[`${ACCOUNT.getConnectorWorkItemsSources}_before`],
        times: 1
      });

      cy.interceptQuery({
        operationName: ORGANIZATION.getOrganizationProjectCount,
        fixturePath: config.apiFixtures[`${ORGANIZATION.getOrganizationProjectCount}`],
      });

      cy.interceptQuery({
        operationName: ACCOUNT.showImportState,
        fixturePath: config.apiFixtures[`${ACCOUNT.showImportState}_autoupdate`],
      });
      cy.interceptQuery({
        operationName: ACCOUNT.showImportState,
        fixturePath: config.apiFixtures[`${ACCOUNT.showImportState}_ready`],
        times: 1
      });

      // Mutations
      cy.interceptMutation({
        operationName: ACCOUNT.createConnector,
        fixturePath: config.apiFixtures[`${ACCOUNT.createConnector}`],
      });
      cy.interceptMutation({
        operationName: ACCOUNT.refreshConnectorProjects,
        fixturePath: config.apiFixtures[`${ACCOUNT.refreshConnectorProjects}`],
      });
      cy.interceptMutation({
        operationName: VALUE_STREAM.importProjects,
        fixturePath: config.apiFixtures[`${VALUE_STREAM.importProjects}`],
      });

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
      cy.wait(`@${getQueryFullName(ACCOUNT.getAccountConnectors)}`);

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
