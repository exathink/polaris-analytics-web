import {WIP_INSPECTOR} from "../support/queries-constants";
import {aliasQuery} from "../support/utils";

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
    });
  });
  it("navigate to wip inspector dashboard, and verify all metrics on it", () => {
    cy.visit("/");
  });
});
