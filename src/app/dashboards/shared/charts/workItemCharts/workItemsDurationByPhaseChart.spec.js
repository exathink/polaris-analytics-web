import React from "react";
import {
  Colors,
  WorkItemStateTypeColor,
  WorkItemStateTypeSortOrder,
  WorkItemTypeSortOrder,
} from "../../../shared/config";
import {PlotLines} from "./chartParts";
import {getIntl, expectSetsAreEqual} from "../../../../../test/test-utils";
import {renderedChartConfig} from "../../../../framework/viz/charts/chart-test-utils";
import {WorkItemsDurationsByPhaseChart} from "./workItemsDurationsByPhaseChart";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const workItemsFixture = [
  {
    id: "V29ya0l0ZW06NWViNjAxY2MtNmExZC00ODNkLWFkZDctNDE3YzMyMWU3MTA5",
    name: "Funnel closed does not match Flow Metrics Closed",
    key: "5eb601cc-6a1d-483d-add7-417c321e7109",
    displayId: "PO-396",
    workItemType: "bug",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-09T22:06:08.221000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "In Progress",
          stateType: "wip",
          daysInState: 4.343680555555555,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.0004166666666666667,
        },
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
        {
          state: "READY-FOR-DEVELOPMENT",
          stateType: "open",
          daysInState: 3.5509375,
        },
      ],
      earliestCommit: "2020-12-05T21:24:07",
      latestCommit: "2020-12-09T21:28:26",
      commitCount: 15,
      effort: 1.16666666666667,
      duration: 4.00299768518519,
    },
  },
  {
    id: "V29ya0l0ZW06ZjZlNjczNDgtYzE3NC00NGEzLWI0YTQtMDU4YjlhOTY3Zjli",
    name: "Capacity trends widget does not filter out robots. ",
    key: "f6e67348-c174-44a3-b4a4-058b9a967f9b",
    displayId: "PO-402",
    workItemType: "bug",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-06T18:44:16.755000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.06811342592592592,
        },
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: "2020-12-06T17:28:35",
      latestCommit: "2020-12-06T17:28:35",
      commitCount: 1,
      effort: 0.333333333333333,
      duration: 0,
    },
  },
  {
    id: "V29ya0l0ZW06YzRlYjRhOGYtZTFhNi00NjY3LTg5MzctZWI0ZjM2N2ZjMGE1",
    name: "Add a GraphQL mutation to register webhooks on a repository connector",
    key: "c4eb4a8f-e1a6-4667-8937-eb4f367fc0a5",
    displayId: "PO-390",
    workItemType: "task",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-03T19:31:17.641000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "In Progress",
          stateType: "wip",
          daysInState: 8.345,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.5721296296296297,
        },
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: "2020-11-25T12:32:04",
      latestCommit: "2020-12-06T16:09:16",
      commitCount: 12,
      effort: 5.33333333333333,
      duration: 11.1508333333333,
    },
  },
  {
    id: "V29ya0l0ZW06YTE4ZTVkZjYtNzBkMC00ZTVjLWIwMmQtYjViMDlhYWZjZjA1",
    name: "Backfill Tests: EpicNodeRef and ImplementationCost interfaces for WorkItemDeliveryCycle Nodes",
    key: "a18e5df6-70d0-4e5c-b02d-b5b09aafcf05",
    displayId: "PO-360",
    workItemType: "task",
    state: "ROADMAP",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-05T14:28:16.634000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.00042824074074074075,
        },
        {
          state: "READY-FOR-DEVELOPMENT",
          stateType: "open",
          daysInState: 31.989745370370372,
        },
        {
          state: "ROADMAP",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: null,
      latestCommit: null,
      commitCount: null,
      effort: null,
      duration: null,
    },
  },
  {
    id: "V29ya0l0ZW06MjNhNDJjZDQtOTAwNC00YjY2LTgxOGUtYzVlY2YzOGM2NWNj",
    name: "Show unmapped states in WorkItemStateMapping GraphQL queries",
    key: "23a42cd4-9004-4b66-818e-c5ecf38c65cc",
    displayId: "PO-400",
    workItemType: "task",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-05T05:03:34.833000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.40261574074074075,
        },
      ],
      earliestCommit: "2020-12-05T03:32:08",
      latestCommit: "2020-12-05T03:32:50",
      commitCount: 2,
      effort: 1,
      duration: 0.000486111111111111,
    },
  },
  {
    id: "V29ya0l0ZW06NWJiNDZhNWUtMGRmZC00MWRiLTlkZmMtYjBlNDUxYWVmZDQ2",
    name: "Refresh Open Pull Requests view when pull requests are updated. ",
    key: "5bb46a5e-0dfd-41db-9dfc-b0e451aefd46",
    displayId: "PO-399",
    workItemType: "story",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-05T03:42:01.684000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
        {
          state: "In Progress",
          stateType: "wip",
          daysInState: 1.2246180555555557,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.0002662037037037037,
        },
      ],
      earliestCommit: "2020-12-03T23:11:03",
      latestCommit: "2020-12-04T02:25:35",
      commitCount: 8,
      effort: 1,
      duration: 0.135092592592593,
    },
  },
  {
    id: "V29ya0l0ZW06NDE1YmRkY2UtNGM2NC00YWJmLWJjYjAtNzM0NjBjNWRhZmM5",
    name: "Code Review Time Trends Chart",
    key: "415bddce-4c64-4abf-bcb0-73460c5dafc9",
    displayId: "PO-395",
    workItemType: "story",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-03T04:16:24.988000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "created",
          stateType: "backlog",
          daysInState: 2.1940393518518517,
        },
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: "2020-12-02T21:25:19",
      latestCommit: "2020-12-02T22:29:08",
      commitCount: 7,
      effort: 0.333333333333333,
      duration: 0.0443171296296296,
    },
  },
  {
    id: "V29ya0l0ZW06MDMzYTcwMGUtNWVkNy00OTkyLTkxNDEtNWYxNzgzODNjYTIy",
    name: "Code Reviews Completed Trend Chart",
    key: "033a700e-5ed7-4992-9141-5f178383ca22",
    displayId: "PO-393",
    workItemType: "story",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-03T04:16:19.928000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "created",
          stateType: "backlog",
          daysInState: 3.149467592592593,
        },
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: "2020-12-02T18:12:43",
      latestCommit: "2020-12-02T18:29:02",
      commitCount: 2,
      effort: 0.333333333333333,
      duration: 0.0113310185185185,
    },
  },
  {
    id: "V29ya0l0ZW06ODViYTUyZmQtMDVkNS00Y2UxLTlkNmMtODIzODRjYjRmYTA5",
    name: "Column chart for Wip Effort",
    key: "85ba52fd-05d5-4ce1-9d6c-82384cb4fa09",
    displayId: "PO-388",
    workItemType: "story",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-12-02T08:20:57.774000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 4.290219907407407,
        },
        {
          state: "In Progress",
          stateType: "wip",
          daysInState: 4.385034722222223,
        },
      ],
      earliestCommit: "2020-11-27T23:05:28",
      latestCommit: "2020-12-02T18:25:31",
      commitCount: 16,
      effort: 2.33333333333333,
      duration: 4.80559027777778,
    },
  },
  {
    id: "V29ya0l0ZW06OGFlMjUzZDQtZDNjMC00MmEyLWJhZGMtMjJhOTZmMTk2MWUx",
    name: "Implement Pull Request Webhooks for Gitlab",
    key: "8ae253d4-d3c0-42a2-badc-22a96f1961e1",
    displayId: "PO-377",
    workItemType: "task",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-25T22:44:17.124000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "created",
          stateType: "backlog",
          daysInState: 2.262303240740741,
        },
        {
          state: "In Progress",
          stateType: "wip",
          daysInState: 5.005520833333334,
        },
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: "2020-11-19T15:49:50",
      latestCommit: "2020-11-25T20:41:07",
      commitCount: 4,
      effort: 2,
      duration: 6.20228009259259,
    },
  },
  {
    id: "V29ya0l0ZW06ZTcxNGI0YWYtNjRmNS00YjMwLWE4ODgtMTM0NWZhYzkwYTA5",
    name: "Setting up testing with jest and testing-library/react",
    key: "e714b4af-64f5-4b30-a888-1345fac90a09",
    displayId: "PO-382",
    workItemType: "task",
    state: "Done",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-26T20:42:08.169000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "In Progress",
          stateType: "wip",
          daysInState: 6.184398148148148,
        },
        {
          state: "Done",
          stateType: "closed",
          daysInState: null,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.0005787037037037037,
        },
      ],
      earliestCommit: "2020-11-20T16:32:23",
      latestCommit: "2020-11-26T17:15:51",
      commitCount: 20,
      effort: 4,
      duration: 6.03018518518518,
    },
  },
  {
    id: "V29ya0l0ZW06ZjQ3MzFkYmEtNmFlMC00MGExLTlkOTktYmU5MDk3Yjk1MzEw",
    name: "Add Troubleshooting steps for node-gyp error while doing yarn install in Polaris-analytics-web repo",
    key: "f4731dba-6ae0-40a1-9d99-be9097b95310",
    displayId: "PO-394",
    workItemType: "task",
    state: "Done",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-30T16:33:56.571000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.1478587962962963,
        },
        {
          state: "Done",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: "2020-11-30T16:30:17",
      latestCommit: "2020-11-30T16:30:17",
      commitCount: 1,
      effort: 0.5,
      duration: 0,
    },
  },
  {
    id: "V29ya0l0ZW06OWViN2QyY2ItMDVhMC00MDZjLWI2NmQtM2MyODk3NjZhYmYx",
    name: "Setup web tests in CI environment",
    key: "9eb7d2cb-05a0-406c-b66d-3c289766abf1",
    displayId: "PO-391",
    workItemType: "task",
    state: "Done",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-29T16:21:18.853000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "Done",
          stateType: "closed",
          daysInState: null,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 1.5071527777777778,
        },
      ],
      earliestCommit: "2020-11-29T02:40:04",
      latestCommit: "2020-11-29T16:20:55",
      commitCount: 10,
      effort: 2,
      duration: 0.570034722222222,
    },
  },
  {
    id: "V29ya0l0ZW06YjdjZDFlYTMtMmIyZi00ODFhLWEyMzItYTdjZjgzZWUyNGNk",
    name: "Setup Cypress for E2E Testing",
    key: "b7cd1ea3-2b2f-481a-a232-a7cf83ee24cd",
    displayId: "PO-387",
    workItemType: "task",
    state: "Done",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-26T21:18:24.026000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "created",
          stateType: "backlog",
          daysInState: 3.5138425925925927,
        },
        {
          state: "Done",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: "2020-11-26T20:30:51",
      latestCommit: "2020-11-26T20:53:51",
      commitCount: 4,
      effort: 0.5,
      duration: 0.0159722222222222,
    },
  },
  {
    id: "V29ya0l0ZW06NzU0YTcyZmEtNWUyNC00OTY2LWE4MDUtNGM5YTE2ZmNjZTk0",
    name: "Potential discrepancy in showing % At Target for Cycle Time",
    key: "754a72fa-5e24-4966-a805-4c9a16fcce94",
    displayId: "PO-349",
    workItemType: "bug",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-26T17:10:19.065000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.2365972222222222,
        },
        {
          state: "READY-FOR-DEVELOPMENT",
          stateType: "open",
          daysInState: 29.65310185185185,
        },
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
      ],
      earliestCommit: "2020-11-22T20:18:31",
      latestCommit: "2020-11-22T21:28:52",
      commitCount: 6,
      effort: 0.333333333333333,
      duration: 0.0488541666666667,
    },
  },
  {
    id: "V29ya0l0ZW06Njg1NzY2ZmYtMWU0Yi00NWQ2LWJjYTgtZDQ1NjA1NzkwZWIx",
    name: "Open Pull Requests Summary View on Wip board.",
    key: "685766ff-1e4b-45d6-bca8-d45605790eb1",
    displayId: "PO-385",
    workItemType: "story",
    state: "DEPLOYED-TO-STAGING",
    stateType: "closed",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-26T17:10:19.017000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "DEPLOYED-TO-STAGING",
          stateType: "closed",
          daysInState: null,
        },
        {
          state: "In Progress",
          stateType: "wip",
          daysInState: 4.774988425925926,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.0007175925925925926,
        },
      ],
      earliestCommit: "2020-11-21T23:06:24",
      latestCommit: "2020-11-22T03:56:50",
      commitCount: 8,
      effort: 0.666666666666667,
      duration: 0.201689814814815,
    },
  },
];

const projectCycleMetrics = {
  minLeadTime: 0.06811342592592592,
  avgLeadTime: 7.36273509837963,
  maxLeadTime: 31.990162037037038,
  minCycleTime: 1.2246180555555557,
  avgCycleTime: 11.050780606995884,
  maxCycleTime: 31.989745370370372,
  percentileLeadTime: 3.5138425925925927,
  percentileCycleTime: 6.184398148148148,
  targetPercentile: 0.5,
  workItemsInScope: 16,
  workItemsWithNullCycleTime: 7,
  earliestClosedDate: "2020-11-25T22:44:17.124000",
  latestClosedDate: "2020-12-09T22:06:08.221000",
};

const commonChartProps = {
  backgroundColor: Colors.Chart.backgroundColor,
  panning: true,
  panKey: "shift",
  zoomType: "xy",
};

const intl = getIntl();
const fixedChartConfig = {
  chart: {
    type: "bar",
    ...commonChartProps,
  },
  title: {
    text: expect.stringMatching(`Work Queue`),
  },
  xAxis: {
    type: "category",
    visible: true,
    title: {
      text: "Work Item",
    },
  },
  yAxis: {
    type: "linear",
    allowDecimals: false,
    title: {
      text: "Days",
    },
    plotLines: [
      PlotLines.avgCycleTime(projectCycleMetrics, intl, "left"),
      PlotLines.percentileLeadTime(projectCycleMetrics, intl, "left"),
    ],
  },
  tooltip: {
    useHTML: true,
    hideDelay: 50,
  },
  legend: {
    title: {
      text: "Current State",
      style: {
        fontStyle: "italic",
      },
    },
    align: "right",
    layout: "vertical",
    verticalAlign: "middle",
    itemMarginBottom: 3,
    enabled: true,
  },
};

// this sereis should be last in the series array.
const fixedSeriesConfig = {
  stacking: true,
  maxPointWidth: 30,
  minPointLength: 3,
  allowPointSelect: true,
};

// utility method to be used in test only
function getDataPoints(workItem) {
  const priorStateDurations = workItem.workItemStateDetails.currentDeliveryCycleDurations.reduce((acc, item) => {
    // we drop the record for the current state if it has no previous accumulated time.
    if (item.daysInState != null) {
      const stateType = item.stateType || "unmapped";
      if (acc[stateType] != null) {
        acc[stateType] = acc[stateType] + item.daysInState;
      } else {
        acc[stateType] = item.daysInState;
      }
    }
    return acc;
  }, {});
  const workItemPoints = Object.keys(priorStateDurations)
    .sort((stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB])
    .filter((stateType) => (workItem.stateType !== "closed" ? stateType !== "backlog" : true))
    .map((stateType) => ({
      name: workItem.displayId,
      y: priorStateDurations[stateType],
      color: WorkItemStateTypeColor[stateType],
      stateType: stateType,
      priorState: true,
      workItem: workItem,
    }));
  //finally push a point for the current work item state at the end
  workItemPoints.push({
    name: workItem.displayId,
    y: workItem.stateType !== "closed" ? workItem.timeInState : 0,
    priorState: false,
    workItem: workItem,
  });
  return workItemPoints;
}

describe("WorkItemsDurationsByPhaseChart", () => {
  describe("when there are no workItems", () => {
    const emptyWorkItems = [];

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [],
    };

    test("it renders an empty chart config", () => {
      expect(
        renderedChartConfig(
          <WorkItemsDurationsByPhaseChart
            workItems={emptyWorkItems}
            projectCycleMetrics={projectCycleMetrics}
            title={"Work Queue:"}
            groupBy={"state"}
          />
        )
      ).toMatchObject(expectedChartConfig);
    });
  });

  // these tests are still in progress.
  describe("when there are multiple workItems", () => {
    // assertions for different series.
    describe("workItems by state", () => {
      test("it renders chart config", () => {
        const expectedChartConfig = {
          ...fixedChartConfig,
          // renders 3 series when groupBy state
          series: [fixedSeriesConfig, fixedSeriesConfig, fixedSeriesConfig],
        };

        expect(
          renderedChartConfig(
            <WorkItemsDurationsByPhaseChart
              workItems={workItemsFixture}
              projectCycleMetrics={projectCycleMetrics}
              title={"Work Queue:"}
              groupBy={"state"}
            />
          )
        ).toMatchObject(expectedChartConfig);
      });

      const workItemsByState = workItemsFixture.reduce((acc, item) => {
        if (acc[item.state]) {
          acc[item.state].push(item);
        } else {
          acc[item.state] = [item];
        }
        return acc;
      }, {});

      const {series} = renderedChartConfig(
        <WorkItemsDurationsByPhaseChart
          workItems={workItemsFixture}
          projectCycleMetrics={projectCycleMetrics}
          title={"Work Queue:"}
          groupBy={"state"}
        />
      );

      test("it creates correct number of series", () => {
        expect(series).toHaveLength(Object.keys(workItemsByState).length);
      });

      Object.keys(workItemsByState)
        .sort((stateA, stateB) => workItemsByState[stateA].length - workItemsByState[stateB].length)
        .forEach((workItemState, index) => {
          describe(`series ${workItemState}`, () => {
            const points = workItemsByState[workItemState].flatMap((workItem) => getDataPoints(workItem));

            test(`it renders a chart with the correct number of data points`, () => {
              expect(series[index].data).toHaveLength(points.length);
            });

            test("it sets correct value for y axis for each point", () => {
              expectSetsAreEqual(
                series[index].data.map((point) => [point.y]),
                points.map((point) => [point.y])
              );
            });

            test("it sets correct name for each point ", () => {
              expectSetsAreEqual(
                series[index].data.map((point) => [point.name]),
                points.map((point) => [point.name])
              );
            });
          });
        });
    });

    describe("workItems by type", () => {
      test("it renders chart config", () => {
        const expectedChartConfig = {
          ...fixedChartConfig,
          legend: {
            ...fixedChartConfig.legend,
            title: {
              ...fixedChartConfig.legend.title,
              text: "Type",
            },
          },
          series: [fixedSeriesConfig, fixedSeriesConfig, fixedSeriesConfig],
        };

        expect(
          renderedChartConfig(
            <WorkItemsDurationsByPhaseChart
              workItems={workItemsFixture}
              projectCycleMetrics={projectCycleMetrics}
              title={"Work Queue:"}
              groupBy={"type"}
            />
          )
        ).toMatchObject(expectedChartConfig);
      });

      const workItemsByType = workItemsFixture.reduce((acc, item) => {
        if (acc[item.workItemType]) {
          acc[item.workItemType].push(item);
        } else {
          acc[item.workItemType] = [item];
        }
        return acc;
      }, {});

      const {series} = renderedChartConfig(
        <WorkItemsDurationsByPhaseChart
          workItems={workItemsFixture}
          projectCycleMetrics={projectCycleMetrics}
          title={"Work Queue:"}
          groupBy={"type"}
        />
      );

      test("it creates correct number of series", () => {
        expect(series).toHaveLength(Object.keys(workItemsByType).length);
      });

      Object.keys(workItemsByType)
        .sort((typeA, typeB) => WorkItemTypeSortOrder[typeA] - WorkItemTypeSortOrder[typeB])
        .forEach((workItemType, index) => {
          describe(`series ${workItemType}`, () => {
            const points = workItemsByType[workItemType].flatMap((workItem) => getDataPoints(workItem));

            test(`it renders a chart with the correct number of data points`, () => {
              expect(series[index].data).toHaveLength(points.length);
            });

            test("it sets correct value for y axis for each point", () => {
              expectSetsAreEqual(
                series[index].data.map((point) => [point.y]),
                points.map((point) => [point.y])
              );
            });

            test("it sets correct name for each point ", () => {
              expectSetsAreEqual(
                series[index].data.map((point) => [point.name]),
                points.map((point) => [point.name])
              );
            });
          });
        });
    });
  });
});
