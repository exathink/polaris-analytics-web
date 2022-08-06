/// <reference types="cypress" />
import {WIP_INSPECTOR, ORGANIZATION, VALUE_STREAM, viewer_info} from "../support/queries-constants";
import {getQueryFullName} from "../support/utils";

// given the data set in fixtures, we are asserting the wip inspector metrics in the UI
describe("Wip Inspector Detail Dashboard", () => {
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

    // our auth cookie should be present
    cy.getCookie("session").should("exist");

    // TODO: this is deprecated now, need to replace from cy.session
    Cypress.Cookies.preserveOnce("session");

    cy.interceptQuery(viewer_info, `${viewer_info}.json`);
    cy.interceptQuery(VALUE_STREAM.with_project_instance, `${VALUE_STREAM.with_project_instance}.json`);

    // Alias Wip Inspector Queries
    cy.interceptQuery(WIP_INSPECTOR.projectFlowMetrics, `${WIP_INSPECTOR.projectFlowMetrics}.json`);
    cy.interceptQuery(WIP_INSPECTOR.projectPipelineCycleMetrics, `${WIP_INSPECTOR.projectPipelineCycleMetrics}.json`);
    cy.interceptQuery(WIP_INSPECTOR.projectPipelineStateDetails, `${WIP_INSPECTOR.projectPipelineStateDetails}.json`);

    cy.visit("/");

    // if there is only one organization, it will land directly on the organization page
    cy.wait(`@${getQueryFullName(viewer_info)}`)
      .its("response.body.data.viewer.organizationRoles")
      .should("have.length", 1);

    cy.visit(`/app/dashboard/value-streams/Polaris/${ctx.projectInstanceKey}/wip/engineering`);
    cy.location("pathname").should("include", "/wip/engineering");
  });

  it.only("Delay Analyzer charts, when there is no data", () => {
    cy.interceptQuery(WIP_INSPECTOR.projectPipelineStateDetails, (req) => {
      req.reply((res) => {
        res.body.data.project.workItems.edges = []
      });
    });

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)
    .its("response.body.data.project.workItems.edges")
    .should("have.length", 0)
    .then(res => {
        cy.getBySel("engineering").find("svg.highcharts-root").first().should("contain", `0 Specs in Coding`)
        cy.getBySel("engineering").find("svg.highcharts-root").eq(1).should("contain", `0 Specs in Delivery`)

        cy.getBySel("engineering").find("svg.highcharts-root").first().find(".highcharts-point").should("not.exist");
        cy.getBySel("engineering").find("svg.highcharts-root").eq(1).find(".highcharts-point").should("not.exist");
    });

    cy.getBySel("wip-latency-chart-panels").within(() => {
      cy.getBySel("ok").first().should("contain", "Moving").and("contain", "N/A")
      cy.getBySel("latency").first().should("contain", "Slowing").and("contain", "N/A")
      cy.getBySel("age").first().should("contain", "Delayed").and("contain", "N/A")
      cy.getBySel("critical").first().should("contain", "Stalled").and("contain", "N/A")

      cy.getBySel("ok").eq(1).should("contain", "Moving").and("contain", "N/A")
      cy.getBySel("latency").eq(1).should("contain", "Slowing").and("contain", "N/A")
      cy.getBySel("age").eq(1).should("contain", "Delayed").and("contain", "N/A")
      cy.getBySel("critical").eq(1).should("contain", "Stalled").and("contain", "N/A")
  })

  });

  it("Delay Analyzer charts, when there is data", () => {
    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)
    .its("response.body.data.project.workItems.edges")
    .should("have.length", 3)
    .then(res => {
      cy.getBySel("engineering").find("svg.highcharts-root").first().should("contain", `2 Specs in Coding`)
      cy.getBySel("engineering").find("svg.highcharts-root").eq(1).should("contain", `1 Spec in Delivery`)

      // 2 chart points + 1 chart point for series
      cy.getBySel("engineering").find("svg.highcharts-root").first().find(".highcharts-point").should("have.length", 3);
      // 1 chart point + 1 chart point for series
      cy.getBySel("engineering").find("svg.highcharts-root").eq(1).find(".highcharts-point").should("have.length", 2);

      // assert on table rows
      cy.getBySel("wip-latency-table").find("tr.ant-table-row").should("have.length", res.length);
    });

    cy.getBySel("wip-latency-chart-panels").within(() => {
        cy.getBySel("ok").first().should("contain", "Moving").and("contain", "0 %")
        cy.getBySel("latency").first().should("contain", "Slowing").and("contain", "0 %")
        cy.getBySel("age").first().should("contain", "Delayed").and("contain", "0 %")
        cy.getBySel("critical").first().should("contain", "Stalled").and("contain", "67 %")

        cy.getBySel("ok").eq(1).should("contain", "Moving").and("contain", "0 %")
        cy.getBySel("latency").eq(1).should("contain", "Slowing").and("contain", "0 %")
        cy.getBySel("age").eq(1).should("contain", "Delayed").and("contain", "0 %")
        cy.getBySel("critical").eq(1).should("contain", "Stalled").and("contain", "33 %")
    })

  });
});
