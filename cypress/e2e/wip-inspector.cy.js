/// <reference types="cypress" />

import {gql} from "@apollo/client";
import {ViewerContext} from "../../src/app/framework/viewer/viewerContext";
import {WIP_INSPECTOR, ORGANIZATION, VALUE_STREAM} from "../support/queries-constants";
import {getQueryFullName} from "../support/utils";

// given the data set in fixtures, we are asserting the wip inspector metrics in the UI
describe("Wip Inspector", () => {
  const ctx = {};

  const tooltipHidden = () => cy.get(".highcharts-tooltip").should("not.exist");

  const tooltipVisible = () => cy.get(".highcharts-tooltip").should("have.css", "opacity", "1");

  beforeEach(() => {
    const [username, password] = [Cypress.env("username"), Cypress.env("password")];
    cy.loginByApi(username, password);

    // our auth cookie should be present
    cy.getCookie("session").should("exist");

    // TODO: this is deprecated now, need to replace from cy.session
    Cypress.Cookies.preserveOnce("session");

    cy.aliasQuery(ORGANIZATION.organizationProjects, "organizationProjects.json");
    cy.aliasQuery(VALUE_STREAM.with_project_instance, "with_project_instance.json");

    // Alias Wip Inspector Queries
    cy.aliasQuery(WIP_INSPECTOR.projectFlowMetrics, "projectFlowMetrics.json");
    cy.aliasQuery(WIP_INSPECTOR.projectPipelineCycleMetrics, "projectPipelineCycleMetrics.json");
    cy.aliasQuery(WIP_INSPECTOR.projectPipelineStateDetails);

    cy.visit("/");

    cy.getBySel("value-streams").click();
    cy.location("pathname").should("include", "/value-streams");

    cy.wait(`@${getQueryFullName(ORGANIZATION.organizationProjects)}`)
      .its("response.body.data.organization.projects.edges")
      .should("have.length", 2);

    cy.getBySel("project-table")
      .find("table")
      .find("tbody>tr.ant-table-row")
      .should("have.length", 2)
      .eq(0)
      .find("button.ant-btn")
      .contains(/select/i)
      .click();
    cy.location("pathname").should("include", "/360-view");

    cy.wait(`@${getQueryFullName(VALUE_STREAM.with_project_instance)}`)
      .its("response.body.data.project.settings.flowMetricsSettings")
      .then((settings) => {
        ctx.cycleTimeTarget = settings.cycleTimeTarget;
      });

    cy.request({
      method: "POST",
      url: `${Cypress.env("apiUrl")}/graphql/`,
      failOnStatusCode: false, // dont fail so we can make assertions
      body: {
        operationName: "viewer_info",
        variables: {},
        // TODO: if we use raw query here it works, but not working with imported query
        query:
          "query viewer_info {\n  viewer {\n    key\n    ...ViewerInfoFields\n    __typename\n  }\n}\n\nfragment ViewerInfoFields on Viewer {\n  userName\n  company\n  firstName\n  lastName\n  email\n  systemRoles\n  accountRoles {\n    key\n    name\n    scopeKey\n    role\n    __typename\n  }\n  organizationRoles {\n    key\n    name\n    scopeKey\n    role\n    __typename\n  }\n  accountKey\n  account {\n    id\n    key\n    name\n    featureFlags {\n      edges {\n        node {\n          name\n          key\n          enabled\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    organizations(summariesOnly: true) {\n      count\n      __typename\n    }\n    projects(summariesOnly: true) {\n      count\n      __typename\n    }\n    repositories(summariesOnly: true) {\n      count\n      __typename\n    }\n    __typename\n  }\n  featureFlags {\n    edges {\n      node {\n        name\n        key\n        enabled\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  __typename\n}\n",
      },
    });
    cy.getBySel("wip").click();
    cy.location("pathname").should("include", "/wip");
  });

  it("verify all metrics on wip dashboard", () => {
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
      cy.getBySel("target").should("have.text", `Target ${ctx.cycleTimeTarget} Days`);
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
      cy.getBySel("target").should("have.text", `Target ${ctx.cycleTimeTarget} Days`);
    });

    cy.log("Total Effort");
    cy.getBySel("total-effort").should("contain", `Total Effort`);
    cy.getBySel("total-effort").within(() => {
      cy.getBySel("metricValue").should("have.text", "1.3");
      cy.getBySel("uom").should("have.text", "FTE Days");
    });

    cy.log("Commit Latency");
    cy.getBySel("commit-latency").should("contain", `Commit Latency`);
    cy.getBySel("commit-latency").within(() => {
      cy.getBySel("metricValue").should("have.text", "31.01");
      cy.getBySel("uom").should("have.text", "Days");
    });

    // add test for chart tooltip
    tooltipHidden();
    cy.get("svg.highcharts-root").first().find(".highcharts-point").should("exist").eq(1).trigger("mousemove");
    tooltipVisible();
  });
});
