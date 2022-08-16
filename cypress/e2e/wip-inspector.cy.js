/// <reference types="cypress" />
import {WIP_INSPECTOR, ORGANIZATION, VALUE_STREAM, viewer_info} from "../support/queries-constants";
import {getQueryFullName} from "../support/utils";

// given the data set in fixtures, we are asserting the wip inspector metrics in the UI
describe("Wip Inspector", () => {
  const ctx = {};

  const tooltipHidden = () => cy.get(".highcharts-tooltip").should("not.exist");

  const tooltipVisible = () => cy.get(".highcharts-tooltip").should("have.css", "opacity", "1");

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
    const [username, password] = [Cypress.env("username"), Cypress.env("password")];
    cy.loginByApi(username, password);

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
    cy.interceptQueryWithCb({
      operationName: WIP_INSPECTOR.projectFlowMetrics,
      fixtureCb: (req) => {
        req.reply((res) => {
          // Modify the response body directly
          res.body.data.project.cycleMetricsTrends = [];
        });
      },
    });

    cy.interceptQueryWithCb({
      operationName: WIP_INSPECTOR.projectPipelineCycleMetrics,
      fixtureCb: (req) => {
        req.reply((res) => {
          res.body.data.project.pipelineCycleMetrics = {};
        });
      },
    });

    cy.interceptQueryWithCb({
      operationName: WIP_INSPECTOR.projectPipelineStateDetails,
      fixtureCb: (req) => {
        req.reply((res) => {
          res.body.data.project.workItems.edges = [];
        });
      },
    });

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectFlowMetrics)}`)
      .its("response.body.data.project.cycleMetricsTrends")
      .should("have.length", 0);

    cy.getBySel("throughput").should("contain", `Throughput`);
    cy.getBySel("throughput").within(() => {
      cy.getBySel("metricValue").should("have.text", "N/A");
      cy.getBySel("uom").should("not.be.visible");
      cy.getBySel("trend-percent-val").should("not.exist");
    });

    cy.log("CycleTime Metric");
    cy.getBySel("cycletime").should("contain", `Cycle Time`);
    cy.getBySel("cycletime").within(() => {
      cy.getBySel("metricValue").should("have.text", "N/A");
      cy.getBySel("uom").should("not.be.visible");
      cy.getBySel("target").should("not.exist");

      cy.getBySel("trend-percent-val").should("not.exist");
    });

    cy.log("WIP Total");
    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineCycleMetrics)}`);

    cy.getBySel("wip-total").should("contain", `Total`);
    cy.getBySel("wip-total").within(() => {
      cy.getBySel("metricValue").should("have.text", "N/A");
      cy.getBySel("uom").should("not.be.visible");
      cy.getBySel("target").should("not.exist");
    });

    cy.log("WIP Age");
    cy.getBySel("wip-age").should("contain", `Age`);
    cy.getBySel("wip-age").within(() => {
      cy.getBySel("metricValue").should("have.text", "N/A");
      cy.getBySel("uom").should("not.be.visible");
      cy.getBySel("target").should("not.exist");
    });

    cy.log("Total Effort");
    cy.getBySel("total-effort").should("contain", `Total Effort`);
    cy.getBySel("total-effort").within(() => {
      cy.getBySel("metricValue").should("have.text", "N/A");
      cy.getBySel("uom").should("not.be.visible");
    });

    cy.log("Commit Latency");
    cy.getBySel("commit-latency").should("contain", `Commit Latency`);
    cy.getBySel("commit-latency").within(() => {
      cy.getBySel("metricValue").should("have.text", "N/A");
      cy.getBySel("uom").should("not.be.visible");
    });

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)
    .its("response.body.data.project.workItems.edges")
    .then(res => {
      cy.getBySel("engineering").find("svg.highcharts-root").should("contain", `${res.length} Specs in Coding`)
      cy.getBySel("delivery").find("svg.highcharts-root").should("contain", `0 Specs in Delivery`)
    });
  });

  it("verify all metrics on wip dashboard, when there is data for metrics", () => {
    cy.log("Throughput Metric");

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectFlowMetrics)}`)
      .its("response.body.data.project.cycleMetricsTrends")
      .should("have.length", 2);

    cy.getBySel("throughput").should("contain", `Throughput`);
    cy.getBySel("throughput").within(() => {
      cy.getBySel("metricValue").should("have.text", "0.7");
      cy.getBySel("uom").should("have.text", "Specs/Day");

      cy.getBySel("trend-percent-val").should("contain", "15%").and("have.css", "color", "rgba(0, 128, 0, 0.7)");
    });

    cy.log("CycleTime Metric");
    cy.getBySel("cycletime").should("contain", `Cycle Time`);
    cy.getBySel("cycletime").within(() => {
      cy.getBySel("metricValue").should("have.text", "2.95");
      cy.getBySel("uom").should("have.text", "Days");
      cy.getBySel("target").should("have.text", `Target ${ctx.cycleTimeTarget} Days`);

      cy.getBySel("trend-percent-val").should("contain", "8.3%").and("have.css", "color", "rgba(255, 0, 0, 0.7)");
    });

    cy.log("WIP Total");
    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineCycleMetrics)}`);

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

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)
      .its("response.body.data.project.workItems.edges")
      .should("have.length", 4)
      .then(res => {
        cy.getBySel("engineering").find("svg.highcharts-root").should("contain", `2 Specs in Coding`)
        cy.getBySel("delivery").find("svg.highcharts-root").should("contain", `2 Specs in Delivery`)
      });

    // add test for chart tooltip
    tooltipHidden();
    cy.getBySel("engineering").find("svg.highcharts-root").find(".highcharts-point").should("exist").eq(1).trigger("mousemove");
    tooltipVisible();

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
