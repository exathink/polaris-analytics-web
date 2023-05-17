/// <reference types="cypress" />
import {WIP_INSPECTOR, ORGANIZATION, VALUE_STREAM, viewer_info} from "../support/queries-constants";
import {getQueryFullName} from "../support/utils";

// given the data set in fixtures, we are asserting the wip inspector metrics in the UI
describe("Wip Inspector", () => {
  const ctx = {};

  // const tooltipHidden = () => cy.get(".highcharts-tooltip").should("not.exist");

  // const tooltipVisible = () => cy.get(".highcharts-tooltip").should("have.css", "opacity", "1");

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

    // Alias Wip Inspector Queries
    cy.interceptQuery({
      operationName: WIP_INSPECTOR.projectFlowMetrics,
      fixturePath: `${WIP_INSPECTOR.projectFlowMetrics}.json`,
    });
    cy.interceptQuery({
      operationName: WIP_INSPECTOR.projectPipelineCycleMetrics,
      fixturePath: `${WIP_INSPECTOR.projectPipelineCycleMetrics}.json`,
    });
    cy.interceptQuery({
      operationName: WIP_INSPECTOR.projectFlowMetricsTrends,
      fixturePath: `${WIP_INSPECTOR.projectFlowMetricsTrends}.json`,
    });
    cy.interceptQuery({
      operationName: WIP_INSPECTOR.projectPipelineStateDetails,
      fixturePath: `${WIP_INSPECTOR.projectPipelineStateDetails}.json`,
    });

    cy.visit("/");

    // if there is only one organization, it will land directly on the organization page
    cy.wait(`@${getQueryFullName(viewer_info)}`)
      .its("response.body.data.viewer.organizationRoles")
      .should("have.length", 1);

    cy.visit(`/app/dashboard/value-streams/Polaris/${ctx.projectInstanceKey}/wip`);
    cy.location("pathname").should("include", "/wip");
  });

  it("verify all metrics on wip dashboard, when there is no data for metrics", () => {
    cy.log("Throughput Metric");

    // this intercept will override the intercept from beforeEach block
    cy.interceptQueryWithResponse({
      operationName: WIP_INSPECTOR.projectFlowMetrics,
      body: {data: {project: {cycleMetricsTrends: []}}}
    });

    cy.interceptQueryWithResponse({
      operationName: WIP_INSPECTOR.projectFlowMetricsTrends,
      body: {data: {project: {cycleMetricsTrends: []}}}
    });

    cy.interceptQueryWithResponse({
      operationName: WIP_INSPECTOR.projectPipelineCycleMetrics,
      // res.body.data.project.pipelineCycleMetrics = {};
      body: {data: {project: {pipelineCycleMetrics: {}}}}
    });

    cy.interceptQueryWithResponse({
      operationName: WIP_INSPECTOR.projectPipelineStateDetails,
      // res.body.data.project.workItems.edges = [];
      body: {data: {project: {workItems: {edges: []}}}}
    });

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectFlowMetrics)}`)
      .its("response.body.data.project.cycleMetricsTrends")
      .should("have.length", 0);

    cy.getBySel("summary-wip").should("contain", `Work in Progress`);
    cy.getBySel("completed-work").should("contain", `Completed Work`);


    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)
    .its("response.body.data.project.workItems.edges")
    .then(res => {
      cy.getBySel("engineering").find("svg.highcharts-root").should("contain", `${res.length} Work Items in Coding`)
      cy.getBySel("delivery").find("svg.highcharts-root").should("contain", `0 Work Items in Shipping`)
    });
  });

  it("verify all metrics on wip dashboard, when there is data for metrics", () => {
    cy.log("Throughput Metric");

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectFlowMetrics)}`)
      .its("response.body.data.project.cycleMetricsTrends")
      .should("have.length", 2);

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)
      .its("response.body.data.project.workItems.edges")
      .should("have.length", 4)
      .then(res => {
        cy.getBySel("engineering").find("svg.highcharts-root").should("contain", `2 Work Items in Coding`)
        cy.getBySel("delivery").find("svg.highcharts-root").should("contain", `2 Work Items in Shipping`)
      });

    // TODO: Need to fix this test later, its failing on the cli run but passing on desktop app run
    // add test for chart tooltip
    // tooltipHidden();
    // cy.getBySel("engineering").find("svg.highcharts-root").find(".highcharts-point").should("exist").eq(1).trigger("mousemove");
    // tooltipVisible();

    cy.getBySel("engineering").within(() => {
      cy.getBySel("analysis-view").should("exist").click()
      cy.location("pathname").should("include", "/wip/engineering");
    })

    cy.getBySel("engineering").within(() => {
      cy.getBySel("analysis-view").should("exist").click()
      cy.location("pathname").should("include", "/wip");
    })

    cy.getBySel("delivery").within(() => {
      cy.getBySel("analysis-view").should("exist").click()
      cy.location("pathname").should("include", "/wip/delivery");
    })

    cy.getBySel("delivery").within(() => {
      cy.getBySel("analysis-view").should("exist").click()
      cy.location("pathname").should("include", "/wip");
    })

  });
});
