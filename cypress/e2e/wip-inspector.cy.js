/// <reference types="cypress" />

import {WIP_INSPECTOR, ORGANIZATION} from "../support/queries-constants";
import {aliasQuery, getQueryFullName} from "../support/utils";

describe("Wip Inspector", () => {
  beforeEach(() => {
    const [username, password] = [Cypress.env("username"), Cypress.env("password")];
    cy.loginByApi(username, password);

    // our auth cookie should be present
    cy.getCookie("session").should("exist");

    // TODO: this is deprecated now, need to replace from cy.session
    Cypress.Cookies.preserveOnce("session");

    cy.intercept("POST", "/graphql", (req) => {
      // Alias Wip Inspector Queries
      aliasQuery(req, WIP_INSPECTOR.projectFlowMetrics, "projectFlowMetrics.json");
      aliasQuery(req, WIP_INSPECTOR.projectPipelineCycleMetrics);
      aliasQuery(req, WIP_INSPECTOR.projectPipelineStateDetails);

      aliasQuery(req, ORGANIZATION.organizationProjects);
    });
  });

  it("navigate to wip inspector dashboard, and verify all metrics on it", () => {
    cy.visit("/");

    cy.getBySel("value-streams").click();
    cy.location("pathname").should("include", "/value-streams");

    cy.wait(`@${getQueryFullName(ORGANIZATION.organizationProjects)}`);

    cy.get("table")
      .find("tbody>tr")
      .eq(1)
      .find("button.ant-btn")
      .contains(/select/i)
      .click();
    cy.location("pathname").should("include", "/360-view");

    cy.getBySel("wip").click();
    cy.location("pathname").should("include", "/wip");

    cy.log("Renders Throughput Metric");

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectFlowMetrics)}`)
      .its("response.body.data.project.cycleMetricsTrends")
      .should("have.length", 2)

    cy.getBySel("throughput").should("contain", `Throughput`);
    cy.getBySel("throughput").should("contain", `0.7`);
    cy.getBySel("throughput").should("contain", `Specs/Day`);
    cy.getBySel("throughput").within(() => {
      cy.contains(`15%`).should("have.css", "color", "rgba(0, 128, 0, 0.7)");
    })

  });
});
