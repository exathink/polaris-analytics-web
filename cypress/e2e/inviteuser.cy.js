/// <reference types="cypress" />

import {first, last} from "lodash";
import {ACCOUNT, USER, viewer_info} from "../support/queries-constants";
import {getMutationFullName, getQueryFullName} from "../support/utils";

var email = "priya_mukundan@yahoo.com";
var firstname = "Elizabeth";
var lastname = "Bennett";

describe("Invite User flow", () => {
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

  it("should invite a user", () => {
    cy.interceptMutation({operationName: USER.inviteUser, fixturePath: "inviteUser_success.json"});

    cy.visit("/app/admin/account");
    cy.wait(`@${getQueryFullName(viewer_info)}`);
    cy.wait(`@${getQueryFullName(ACCOUNT.accountUsers)}`);

    cy.getBySel("create-connector-button").click();

    cy.get("form").within(($form) => {
      cy.get("input#email").type(email).should("have.value", email);
      cy.get("input#firstName").type(firstname).should("have.value", firstname);
      cy.get("input#lastName").type(lastname).should("have.value", lastname);
    });

    cy.contains(/^Invite$/).click();

    cy.wait(`@${getMutationFullName(USER.inviteUser)}`);

    cy.contains("invited to").should("exist");
  });

  it("fails to invite a user", () => {
    cy.interceptMutation({operationName: USER.inviteUser, fixturePath: `inviteUser_failure.json`});

    cy.visit("/app/admin/account");

    cy.wait(`@${getQueryFullName(ACCOUNT.accountUsers)}`);

    cy.getBySel("create-connector-button").click();

    cy.get("form").within(($form) => {
      cy.get("input#email").type(email).should("have.value", email);
      cy.get("input#firstName").type(firstname).should("have.value", firstname);
      cy.get("input#lastName").type(lastname).should("have.value", lastname);
    });

    cy.contains(/^Invite$/).click();

    cy.wait(`@${getMutationFullName(USER.inviteUser)}`);

    cy.contains("User Elizabeth Bennett was created and invited to").should("not.exist");
  });

  it("invites existing user to account", () => {
    cy.interceptMutation({operationName: USER.inviteUser, fixturePath: `inviteUser_existing.json`});

    cy.visit("/app/admin/account");

    cy.wait(`@${getQueryFullName(ACCOUNT.accountUsers)}`);

    cy.getBySel("create-connector-button").click();

    cy.get("form").within(($form) => {
      cy.get("input#email").type(email).should("have.value", email);
      cy.get("input#firstName").type(firstname).should("have.value", firstname);
      cy.get("input#lastName").type(lastname).should("have.value", lastname);
    });
    cy.contains(/^Invite$/).click();

    cy.wait(`@${getMutationFullName(USER.inviteUser)}`);

    cy.contains("Existing user Elizabeth").should("exist");
  });
});
