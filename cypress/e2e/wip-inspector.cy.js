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
      aliasQuery(req, WIP_INSPECTOR.projectPipelineCycleMetrics, "projectPipelineCycleMetrics.json");
      aliasQuery(req, WIP_INSPECTOR.projectPipelineStateDetails);

      aliasQuery(req, ORGANIZATION.organizationProjects, "organizationProjects.json");
    });
  });

  it("navigate to wip inspector dashboard, and verify all metrics on it", () => {
    cy.visit("/");

    cy.getBySel("value-streams").click();
    cy.location("pathname").should("include", "/value-streams");

    cy.wait(`@${getQueryFullName(ORGANIZATION.organizationProjects)}`);

    cy.getBySel("project-table")
      .find("table")
      .find("tbody>tr")
      .eq(1)
      .find("button.ant-btn")
      .contains(/select/i)
      .click();
    cy.location("pathname").should("include", "/360-view");

    cy.getBySel("wip").click();
    cy.location("pathname").should("include", "/wip");

    cy.log("Throughput Metric");

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectFlowMetrics)}`)
      .its("response.body.data.project.cycleMetricsTrends")
      .should("have.length", 2);

    cy.getBySel("throughput").should("contain", `Throughput`);
    cy.getBySel("throughput").within(() => {
      cy.getBySel("metricValue").should("have.text", "0.7");
      cy.getBySel("uom").should("have.text", "Specs/Day");

      cy.contains(`15%`).should("have.css", "color", "rgba(0, 128, 0, 0.7)");
    });

    cy.log("CycleTime Metric");
    cy.getBySel("cycletime").should("contain", `Cycle Time`);
    cy.getBySel("cycletime").within(() => {
      cy.getBySel("metricValue").should("have.text", "2.95");
      cy.getBySel("uom").should("have.text", "Days");
      
      cy.contains(`8.3%`).should("have.css", "color", "rgba(255, 0, 0, 0.7)");
    });

    cy.log("WIP Total");
    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineCycleMetrics)}`);
    // .its("response.body.data.project.pipelineCycleMetrics")

    cy.getBySel("wip-total").should("contain", `Total`);
    cy.getBySel("wip-total").within(() => {
      cy.getBySel("metricValue").should("have.text", "2");
      cy.getBySel("uom").should("have.text", "Specs");
      cy.getBySel("target").should("have.text", "Limit 5");
    });

    cy.log("WIP Age");
    cy.getBySel("wip-age").should("contain", `Age`);
    cy.getBySel("wip-age").within(() => {
      cy.getBySel("metricValue").should("have.text", "31.49");
      cy.getBySel("uom").should("have.text", "Days");
      cy.getBySel("target").should("have.text", "Target 7 Days");
    });

  });
});
