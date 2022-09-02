/// <reference types="cypress" />

import {ACCOUNT, USER, ORGANIZATION, viewer_info} from "../support/queries-constants";
import {getQueryFullName, getNMonthsAgo, getNHoursAgo, getNDaysAgo, getNYearsAgo} from "../support/utils";
import {humanizeDuration, daysSinceDate} from "../../src/app/helpers/utility";

describe("Projects Table", () => {
  const ctx = {};

  before(() => {
    cy.fixture(`projectstable/with_organization_instance.json`).then((response) => {
      const organizationKey = response.data.organization.key;
      ctx.organizationKey = organizationKey;
    });
  });

  beforeEach(() => {
    cy.loginWithoutApi();

    cy.interceptQuery({operationName: viewer_info, fixturePath: `viewer_info.json`});

    cy.interceptQuery({
      operationName: ORGANIZATION.with_organization_instance,
      fixturePath: `projectstable/${ORGANIZATION.with_organization_instance}.json`,
    });
  });

  it("should handle condition when there are no projects for an organization", () => {
    ctx.organizationKey = "f00f0779-33a7-46b9-bcff-15daa0a82628";

    cy.fixture(`projectstable/${ORGANIZATION.organizationProjects}.json`).then((fixture) => {
      fixture.data.organization =
        '{"id": "T3JnYW5pemF0aW9uOmYwMGYwNzc5LTMzYTctNDZiOS1iY2ZmLTE1ZGFhMGE4MjYyOA==","projects": {"count": 0,"edges": []}}';
      cy.interceptQueryWithResponse({operationName: ORGANIZATION.organizationProjects, body: fixture});
    });

    cy.visit(`/app/dashboard/organizations/Polaris-Dev/${ctx.organizationKey}/value-streams/Value%20Streams`);
    cy.location("pathname").should("include", "/value-streams/Value%20Streams");

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(ORGANIZATION.with_organization_instance)}`,
      `@${getQueryFullName(ORGANIZATION.organizationProjects)}`,
    ]);

    cy.getBySel("project-table").find(".ant-table-row").should("not.exist");
  });

  it("should verify all metrics when there is data for organization", () => {
    cy.fixture(`projectstable/${ORGANIZATION.organizationProjects}.json`).then((fixture) => {
      fixture.data.organization.projects.edges[0].node.latestCommit = getNDaysAgo(3);
      fixture.data.organization.projects.edges[0].node.latestWorkItemEvent = getNHoursAgo(3);

      fixture.data.organization.projects.edges[1].node.latestCommit = getNYearsAgo(1);
      fixture.data.organization.projects.edges[1].node.latestWorkItemEvent = getNMonthsAgo(10);

      cy.interceptQueryWithResponse({operationName: ORGANIZATION.organizationProjects, body: fixture});
    });

    cy.visit(`/app/dashboard/organizations/Polaris-Dev/${ctx.organizationKey}/value-streams/Value%20Streams`);

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(ORGANIZATION.with_organization_instance)}`,
      `@${getQueryFullName(ORGANIZATION.organizationProjects)}`,
      `@${getQueryFullName(ORGANIZATION.organizationProjects)}`,
    ]);

    cy.getBySel("project-table").find(".ant-table-header").find("tr").should("have.length", 2);
    cy.getBySel("project-table").find(".ant-table-row").should("have.length", 2);

    cy.getBySel("project-table")
      .find(".ant-table-row")
      .eq(0)
      .within(() => {
        cy.get(".value-stream").should("have.text", "Polaris");
        cy.get(".work-streams").should("have.text", "Polaris PlatformPolaris...");
        cy.get(".repository-count").should("have.text", "22");
        cy.get(".contributor-count").should("have.text", "3");
        cy.get(".lead-time").should("contain", "25.84Days");
        cy.get(".cycle-time").should("contain", "11.43Days");
        cy.get(".specs").should("contain", "3.33Specs");
        cy.get(".effort").should("contain", "7.42FTE Days");
        cy.get(".latest-commit").should("contain", "3 days ago");
        cy.get(".last-update").should("contain", "3 hours ago");
      });

    cy.getBySel("project-table")
      .find(".ant-table-row")
      .eq(1)
      .within(() => {
        cy.get(".value-stream").should("have.text", "Test projects");
        cy.get(".work-streams").should("have.text", "Test Project 5Test Project 6");
        cy.get(".repository-count").should("have.text", "1");
        cy.get(".contributor-count").should("have.text", "0");
        cy.get(".lead-time").should("contain", "N/A");
        cy.get(".cycle-time").should("contain", "N/A");
        cy.get(".specs").should("contain", "N/A");
        cy.get(".effort").should("contain", "N/A");
        cy.get(".latest-commit").should("contain", "a year ago");
        cy.get(".last-update").should("contain", "10 months ago");
      });
  });
});
