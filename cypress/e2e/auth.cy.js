import {ORGANIZATION, viewer_info} from "../support/queries-constants";

describe("User Login", () => {
  it("User should be able to login with correct credentials", () => {
    // mock response for queries on the home page
    cy.interceptQuery({operationName: viewer_info, fixturePath: `${viewer_info}.json`});
    cy.interceptQuery({
      operationName: ORGANIZATION.with_organization_instance,
      fixturePath: `${ORGANIZATION.with_organization_instance}.json`,
    });

    const [username, password] = [Cypress.env("username"), Cypress.env("password")];

    cy.loginByApi(username, password);
    cy.visit("/");
  });
});
