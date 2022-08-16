/// <reference types="cypress" />

import moment from "moment";
import {WIP_INSPECTOR, ORGANIZATION, VALUE_STREAM, viewer_info} from "../support/queries-constants";
import {getQueryFullName} from "../support/utils";

export function getNDaysAgo(n) {
  return moment().subtract(n, "days").utc().format("YYYY-MM-DDTHH:mm:ss");
}

export function getNHoursAgo(n) {
  return moment().subtract(n, "hours").utc().format("YYYY-MM-DDTHH:mm:ss");
}

// given the data set in fixtures, we are asserting the wip inspector metrics in the UI
describe("Wip Inspector Detail Dashboard", () => {
  const ctx = {};

  before(() => {
    cy.fixture(`${VALUE_STREAM.with_project_instance}.json`).then((response) => {
      const settings = response.data.project.settings.flowMetricsSettings;
      ctx.cycleTimeTarget = settings.cycleTimeTarget;
    });

    cy.fixture(`${ORGANIZATION.organizationProjects}.json`).then((response) => {
      const projectInstanceKey = response.data.organization.projects.edges[0].node.key;
      ctx.projectInstanceKey = projectInstanceKey;
    });
  });

  beforeEach(() => {
    cy.loginWithoutApi();

    cy.interceptQuery({operationName: viewer_info, fixturePath: `${viewer_info}.json`});
    cy.interceptQuery({
      operationName: VALUE_STREAM.with_project_instance,
      fixturePath: `${VALUE_STREAM.with_project_instance}.json`,
    });

    cy.visit("/");

    // if there is only one organization, it will land directly on the organization page
    cy.wait(`@${getQueryFullName(viewer_info)}`)
      .its("response.body.data.viewer.organizationRoles")
      .should("have.length", 1);

    cy.visit(`/app/dashboard/value-streams/Polaris/${ctx.projectInstanceKey}/wip/engineering`);
    cy.location("pathname").should("include", "/wip/engineering");
  });

  it("Delay Analyzer charts, when there is no data", () => {
    cy.interceptQueryWithResponse({
      operationName: WIP_INSPECTOR.projectPipelineStateDetails,
      body: {data: {project: {workItems: {edges: []}}}},
    });

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)
      .its("response.body.data.project.workItems.edges")
      .should("have.length", 0)
      .then((res) => {
        cy.getBySel("engineering").find("svg.highcharts-root").first().should("contain", `0 Specs in Coding`);
        cy.getBySel("engineering").find("svg.highcharts-root").eq(1).should("contain", `0 Specs in Delivery`);

        cy.getBySel("engineering").find("svg.highcharts-root").first().find(".highcharts-point").should("not.exist");
        cy.getBySel("engineering").find("svg.highcharts-root").eq(1).find(".highcharts-point").should("not.exist");
      });

    cy.getBySel("wip-latency-chart-panels").within(() => {
      cy.getBySel("ok").first().should("contain", "Moving").and("contain", "N/A");
      cy.getBySel("latency").first().should("contain", "Slowing").and("contain", "N/A");
      cy.getBySel("age").first().should("contain", "Delayed").and("contain", "N/A");
      cy.getBySel("critical").first().should("contain", "Stalled").and("contain", "N/A");

      cy.getBySel("ok").eq(1).should("contain", "Moving").and("contain", "N/A");
      cy.getBySel("latency").eq(1).should("contain", "Slowing").and("contain", "N/A");
      cy.getBySel("age").eq(1).should("contain", "Delayed").and("contain", "N/A");
      cy.getBySel("critical").eq(1).should("contain", "Stalled").and("contain", "N/A");
    });
  });

  it("Delay Analyzer charts, when there is data", () => {
    cy.fixture(`${WIP_INSPECTOR.projectPipelineStateDetails}.json`).then((fixture) => {
      fixture.data.project.workItems.edges[0].node.workItemStateDetails.latestCommit = getNHoursAgo(10);
      fixture.data.project.workItems.edges[0].node.workItemStateDetails.currentStateTransition.eventDate =
        getNDaysAgo(4);

      fixture.data.project.workItems.edges[1].node.workItemStateDetails.latestCommit = getNDaysAgo(2);
      fixture.data.project.workItems.edges[1].node.workItemStateDetails.currentStateTransition.eventDate =
        getNDaysAgo(3);

      fixture.data.project.workItems.edges[3].node.workItemStateDetails.latestCommit = getNHoursAgo(10);
      fixture.data.project.workItems.edges[3].node.workItemStateDetails.currentStateTransition.eventDate =
        getNDaysAgo(8);

        cy.interceptQueryWithResponse({
          operationName: WIP_INSPECTOR.projectPipelineStateDetails,
          body: fixture
        });
    });

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)
      .its("response.body.data.project.workItems.edges")
      .should("have.length", 4)
      .then((res) => {
        cy.getBySel("engineering").find("svg.highcharts-root").first().should("contain", `2 Specs in Coding`);
        cy.getBySel("engineering").find("svg.highcharts-root").eq(1).should("contain", `2 Specs in Delivery`);

        // 2 chart points + 1 chart point for series
        cy.getBySel("engineering")
          .find("svg.highcharts-root")
          .first()
          .find(".highcharts-point")
          .should("have.length", 3);
        cy.getBySel("engineering").find("svg.highcharts-root").eq(1).find(".highcharts-point").should("have.length", 3);

        // assert on table rows
        cy.getBySel("wip-latency-table").find("tr.ant-table-row").should("have.length", res.length);
      });

    cy.getBySel("wip-latency-chart-panels").within(() => {
      cy.getBySel("ok").first().should("contain", "Moving").and("contain", "25 %");
      cy.getBySel("latency").first().should("contain", "Slowing").and("contain", "25 %");
      cy.getBySel("age").first().should("contain", "Delayed").and("contain", "0 %");
      cy.getBySel("critical").first().should("contain", "Stalled").and("contain", "0 %");

      cy.getBySel("ok").eq(1).should("contain", "Moving").and("contain", "0 %");
      cy.getBySel("latency").eq(1).should("contain", "Slowing").and("contain", "0 %");
      cy.getBySel("age").eq(1).should("contain", "Delayed").and("contain", "25 %");
      cy.getBySel("critical").eq(1).should("contain", "Stalled").and("contain", "25 %");
    });
  });
});
