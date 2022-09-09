/// <reference types="cypress" />

import {VALUE_STREAM, REPOSITORY, viewer_info} from "../support/queries-constants";
import {getQueryFullName, getNMonthsAgo, getNDaysAgo} from "../support/utils";

describe("Repositories Detail", () => {
  const ctx = {};

  before(() => {
    cy.fixture(`repositories-detail/${VALUE_STREAM.with_project_instance}.json`).then((response) => {
      const projectKey = response.data.project.key;
      ctx.projectKey = projectKey;
    });

    cy.fixture(`repositories-detail/${REPOSITORY.exclude_repos}_failure.json`).then((response) => {
      const errorMessage = response.data.updateProjectExcludedRepositories.errorMessage;
      ctx.errorMessage = errorMessage;
    });
  });

  beforeEach(() => {
    cy.loginWithoutApi();

    cy.interceptQuery({operationName: viewer_info, fixturePath: `viewer_info.json`});

    cy.interceptQuery({
      operationName: VALUE_STREAM.with_project_instance,
      fixturePath: `repositories-detail/${VALUE_STREAM.with_project_instance}.json`,
    });
  });

  it("should handle projects with no repositories", () => {
    cy.interceptQuery({
      operationName: REPOSITORY.dimensionRepositories,
      fixturePath: `repositories-detail/projectRepositories_withnorepositories.json`,
    });

    cy.visit(
      `/app/dashboard/value-streams/Polaris/37542450-41eb-4ab6-a767-8a046f9eb1bf/repositories/repositories-detail`
    );

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(VALUE_STREAM.with_project_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionRepositories)}`,
    ]);

    cy.getBySel("repositories-detail").find(".ant-table-header").find("tr").should("have.length", 2);
    cy.getBySel("repositories-detail").find(".ant-table-row").should("not.exist");
  });

  it("should verify all metrics when there is data for project", () => {
    cy.fixture(`repositories-detail/projectRepositories.json`).then((fixture) => {
      fixture.data.project.repositories.edges[0].node.latestCommit = getNDaysAgo(23);
      fixture.data.project.repositories.edges[1].node.latestCommit = getNDaysAgo(40);
      fixture.data.project.repositories.edges[2].node.latestCommit = getNDaysAgo(12);
      fixture.data.project.repositories.edges[3].node.latestCommit = getNMonthsAgo(4);
      fixture.data.project.repositories.edges[4].node.latestCommit = getNMonthsAgo(8);

      cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionRepositories, body: fixture});
    });

    cy.visit(`/app/dashboard/value-streams/Polaris/${ctx.projectKey}/repositories/repositories-detail`);

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(VALUE_STREAM.with_project_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionRepositories)}`,
      `@${getQueryFullName(REPOSITORY.dimensionRepositories)}`,
    ]);

    cy.getBySel("repositories-detail").find(".ant-table-header").find("tr").should("have.length", 2);
    cy.getBySel("repositories-detail").find(".ant-table-row").should("have.length", 5);

    /* Active, values and down and up arrow tests */

    cy.getBySel("repositories-detail")
      .contains("polaris-analytics-web")
      .parent("td")
      .parent("tr")
      .within(() => {
        cy.get(".status").should("have.text", "Active");
        cy.get(".contributorCount").should("have.text", "3");
        cy.get(".commits").within(() => {
          cy.getBySel("metricValue").should("contain", "100");
          cy.getBySel("trend-downarrow").should("exist");
          cy.getBySel("trend-downarrow").trigger("mouseover");
        });

        cy.get(".traceability").within(() => {
          cy.getBySel("metricValue").should("contain", "35.00 %");
          cy.getBySel("trend-uparrow").should("exist");
        });
        cy.get(".latestCommit").should("contain", "12 days ago");
        cy.get("button").should("have.attr", "aria-checked", "true");
      });

    /* Test a couple of tooltip values */

    cy.get(".ant-tooltip-inner").get(".badIndicator").should("contain", "30.1");

    cy.getBySel("repositories-detail")
      .contains("polaris-analytics-web")
      .parent("td")
      .parent("tr")
      .get(".traceability")
      .getBySel("trend-uparrow")
      .trigger("mouseover");

    cy.get(".ant-tooltip-inner").get(".goodIndicator").should("contain", "456.1");

    /* Quiescent, N/A and no arrows test */

    cy.getBySel("repositories-detail")
      .contains("polaris-build")
      .parent("td")
      .parent("tr")
      .within(() => {
        cy.get(".status").should("have.text", "Quiescent");
        cy.get(".contributorCount").should("have.value", "");
        cy.get(".commits").within(() => {
          cy.getBySel("metricValue").should("contain", "N/A");
          cy.get(".trendIcon").should("not.exist");
        });

        cy.get(".traceability").within(() => {
          cy.getBySel("metricValue").should("contain", "N/A");
          cy.get(".trendIcon").should("not.exist");
        });
        cy.get(".latestCommit").should("contain", "a month ago");
      });

    /* Dormant status */

    cy.getBySel("repositories-detail")
      .contains("polaris-integrations")
      .parent("td")
      .parent("tr")
      .within(() => {
        cy.get(".status").should("have.text", "Dormant");
        cy.get(".latestCommit").should("contain", "4 months ago");
      });

    /* Active Status */

    cy.getBySel("repositories-detail")
      .contains("polaris-repos-intake-db")
      .parent("td")
      .parent("tr")
      .within(() => {
        cy.get(".status").should("have.text", "Inactive");
        cy.get(".latestCommit").should("contain", "8 months ago");
        cy.get("button").should("have.attr", "aria-checked", "false");
      });
  });

  it("should allow user to exclude repositories", () => {
    cy.fixture(`repositories-detail/projectRepositories.json`).then((fixture) => {
      fixture.data.project.repositories.edges[0].node.latestCommit = getNDaysAgo(23);
      fixture.data.project.repositories.edges[1].node.latestCommit = getNDaysAgo(40);
      fixture.data.project.repositories.edges[2].node.latestCommit = getNDaysAgo(12);
      fixture.data.project.repositories.edges[3].node.latestCommit = getNMonthsAgo(4);
      fixture.data.project.repositories.edges[4].node.latestCommit = getNMonthsAgo(8);

      cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionRepositories, body: fixture});
    });

    cy.interceptQuery({
      operationName: REPOSITORY.exclude_repos,
      fixturePath: `repositories-detail/${REPOSITORY.exclude_repos}_success.json`,
    });

    cy.visit(`/app/dashboard/value-streams/Polaris/${ctx.projectKey}/repositories/repositories-detail`);

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(VALUE_STREAM.with_project_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionRepositories)}`,
      `@${getQueryFullName(REPOSITORY.dimensionRepositories)}`,
    ]);

    cy.getBySel("repositories-detail").find(".ant-table-header").find("tr").should("have.length", 2);
    cy.getBySel("repositories-detail").find(".ant-table-row").should("have.length", 5);

    cy.getBySel("repositories-detail")
      .contains("polaris-integrations")
      .parent("td")
      .parent("tr")
      .find("button")
      .click();

    cy.contains("Save").click();

    cy.wait(`@${getQueryFullName(REPOSITORY.exclude_repos)}`);

    cy.contains("Successfully Updated", {matchCase: false}).should("exist");
  });

  it("fails to exclude repositories", () => {
    cy.fixture(`repositories-detail/projectRepositories.json`).then((fixture) => {
      fixture.data.project.repositories.edges[0].node.latestCommit = getNDaysAgo(23);
      fixture.data.project.repositories.edges[1].node.latestCommit = getNDaysAgo(40);
      fixture.data.project.repositories.edges[2].node.latestCommit = getNDaysAgo(12);
      fixture.data.project.repositories.edges[3].node.latestCommit = getNMonthsAgo(4);
      fixture.data.project.repositories.edges[4].node.latestCommit = getNMonthsAgo(8);

      cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionRepositories, body: fixture});
    });

    cy.interceptQuery({
      operationName: REPOSITORY.exclude_repos,
      fixturePath: `repositories-detail/${REPOSITORY.exclude_repos}_failure.json`,
    });

    cy.visit(`/app/dashboard/value-streams/Polaris/${ctx.projectKey}/repositories/repositories-detail`);

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(VALUE_STREAM.with_project_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionRepositories)}`,
      `@${getQueryFullName(REPOSITORY.dimensionRepositories)}`,
    ]);

    cy.getBySel("repositories-detail").find(".ant-table-header").find("tr").should("have.length", 2);
    cy.getBySel("repositories-detail").find(".ant-table-row").should("have.length", 5);

    cy.getBySel("repositories-detail")
      .contains("polaris-integrations")
      .parent("td")
      .parent("tr")
      .find("button")
      .click();

    cy.contains("Save").click();

    cy.wait(`@${getQueryFullName(REPOSITORY.exclude_repos)}`);

    cy.contains(ctx.errorMessage, {matchCase: false}).should("exist");
  });
});
