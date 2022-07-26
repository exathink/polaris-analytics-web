import {WIP_INSPECTOR, ORGANIZATION} from "../support/queries-constants";
import {aliasQuery, getQueryFullName} from "../support/utils";

describe("Wip Inspector", () => {
  beforeEach(() => {
    const [username, password] = [Cypress.env("username"), Cypress.env("password")];
    cy.loginByApi(username, password);

    // our auth cookie should be present
    cy.getCookie("session").should("exist");
    Cypress.Cookies.preserveOnce("session");

    cy.intercept("POST", "/graphql", (req) => {
      // Alias Wip Inspector Queries
      aliasQuery(req, WIP_INSPECTOR.getProjectImplementationCost);
      aliasQuery(req, WIP_INSPECTOR.projectCapacityTrends);
      aliasQuery(req, WIP_INSPECTOR.projectFlowMetricsTrends);
      aliasQuery(req, WIP_INSPECTOR.projectFlowMixTrends);
      aliasQuery(req, WIP_INSPECTOR.projectTraceabilityTrends);

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
  });
});
