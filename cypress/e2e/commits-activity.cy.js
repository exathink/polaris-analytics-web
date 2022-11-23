/// <reference types="cypress" />

import moment from "moment";
import {COMMITS, REPOSITORY, viewer_info} from "../support/queries-constants";
import {getQueryFullName, getNMonthsAgo} from "../support/utils";

describe("Commit Activity", () => {
  const ctx = {};
  const fixtureDir = "commits-activity";

  before(() => {
    cy.fixture(`${fixtureDir}/${COMMITS.commit_detail}_initial.json`).then((response) => {
      ctx.commitFileType1 = response.data.commit.fileTypesSummary[0].fileType;
      ctx.commitFileType1Count = response.data.commit.fileTypesSummary[0].count;
      ctx.commitFileType2 = response.data.commit.fileTypesSummary[1].fileType;
      ctx.commitFileType2Count = response.data.commit.fileTypesSummary[1].count;
    });
  });

  beforeEach(() => {
    cy.loginWithoutApi();

    cy.interceptQuery({operationName: viewer_info, fixturePath: `viewer_info.json`});

    cy.fixture(`${fixtureDir}/${REPOSITORY.with_repository_instance}.json`).as("withrep");
    cy.fixture(`${fixtureDir}/${REPOSITORY.dimensionCommits}_1day.json`).as("repcommit1day");
    cy.fixture(`${fixtureDir}/${REPOSITORY.dimensionCommits}_3day.json`).as("repcommit3day");
    cy.fixture(`${fixtureDir}/${COMMITS.commit_detail}_initial.json`).as("commitdetail1");
    cy.fixture(`${fixtureDir}/${COMMITS.commit_detail}_second.json`).as("commitdetail2");
  });

  it("should display correct information for commit activity for the repository", function () {
    var with_repository_instance = this.withrep;
    var rcOneDay = this.repcommit1day;
    var cdinitial = this.commitdetail1;

    // Update dates on fixtures to be 1 month ago

    // with_repository_instance
    var newDate = getNMonthsAgo(1);
    var strNewDate = moment.utc(newDate).format("YYYY-MM-DD");
    var strPreviousDay = Date(newDate) - 1;
    var newTime = moment.utc(with_repository_instance.data.repository.latestCommit).format(" HH:mm:ss");
    with_repository_instance.data.repository.latestCommit = moment
      .utc(strNewDate + newTime)
      .format("YYYY-MM-DDTHH:mm:ss");
    cy.log(with_repository_instance.data.repository.latestCommit);

    // repository_commits_1Day
    for (let i = 0; i < 5; i++) {
      newTime = moment.utc(rcOneDay.data.repository.commits.edges[i].node.commitDate).format(" HH:mm:ss");
      rcOneDay.data.repository.commits.edges[i].node.commitDate = moment
        .utc(strNewDate + newTime)
        .format("YYYY-MM-DDTHH:mm:ss");
      newTime = moment.utc(rcOneDay.data.repository.commits.edges[i].node.authorDate).format(" HH:mm:ss");
      rcOneDay.data.repository.commits.edges[i].node.authorDate = moment
        .utc(strNewDate + newTime)
        .format("YYYY-MM-DDTHH:mm:ss");
    }

    //commit_detail_initial

    newTime = moment.utc(cdinitial.data.commit.commitDate).format(" HH:mm:ss");
    cdinitial.data.commit.commitDate = moment.utc(strNewDate + newTime).format("YYYY-MM-DDTHH:mm:ss");

    newTime = moment.utc(cdinitial.data.commit.authorDate).format(" HH:mm:ss");
    cdinitial.data.commit.authorDate = moment.utc(strNewDate + newTime).format("YYYY-MM-DDTHH:mm:ss");

    cy.interceptQueryWithResponse({operationName: REPOSITORY.with_repository_instance, body: with_repository_instance});
    cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionCommits, body: rcOneDay});
    cy.interceptQueryWithResponse({operationName: COMMITS.commit_detail, body: cdinitial});

    cy.visit(
      `/app/dashboard/repositories/${with_repository_instance.data.repository.name}/${with_repository_instance.data.repository.key}/activity/commits`
    );

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(REPOSITORY.with_repository_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionCommits)}`,
      `@${getQueryFullName(COMMITS.commit_detail)}`,
    ]);

    //Disable live updates during test

    cy.get(".ion-ios-pulse").click();

    //Context Bar

    cy.getBySel("topBarContext").should("contain", "Repository: " + with_repository_instance.data.repository.name);

    // Group By
    cy.get(".tw-pr-1").should("contain", "Group By");
    cy.get('input[value="workItem"]').should("be.checked");

    //Title and Subtitle Bar
    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-title")
      .first()
      .invoke("text")
      .should("match", /5\s*Commits/);

    var localCommitDate = moment
      .utc(with_repository_instance.data.repository.latestCommit)
      .local()
      .format("MM/DD/YYYY hh:mm a");

    var datetocompare = new RegExp("24\\s*hours\\s*ending\\s*" + localCommitDate);

    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-subtitle")
      .first()
      .invoke("text")
      .should("match", datetocompare);

    cy.getBySel("metricTitle").should("contain", "Traceability");
    cy.get(".trendMetricInnerWrapper").should("contain", "100");
    cy.get(".ant-statistic-title").should("contain", "Latest Commit");
    cy.get(".ant-statistic-content").should("contain", "a month ago");

    //X-Axis
    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-xaxis")
      .first()
      .should("contain", "Timeline");

    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-xaxis")
      .first()
      .should("contain", "Bubble Size: Source Lines Changed");

    var beginx = moment.utc(rcOneDay.data.repository.commits.edges[4].node.commitDate).local().format("HH");
    var beginminute = moment.utc(rcOneDay.data.repository.commits.edges[4].node.commitDate).local().format("mm");
    cy.log(beginx);

    if (parseInt(beginminute) > 30) {
      beginx = parseInt(beginx) + 1;
    }

    var endx = moment.utc(rcOneDay.data.repository.commits.edges[0].node.commitDate).local().format("H");
    endx = parseInt(endx) + 1;
    cy.log(beginx);

    var maxLabelCount = parseInt(endx) - parseInt(beginx);
    if (maxLabelCount < 0) {
      maxLabelCount = 24 + maxLabelCount;
    }

    beginx = String(beginx) + ":00";
    endx = String(endx) + ":00";

    if (beginx == "24:00") {
      beginx = moment
        .utc(rcOneDay.data.repository.commits.edges[4].node.commitDate)
        .add("d", 1)
        .local()
        .format("DD. MMM");
    }

    if (endx == "24:00") {
      endx = moment
        .utc(rcOneDay.data.repository.commits.edges[0].node.commitDate)
        .add("d", 1)
        .local()
        .format("DD. MMM");
    }

    cy.log(endx);

    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-xaxis-labels")
      .first()
      .find("text")
      .first()
      .should("contain", beginx);

    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-xaxis-labels")
      .first()
      .find("text")
      .eq(maxLabelCount)
      .should("contain", endx);

    //Y-Axis
    cy.getBySel("commits").find(".highcharts-container").find(".highcharts-yaxis").first().should("contain", "Spec");

    //Y-Axis labels
    cy.getBySel("commits").find("div.highcharts-yaxis-labels").first().children().should("have.length", 2);
    cy.getBySel("commits").find("div.highcharts-yaxis-labels").first().children().first().should("contain", "PP-232");
    cy.getBySel("commits").find("div.highcharts-yaxis-labels").first().children().eq(1).should("contain", "PP-159");

    // Count bubbles
    cy.getBySel("commits")
      .find(".highcharts-root")
      .first()
      .find(".highcharts-series")
      .first()
      .find(".highcharts-point")
      .should("have.length", 4);
    cy.getBySel("commits")
      .find(".highcharts-root")
      .first()
      .find(".highcharts-series")
      .eq(1)
      .find(".highcharts-point")
      .should("have.length", 1);

    cy.log("Test Rollup Bar");

    cy.getBySel("commits_timeline_rollup").find(".highcharts-xaxis-labels").should("contain", "Card");

    cy.getBySel("commits_timeline_rollup").find("g.highcharts-series").should("have.length", 2);

    cy.getBySel("commits")
      .find(".highcharts-root")
      .first()
      .find(".highcharts-series")
      .eq(1)
      .find(".highcharts-point")
      .should("have.length", 1);

    cy.log("Test commit-timelines-table");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .first()
      .should("contain", rcOneDay.data.repository.commits.edges[0].node.name);
    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(1)
      .should("contain", rcOneDay.data.repository.commits.edges[0].node.author);

    var localDateToCompare = moment
      .utc(rcOneDay.data.repository.commits.edges[0].node.commitDate)
      .local()
      .format("M/D/YYYY, h:mm A");

    cy.getBySel("commits-timeline-table").find(".rt-td").eq(2).should("contain", localDateToCompare);

    localDateToCompare = moment
      .utc(rcOneDay.data.repository.commits.edges[0].node.authorDate)
      .local()
      .format("M/D/YYYY, h:mm A");

    cy.getBySel("commits-timeline-table").find(".rt-td").eq(3).should("contain", localDateToCompare);

    cy.getBySel("commits-timeline-table").find(".rt-td").eq(4).should("contain", "a few seconds");

    cy.log("File Types");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-data-label")
      .first()
      .should("contain", ctx.commitFileType1);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-data-label")
      .eq(1)
      .should("contain", ctx.commitFileType2);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-data-label")
      .first()
      .trigger("mouseover");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-tooltip")
      .should("contain", ctx.commitFileType1 + ":")
      .should("contain", ctx.commitFileType1Count);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-data-label")
      .eq(1)
      .trigger("mouseover");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-tooltip")
      .should("contain", ctx.commitFileType2 + ":")
      .should("contain", ctx.commitFileType2Count);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-plot-line-label")
      .should("contain", rcOneDay.data.repository.commits.edges[0].node.stats.files);

    cy.log("Lines");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-data-label")
      .first()
      .should("contain", "++");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-data-label")
      .eq(1)
      .should("contain", "--");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-data-label")
      .first()
      .trigger("mouseover");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-tooltip")
      .should("contain", "Lines added:")
      .should("contain", rcOneDay.data.repository.commits.edges[0].node.stats.insertions);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-data-label")
      .eq(1)
      .trigger("mouseover");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-tooltip")
      .should("contain", "Lines deleted:")
      .should("contain", rcOneDay.data.repository.commits.edges[0].node.stats.deletions);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-plot-line-label")
      .should("contain", rcOneDay.data.repository.commits.edges[0].node.stats.lines);

    cy.log("Commit Message");

    cy.log(rcOneDay.data.repository.commits.edges[0].node.commitMessage);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(7)
      .should("contain", String(rcOneDay.data.repository.commits.edges[0].node.commitMessage).substring(0, 15));

    cy.log("Pagination Info");

    cy.getBySel("commits-timeline-table")
      .find(".pagination-bottom")
      .find(".-center")
      .within(() => {
        cy.get(".-pageInfo").should("contain", "Commit ").should("contain", " of ");
        cy.get(".-currentPage").should("contain", "1");
        cy.get(".-totalPages").should("contain", "5");
      });
  });

  it("should handle group by functionality", function () {
    var with_repository_instance = this.withrep;
    var rcOneDay = this.repcommit1day;
    var cdinitial = this.commitdetail1;

    // Update dates on fixtures to be 1 month ago

    // with_repository_instance
    var newDate = getNMonthsAgo(1);
    var strNewDate = moment.utc(newDate).format("YYYY-MM-DD");
    var newTime = moment.utc(with_repository_instance.data.repository.latestCommit).format(" HH:mm:ss");
    with_repository_instance.data.repository.latestCommit = moment
      .utc(strNewDate + newTime)
      .format("YYYY-MM-DDTHH:mm:ss");
    cy.log(with_repository_instance.data.repository.latestCommit);

    // repository_commits_1Day
    for (let i = 0; i < 5; i++) {
      newTime = moment.utc(rcOneDay.data.repository.commits.edges[i].node.commitDate).format(" HH:mm:ss");
      rcOneDay.data.repository.commits.edges[i].node.commitDate = moment
        .utc(strNewDate + newTime)
        .format("YYYY-MM-DDTHH:mm:ss");
      newTime = moment.utc(rcOneDay.data.repository.commits.edges[i].node.authorDate).format(" HH:mm:ss");
      rcOneDay.data.repository.commits.edges[i].node.authorDate = moment
        .utc(strNewDate + newTime)
        .format("YYYY-MM-DDTHH:mm:ss");
    }

    //commit_detail_initial

    newTime = moment.utc(cdinitial.data.commit.commitDate).format(" HH:mm:ss");
    cdinitial.data.commit.commitDate = moment.utc(strNewDate + newTime).format("YYYY-MM-DDTHH:mm:ss");

    newTime = moment.utc(cdinitial.data.commit.authorDate).format(" HH:mm:ss");
    cdinitial.data.commit.authorDate = moment.utc(strNewDate + newTime).format("YYYY-MM-DDTHH:mm:ss");

    cy.interceptQueryWithResponse({operationName: REPOSITORY.with_repository_instance, body: with_repository_instance});
    cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionCommits, body: rcOneDay});
    cy.interceptQueryWithResponse({operationName: COMMITS.commit_detail, body: cdinitial});

    cy.visit(
      `/app/dashboard/repositories/${with_repository_instance.data.repository.name}/${with_repository_instance.data.repository.key}/activity/commits`
    );

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(REPOSITORY.with_repository_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionCommits)}`,
      `@${getQueryFullName(COMMITS.commit_detail)}`,
    ]);

    cy.get('input[value="author"]').parent(".ant-radio-button").parent(".ant-radio-button-wrapper").click();

    //Title and Subtitle Bar

    var localCommitDate = moment
      .utc(with_repository_instance.data.repository.latestCommit)
      .local()
      .format("MM/DD/YYYY hh:mm a");

    var datetocompare = new RegExp("24\\s*hours\\s*ending\\s*" + localCommitDate);

    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-title")
      .first()
      .invoke("text")
      .should("match", /5\s*Commits/);

    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-subtitle")
      .first()
      .invoke("text")
      .should("match", datetocompare);

    //X-Axis
    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-xaxis")
      .first()
      .should("contain", "Timeline");
    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-xaxis")
      .first()
      .should("contain", "Bubble Size: Source Lines Changed");

    //Y-Axis
    cy.getBySel("commits").find(".highcharts-container").find(".highcharts-yaxis").first().should("contain", "Author");

    //Y-Axis labels
    cy.getBySel("commits").find("div.highcharts-yaxis-labels").first().children().should("have.length", 1);
    cy.getBySel("commits")
      .find("div.highcharts-yaxis-labels")
      .first()
      .children()
      .first()
      .should("contain", rcOneDay.data.repository.commits.edges[0].node.author);

    // Count bubbles
    cy.getBySel("commits")
      .find(".highcharts-root")
      .first()
      .find(".highcharts-series")
      .first()
      .find(".highcharts-point")
      .should("have.length", 4);
    cy.getBySel("commits")
      .find(".highcharts-root")
      .first()
      .find(".highcharts-series")
      .eq(1)
      .find(".highcharts-point")
      .should("have.length", 1);

    cy.log("Test Rollup Bar");

    //Test Rollup Bar

    cy.getBySel("commits_timeline_rollup").find(".highcharts-xaxis-labels").should("contain", "Author");

    cy.getBySel("commits_timeline_rollup").find("g.highcharts-series").should("have.length", 1);
  });

  it("should handle filtering by rollup bar and legend", function () {
    var with_repository_instance = this.withrep;
    var rcOneDay = this.repcommit1day;
    var cdinitial = this.commitdetail1;

    // Update dates on fixtures to be 1 month ago

    // with_repository_instance
    var newDate = getNMonthsAgo(1);
    var strNewDate = moment.utc(newDate).format("YYYY-MM-DD");
    var newTime = moment.utc(with_repository_instance.data.repository.latestCommit).format(" HH:mm:ss");
    with_repository_instance.data.repository.latestCommit = moment
      .utc(strNewDate + newTime)
      .format("YYYY-MM-DDTHH:mm:ss");
    cy.log(with_repository_instance.data.repository.latestCommit);

    // repository_commits_1Day
    for (let i = 0; i < 5; i++) {
      newTime = moment.utc(rcOneDay.data.repository.commits.edges[i].node.commitDate).format(" HH:mm:ss");
      rcOneDay.data.repository.commits.edges[i].node.commitDate = moment
        .utc(strNewDate + newTime)
        .format("YYYY-MM-DDTHH:mm:ss");
      newTime = moment.utc(rcOneDay.data.repository.commits.edges[i].node.authorDate).format(" HH:mm:ss");
      rcOneDay.data.repository.commits.edges[i].node.authorDate = moment
        .utc(strNewDate + newTime)
        .format("YYYY-MM-DDTHH:mm:ss");
    }

    //commit_detail_initial

    newTime = moment.utc(cdinitial.data.commit.commitDate).format(" HH:mm:ss");
    cdinitial.data.commit.commitDate = moment.utc(strNewDate + newTime).format("YYYY-MM-DDTHH:mm:ss");

    newTime = moment.utc(cdinitial.data.commit.authorDate).format(" HH:mm:ss");
    cdinitial.data.commit.authorDate = moment.utc(strNewDate + newTime).format("YYYY-MM-DDTHH:mm:ss");

    cy.interceptQueryWithResponse({operationName: REPOSITORY.with_repository_instance, body: with_repository_instance});
    cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionCommits, body: rcOneDay});
    cy.interceptQueryWithResponse({operationName: COMMITS.commit_detail, body: cdinitial});

    cy.visit(
      `/app/dashboard/repositories/${with_repository_instance.data.repository.name}/${with_repository_instance.data.repository.key}/activity/commits`
    );

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(REPOSITORY.with_repository_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionCommits)}`,
      `@${getQueryFullName(COMMITS.commit_detail)}`,
    ]);

    cy.log("Test filtering by rollup Bar");

    cy.getBySel("commits_timeline_rollup").find("g.highcharts-series").first().click();
    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-title")
      .first()
      .contains(/4\s*Commits/);

    //Unfilter
    cy.getBySel("commits_timeline_rollup").find("g.highcharts-series").first().click();

    cy.log("Test Filter out by legend");

    cy.getBySel("commits").find(".highcharts-legend-item").contains("Commits").click();

    cy.getBySel("commits").find(".highcharts-root").first().find(".highcharts-series").first().should("not.be.visible");
  });

  it("should navigate to next record when clicking next on commit table", function () {
    var with_repository_instance = this.withrep;
    var rcOneDay = this.repcommit1day;
    var cdinitial = this.commitdetail1;
    var rcThreeDay = this.repcommit3day;
    var cdSecond = this.commitdetail2;

    cy.interceptQueryWithResponse({operationName: REPOSITORY.with_repository_instance, body: with_repository_instance});
    cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionCommits, body: rcOneDay});
    cy.interceptQueryWithResponse({operationName: COMMITS.commit_detail, body: cdinitial, times: 1});

    cy.visit(
      `/app/dashboard/repositories/${with_repository_instance.data.repository.name}/${with_repository_instance.data.repository.key}/activity/commits`
    );

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(REPOSITORY.with_repository_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionCommits)}`,
      `@${getQueryFullName(COMMITS.commit_detail)}`,
    ]);

    cy.interceptQueryWithResponse({operationName: COMMITS.commit_detail, body: cdSecond});

    cy.getBySel("commits-timeline-table").find(".pagination-bottom").find(".-next").click();

    cy.wait(`@${getQueryFullName(COMMITS.commit_detail)}`);

    cy.log("Test commit-timelines-table");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .first()
      .should("contain", rcOneDay.data.repository.commits.edges[1].node.name);
    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(1)
      .should("contain", rcOneDay.data.repository.commits.edges[1].node.author);

    var localDateToCompare = moment
      .utc(rcOneDay.data.repository.commits.edges[1].node.commitDate)
      .local()
      .format("M/D/YYYY, h:mm A");

    cy.getBySel("commits-timeline-table").find(".rt-td").eq(2).should("contain", localDateToCompare);

    localDateToCompare = moment
      .utc(rcOneDay.data.repository.commits.edges[1].node.authorDate)
      .local()
      .format("M/D/YYYY, h:mm A");

    cy.getBySel("commits-timeline-table").find(".rt-td").eq(3).should("contain", localDateToCompare);

    cy.getBySel("commits-timeline-table").find(".rt-td").eq(4).should("contain", "a few seconds");

    cy.log("File Types");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-data-label")
      .first()
      .should("contain", cdSecond.data.commit.fileTypesSummary[0].fileType);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-data-label")
      .first()
      .trigger("mouseover");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-tooltip")
      .should("contain", cdSecond.data.commit.fileTypesSummary[0].fileType + ":")
      .should("contain", cdSecond.data.commit.fileTypesSummary[0].count);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(5)
      .find(".highcharts-plot-line-label")
      .should("contain", rcOneDay.data.repository.commits.edges[1].node.stats.files);

    cy.log("Lines");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-data-label")
      .first()
      .should("contain", "++");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-data-label")
      .eq(1)
      .should("contain", "--");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-data-label")
      .first()
      .trigger("mouseover");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-tooltip")
      .should("contain", "Lines added:")
      .should("contain", rcOneDay.data.repository.commits.edges[1].node.stats.insertions);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-data-label")
      .eq(1)
      .trigger("mouseover");

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-tooltip")
      .should("contain", "Lines deleted:")
      .should("contain", rcOneDay.data.repository.commits.edges[1].node.stats.deletions);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(6)
      .find(".highcharts-plot-line-label")
      .should("contain", rcOneDay.data.repository.commits.edges[1].node.stats.lines);

    cy.log("Commit Message");

    cy.log(rcOneDay.data.repository.commits.edges[1].node.commitMessage);

    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .eq(7)
      .should("contain", String(rcOneDay.data.repository.commits.edges[1].node.commitMessage).substring(0, 15));

    cy.log("Pagination Info");

    cy.getBySel("commits-timeline-table")
      .find(".pagination-bottom")
      .find(".-center")
      .within(() => {
        cy.get(".-pageInfo").should("contain", "Commit ").should("contain", " of ");
        cy.get(".-currentPage").should("contain", "2");
        cy.get(".-totalPages").should("contain", "5");
      });
  });

  it("should display 3 days of data when clicking on date slider", function () {
    var with_repository_instance = this.withrep;
    var rcOneDay = this.repcommit1day;
    var cdinitial = this.commitdetail1;
    var rcThreeDay = this.repcommit3day;

    cy.interceptQueryWithResponse({operationName: REPOSITORY.with_repository_instance, body: with_repository_instance});
    cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionCommits, body: rcOneDay, times: 1});
    cy.interceptQueryWithResponse({operationName: COMMITS.commit_detail, body: cdinitial});

    cy.visit(
      `/app/dashboard/repositories/${with_repository_instance.data.repository.name}/${with_repository_instance.data.repository.key}/activity/commits`
    );

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(REPOSITORY.with_repository_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionCommits)}`,
      `@${getQueryFullName(COMMITS.commit_detail)}`,
    ]);

    cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionCommits, body: rcThreeDay});

    cy.get(".ant-slider-mark-text").contains("3").click();

    cy.wait(`@${getQueryFullName(REPOSITORY.dimensionCommits)}`);

    cy.wait(1000);

    //Title and Subtitle Bar
    var textToCompare = new RegExp(rcThreeDay.data.repository.commits.count + "\\s*Commits");

    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-title")
      .first()
      .invoke("text")
      .should("match", textToCompare);

    var localCommitDate = moment
      .utc(with_repository_instance.data.repository.latestCommit)
      .local()
      .format("MM/DD/YYYY hh:mm a");

    var datetocompare = new RegExp("3\\s*Days\\s*ending\\s*" + localCommitDate);

    cy.getBySel("commits")
      .find(".highcharts-container")
      .find(".highcharts-subtitle")
      .first()
      .invoke("text")
      .should("match", datetocompare);
  });

  it("should navigate to commit detail screen when clicking on the commit in the commit timeline table", function () {
    var with_repository_instance = this.withrep;
    var rcOneDay = this.repcommit1day;
    var cdinitial = this.commitdetail1;

    cy.interceptQueryWithResponse({operationName: REPOSITORY.with_repository_instance, body: with_repository_instance});
    cy.interceptQueryWithResponse({operationName: REPOSITORY.dimensionCommits, body: rcOneDay});
    cy.interceptQueryWithResponse({operationName: COMMITS.commit_detail, body: cdinitial});

    cy.visit(
      `/app/dashboard/repositories/${with_repository_instance.data.repository.name}/${with_repository_instance.data.repository.key}/activity/commits`
    );

    cy.wait([
      `@${getQueryFullName(viewer_info)}`,
      `@${getQueryFullName(REPOSITORY.with_repository_instance)}`,
      `@${getQueryFullName(REPOSITORY.dimensionCommits)}`,
      `@${getQueryFullName(COMMITS.commit_detail)}`,
    ]);
    cy.getBySel("commits-timeline-table")
      .find(".rt-td")
      .first()
      .find("a")
      .should("have.attr", "title", "View commit details")
      .click();

    cy.location("pathname").should("include", `${rcOneDay.data.repository.commits.edges[0].node.key}/commit`);
  });
});
