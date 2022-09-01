/// <reference types="cypress" />

import {ACCOUNT, USER, viewer_info} from "../support/queries-constants";
import {getMutationFullName, getQueryFullName} from "../support/utils";

var lastname = "Darcy";

describe("Edit User flow", () => {
  beforeEach(() => {
    cy.loginWithoutApi();

    cy.interceptQuery({operationName: viewer_info, fixturePath: `viewer_info.json`});

    cy.interceptQuery({
      operationName: ACCOUNT.accountUsers,
      fixturePath: "accountUsers.json",
    });

    cy.interceptQuery({
      operationName: ACCOUNT.getContributorAliasesInfo,
      fixturePath: `${ACCOUNT.getContributorAliasesInfo}.json`,
    });
  });

  it("should edit a user", () => {
    cy.interceptMutation({operationName: USER.update_user, fixturePath: "updateUser_success.json"});

    cy.visit("/app/admin/account");
    cy.wait([`@${getQueryFullName(viewer_info)}`, `@${getQueryFullName(ACCOUNT.accountUsers)}`]);

    cy.getBySel("users").within(() => {
      cy.getBySel("analysis-view").click();
      cy.location("pathname").should("include", "/users");
    });

    cy.contains("Elizabeth Bennett").parent("tr").find("button").click();

    cy.get("form").get("input#lastName").clear().type(lastname).should("have.value", lastname);

    cy.contains(/^Save$/).click();

    cy.wait(`@${getMutationFullName(USER.update_user)}`);

    cy.contains("User Elizabeth Darcy was updated", {matchCase: false}).should("be.visible");
  });

  it("fails to update the user", () => {
    cy.interceptMutation({operationName: USER.update_user, fixturePath: "updateUser_failure.json"});

    cy.visit("/app/admin/account");
    cy.wait([`@${getQueryFullName(viewer_info)}`, `@${getQueryFullName(ACCOUNT.accountUsers)}`]);

    cy.getBySel("users").within(() => {
      cy.getBySel("analysis-view").click();
      cy.location("pathname").should("include", "/users");
    });

    cy.contains("Elizabeth Bennett").parent("tr").find("button").click();

    cy.get("form").get("input#lastName").clear().type(lastname).should("have.value", lastname);

    cy.contains(/^Save$/).click();

    cy.wait(`@${getMutationFullName(USER.update_user)}`);

    cy.contains("Elizabeth Darcy").should("not.exist");
  });
});
