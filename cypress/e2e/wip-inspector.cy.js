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
      aliasQuery(req, WIP_INSPECTOR.projectFlowMetrics);
      aliasQuery(req, WIP_INSPECTOR.projectPipelineCycleMetrics);
      aliasQuery(req, WIP_INSPECTOR.projectPipelineStateDetails);

      aliasQuery(req, ORGANIZATION.organizationProjects);
    });
  });

  it("navigate to wip inspector dashboard, and verify all metrics on it", () => {
    cy.visit("/");

    cy.getBySel("value-streams").click();
    cy.location("pathname").should("include", "/value-streams");

    cy.wait(`@${getQueryFullName(ORGANIZATION.organizationProjects)}`)

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

    // TODO: need to improve this test, instead of calculating the values here, we need to directly assert them if we have a seed db
    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectFlowMetrics)}`)
      .then(interception => {
        const {measurementWindow, specsOnly} = interception.request.body.variables;
        const trends = interception.response.body.data.project.cycleMetricsTrends;
        const [currentTrend, previousTrend] = trends;

        const prop = specsOnly ? "workItemsWithCommits": "WorkItemsInScope"
        const throughputValue = currentTrend[prop] / measurementWindow;

        const trendPercent = ((currentTrend[prop] - previousTrend[prop])/(1.0 * currentTrend[prop]))*100
        const absTrendPercent = Math.abs(trendPercent).toFixed(1);
        cy.getBySel("throughput").should("contain", `Throughput`);
        cy.getBySel("throughput").should("contain", `${throughputValue}`);
        cy.getBySel("throughput").should("contain", `Specs/Day`);
        cy.getBySel("throughput").should("contain", `${absTrendPercent}%`);
      })

    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineCycleMetrics)}`)
    cy.wait(`@${getQueryFullName(WIP_INSPECTOR.projectPipelineStateDetails)}`)

  });
});
