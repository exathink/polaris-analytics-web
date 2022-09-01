/// <reference types="cypress" />

// import {first, last} from "lodash";
import {ACCOUNT, USER, ORGANIZATION, viewer_info} from "../support/queries-constants";
import {getMutationFullName, getQueryFullName} from "../support/utils";
import {humanizeDuration, daysSinceDate} from "../../src/app/helpers/utility";

describe("Projects Table", () => {
  const ctx = {};

  before(() => {
    cy.fixture(`projectstable/with_organization_instance.json`).then((response) => {
      const organizationKey = response.data.organization.key;
      ctx.organizationKey = organizationKey;
    });

    cy.fixture(`projectstable/${ORGANIZATION.organizationProjects}.json`).then((response) => {
      var lc = new Date(response.data.organization.projects.edges[0].node.latestCommit);
      var lu = new Date(response.data.organization.projects.edges[0].node.latestWorkItemEvent);

      ctx.latestCommit_vs_1 = lc.toDateString();
      ctx.latestUpdate_vs_1 = lu.toDateString();

      lc = new Date(response.data.organization.projects.edges[1].node.latestCommit);
      lu = new Date(response.data.organization.projects.edges[1].node.latestWorkItemEvent);

      ctx.latestCommit_vs_2 = lc.toDateString();
      ctx.latestUpdate_vs_2 = lu.toDateString();
    });
  });

  beforeEach(() => {
    cy.loginWithoutApi();

    cy.interceptQuery({operationName: viewer_info, fixturePath: `viewer_info.json`});

    cy.interceptQuery({
      operationName: ORGANIZATION.with_organization_instance,
      fixturePath: `projectstable/${ORGANIZATION.with_organization_instance}.json`,
    });

    cy.interceptQuery({
      operationName: ORGANIZATION.organizationProjects,
      fixturePath: `projectstable/${ORGANIZATION.organizationProjects}.json`,
    });
  });

  it("should verify all metrics when there is data for organization", () => {
    cy.visit(`/app/dashboard/organizations/Polaris-Dev/${ctx.organizationKey}/value-streams/Value%20Streams`);

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(ORGANIZATION.with_organization_instance)}`,
      `@${getQueryFullName(ORGANIZATION.organizationProjects)}`,
    ]);

    cy.wait(`@${getQueryFullName(ORGANIZATION.organizationProjects)}`);

    cy.getBySel("project-table").find("tr").should("have.length", 5);

    cy.getBySel("project-table")
      .find(".ant-table-row")
      .each(($elm, $index, $list) => {
        switch ($index) {
          case 0: {
            expect($elm.find(".value-stream").text()).to.be.equal("Polaris");
            expect($elm.find(".work-streams").text()).to.be.equal("Polaris PlatformPolaris...");
            expect($elm.find(".repository-count").text()).to.be.equal("22");
            expect($elm.find(".contributor-count").text()).to.be.equal("3");
            expect($elm.find(".lead-time").text()).to.contain("25.84Days");
            expect($elm.find(".cycle-time").text()).to.contain("11.43Days");
            expect($elm.find(".specs").text()).to.contain("3.33Specs");
            expect($elm.find(".effort").text()).to.contain("7.42FTE Days");
            expect($elm.find(".latest-commit").text()).to.contain(
              humanizeDuration(daysSinceDate(ctx.latestCommit_vs_1)) + " ago"
            );
            expect($elm.find(".last-update").text()).to.contain(
              humanizeDuration(daysSinceDate(ctx.latestUpdate_vs_1)) + " ago"
            );
            break;
          }
          case 1: {
            expect($elm.find(".value-stream").text()).to.be.equal("Test projects");
            expect($elm.find(".work-streams").text()).to.be.equal("Test Project 5Test Project 6");
            expect($elm.find(".repository-count").text()).to.be.equal("1");
            expect($elm.find(".contributor-count").text()).to.be.equal("0");
            expect($elm.find(".lead-time").text()).to.contain("N/A");
            expect($elm.find(".cycle-time").text()).to.contain("N/A");
            expect($elm.find(".specs").text()).to.contain("N/A");
            expect($elm.find(".effort").text()).to.contain("N/A");
            expect($elm.find(".latest-commit").text()).to.contain(
              humanizeDuration(daysSinceDate(ctx.latestCommit_vs_2)) + " ago"
            );
            expect($elm.find(".last-update").text()).to.contain(
              humanizeDuration(daysSinceDate(ctx.latestUpdate_vs_2)) + " ago"
            );
            break;
          }
        }
      });
  });
});
