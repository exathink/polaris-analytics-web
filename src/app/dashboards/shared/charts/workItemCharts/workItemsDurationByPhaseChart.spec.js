import React from "react";
import {Colors, WorkItemStateTypeDisplayName, WorkItemTypeDisplayName} from "../../../shared/config";
import {getIntl, expectSetsAreEqual, formatNumber, getNDaysAgo} from "../../../../../test/test-utils";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../framework/viz/charts/chart-test-utils";
import {WorkItemsDurationsByPhaseChart} from "./workItemsDurationsByPhaseChart";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const targetMetrics = {
  leadTimeConfidenceTarget: 0.9,
  cycleTimeConfidenceTarget: 0.9,
  leadTimeTarget: 30,
  cycleTimeTarget: 7,
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
      text: "Card",
    },
  },
  yAxis: {
    type: "linear",
    allowDecimals: false,
    title: {
      text: "Age in Days",
    },
    plotLines: [
      {
        color: 'blue',
        value: 30,
        dashStyle: 'longdashdot',
        width: 1,
        zIndex: 7,
        label: {
          text: `90th pct. LT Target=30 days`,
          align: 'left',
          verticalAlign: 'top',
        }
      },
      {
        color: 'orange',
        value: 7,
        dashStyle: 'longdashdot',
        width: 1,
        zIndex: 7,
        label: {
          text: `90th pct. CT Target=7 days`,
          align: 'left',
          verticalAlign: 'top',
        }
      }
    ],
  },
  tooltip: {
    useHTML: true,
    hideDelay: 50,
  },
  legend: {
    title: {
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

describe("WorkItemsDurationsByPhaseChart", () => {
  describe("when stateType is closed, groupedBy state", () => {
    const chartConfigGroupedByState = {
      ...fixedChartConfig,
      legend: {...fixedChartConfig.legend, title: {...fixedChartConfig.legend.title, text: "Current State"}},
    };
    describe("when there are no workItems", () => {
      const emptyWorkItems = [];

      const expectedChartConfig = {
        ...chartConfigGroupedByState,
        series: [],
      };

      test("it renders an empty chart config", () => {
        expect(
          renderedChartConfig(
            <WorkItemsDurationsByPhaseChart
              workItems={emptyWorkItems}
              targetMetrics={targetMetrics}
              title={"Work Queue:"}
              groupBy={"state"}
            />
          )
        ).toMatchObject(expectedChartConfig);
      });
    });

    describe("when there is a single workItem", () => {
      let workItemFixture = {
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
          effort: 1.17,
          duration: 4.00299768518519,
          leadTime: 18.00,
          cycleTime: 17.00
        },
      };
      let workItemsFixture = [workItemFixture];

      test("should render correct chart config", () => {
        const seriesConfig = {
          ...fixedSeriesConfig,
          name: `Deployed-to-staging (1)`,
        };
        const expectedChartConfig = {
          ...chartConfigGroupedByState,
          series: [seriesConfig],
        };

        expect(
          renderedChartConfig(
            <WorkItemsDurationsByPhaseChart
              workItems={workItemsFixture}
              targetMetrics={targetMetrics}
              title={"Work Queue:"}
              groupBy={"state"}
            />
          )
        ).toMatchObject(expectedChartConfig);
      });

      const {series} = renderedChartConfig(
        <WorkItemsDurationsByPhaseChart
          workItems={workItemsFixture}
          targetMetrics={targetMetrics}
          title={"Work Queue:"}
          groupBy={"state"}
        />
      );

      test("should create single series", () => {
        expect(series).toHaveLength(1);
      });

      test(`renders a chart with the correct number of data points`, () => {
        expect(series[0].data).toHaveLength(4);
      });

      test("it sets correct value for y axis for each point", () => {
        expectSetsAreEqual(
          series[0].data.map((point) => point.y),
          // as current state is closed, its timeInState is 0, rest points come from currentDeliveryCycleDurations
          workItemFixture.workItemStateDetails.currentDeliveryCycleDurations.map((x) => x.daysInState || 0)
        );
      });

      test("it sets correct name for each point", () => {
        expectSetsAreEqual(
          series[0].data.map((point) => point.name),
          [workItemFixture.displayId]
        );
      });

      test(`should render the tooltip of the first point, non current state point`, async () => {
        const [actual] = await renderedTooltipConfig(
          <WorkItemsDurationsByPhaseChart
            workItems={workItemsFixture}
            targetMetrics={targetMetrics}
            title={"Work Queue:"}
            groupBy={"state"}
          />,
          (points) => [points[0]],
          0
        );

        const {displayId, workItemType} = workItemFixture;

        expect(actual).toMatchObject({
          header: expect.stringMatching(`${WorkItemTypeDisplayName[workItemType]}: ${displayId}`),
          body: [
            [`Phase:`, `${WorkItemStateTypeDisplayName["backlog"]}`],
            [`Time in Phase:`, expect.stringMatching(`days`)],
          ],
        });
      });

      test(`should render the tooltip of the current state point(last one)`, async () => {
        const wiFixture = {
          ...workItemFixture,
          workItemStateDetails: {
            ...workItemFixture.workItemStateDetails,
            currentDeliveryCycleDurations: [
              {
                state: "In Progress",
                stateType: "wip",
                daysInState: 4,
              },
              {
                state: "created",
                stateType: "backlog",
                daysInState: 1,
              },
              {
                state: "DEPLOYED-TO-STAGING",
                stateType: "closed",
                daysInState: null,
              },
              {
                state: "READY-FOR-DEVELOPMENT",
                stateType: "open",
                daysInState: 3,
              },
            ],
            latestCommit: getNDaysAgo(20),
            currentStateTransition: {
              ...workItemFixture.workItemStateDetails.currentStateTransition,
              eventDate: getNDaysAgo(10),
            },
          },
        };
        const workItemsFixture = [wiFixture];

        const [actual] = await renderedTooltipConfig(
          <WorkItemsDurationsByPhaseChart
            workItems={workItemsFixture}
            targetMetrics={targetMetrics}
            title={"Work Queue:"}
            groupBy={"state"}
          />,
          (points) => [points[points.length - 1]],
          0
        );

        const {
          displayId,
          workItemType,
          state,
          workItemStateDetails: {duration, effort},
        } = workItemFixture;

        // expected values
        const leadTime = 18; // 10(currentStateTransition.eventDate) + (priorStateDurations-backlog)(4+1+3-1)
        const cycleTime = 17; // 10(currentStateTransition.eventDate) + (priorStateDurations-backlog)(4+1+3-1)
        // closed items have zero latency (PO-795)
        const latency = 0;
        const timeInStateDisplay = "10 days ago";
        const commitCount = 15;
        const latestCommitDisplay = "20 days ago";
        expect(actual).toMatchObject({
          header: expect.stringMatching(`${WorkItemTypeDisplayName[workItemType]}: ${displayId}`),
          body: [
            [`Lead Time:`, expect.stringContaining("days")],
            [`Cycle Time:`, expect.stringContaining("days")],
            [`Current State:`, `${state}`],
            [`Entered:`, `${timeInStateDisplay}`],
            ["", ""],
            [`-----------------`, ``],
            [`Commits: `, `${formatNumber(commitCount)}`],
            [`Latest Commit: `, `${latestCommitDisplay}`],
            [`Coding: `, `${formatNumber(duration)} days`],
            [`Effort: `, `${formatNumber(effort)} FTE Days`],
            ["",""]
          ],
        });

        expect(Number(actual.body[0][1].split(" ")[0])).toBeCloseTo(leadTime, 0);
        expect(Number(actual.body[1][1].split(" ")[0])).toBeCloseTo(cycleTime, 0);

      });
    });

    describe("when there are multiple workItems", () => {
      const workItemFixtureForDeployedToStaging1 = {
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
      };
      const workItemFixtureForDoneState = {
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
      };
      const workItemFixtureForDeployedToStaging2 = {
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
      };

      const workItemsFixture = [
        workItemFixtureForDeployedToStaging1,
        workItemFixtureForDoneState,
        workItemFixtureForDeployedToStaging2,
      ];

      test("should render correct chart config", () => {
        const expectedChartConfig = {
          ...fixedChartConfig,
          // series are in ascending order of counts
          series: [
            {
              ...fixedSeriesConfig,
              name: `Done (1)`,
            },
            {
              ...fixedSeriesConfig,
              name: `Deployed-to-staging (2)`,
            },
          ],
        };

        expect(
          renderedChartConfig(
            <WorkItemsDurationsByPhaseChart
              workItems={workItemsFixture}
              targetMetrics={targetMetrics}
              title={"Work Queue:"}
              groupBy={"state"}
            />
          )
        ).toMatchObject(expectedChartConfig);
      });

      const {series} = renderedChartConfig(
        <WorkItemsDurationsByPhaseChart
          workItems={workItemsFixture}
          targetMetrics={targetMetrics}
          title={"Work Queue:"}
          groupBy={"state"}
        />
      );

      test("should create correct number of series.", () => {
        expect(series).toHaveLength(2);
      });

      describe(`series Done`, () => {
        const doneSeries = series[0];
        test(`renders a chart with the correct number of data points`, () => {
          expect(doneSeries.data).toHaveLength(
            workItemFixtureForDoneState.workItemStateDetails.currentDeliveryCycleDurations.length
          );
        });

        test("it sets correct value for y axis for each point", () => {
          expectSetsAreEqual(
            doneSeries.data.map((point) => point.y),
            // as current state is closed, its timeInState is 0, rest points come from currentDeliveryCycleDurations
            workItemFixtureForDoneState.workItemStateDetails.currentDeliveryCycleDurations.map(
              (x) => x.daysInState || 0
            )
          );
        });

        test("it sets correct name for each point", () => {
          expectSetsAreEqual(
            doneSeries.data.map((point) => point.name),
            [workItemFixtureForDoneState.displayId]
          );
        });
      });
      describe(`series Deployed To Staging`, () => {
        const deployedToStagingSeries = series[1];
        test(`renders a chart with the correct number of data points`, () => {
          expect(deployedToStagingSeries.data).toHaveLength(
            workItemFixtureForDeployedToStaging1.workItemStateDetails.currentDeliveryCycleDurations.length +
              workItemFixtureForDeployedToStaging2.workItemStateDetails.currentDeliveryCycleDurations.length
          );
        });

        test("it sets correct value for y axis for each point", () => {
          expectSetsAreEqual(
            deployedToStagingSeries.data.map((point) => point.y),
            // as current state is closed, its timeInState is 0, rest points come from currentDeliveryCycleDurations
            [
              ...workItemFixtureForDeployedToStaging1.workItemStateDetails.currentDeliveryCycleDurations.map(
                (x) => x.daysInState || 0
              ),
              ...workItemFixtureForDeployedToStaging2.workItemStateDetails.currentDeliveryCycleDurations.map(
                (x) => x.daysInState || 0
              ),
            ]
          );
        });

        test("it sets correct name for each point", () => {
          expectSetsAreEqual(
            deployedToStagingSeries.data.map((point) => point.name),
            [workItemFixtureForDeployedToStaging1.displayId, workItemFixtureForDeployedToStaging2.displayId]
          );
        });
      });
    });
  });

  describe("when stateType is not closed, groupedBy type", () => {
    const chartConfigGroupedByType = {
      ...fixedChartConfig,
      legend: {...fixedChartConfig.legend, title: {...fixedChartConfig.legend.title, text: "Type"}},
    };
    describe("when there are no workItems", () => {
      const emptyWorkItems = [];

      const expectedChartConfig = {
        ...chartConfigGroupedByType,
        series: [],
      };

      test("it renders an empty chart config", () => {
        expect(
          renderedChartConfig(
            <WorkItemsDurationsByPhaseChart
              workItems={emptyWorkItems}
              targetMetrics={targetMetrics}
              title={"Work Queue:"}
              groupBy={"type"}
            />
          )
        ).toMatchObject(expectedChartConfig);
      });
    });

    describe("when there are multiple workItems", () => {
      let workItemFixtureForStory = {
        id: "V29ya0l0ZW06MDc4YjE5YjgtMzBjOC00NjI0LTgyNDctNmE0YjAwN2RlOTk1",
        name: "Show work queues in value stream mapping detail view. ",
        key: "078b19b8-30c8-4624-8247-6a4b007de995",
        displayId: "PO-403",
        workItemType: "story",
        state: "In Progress",
        stateType: "wip",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(32),
          },
          currentDeliveryCycleDurations: [
            {
              state: "created",
              stateType: "backlog",
              daysInState: 0.0012847222222222223,
            },
            {
              state: "In Progress",
              stateType: "wip",
              daysInState: null,
            },
          ],
          earliestCommit: "2020-12-08T22:24:02",
          latestCommit: "2020-12-08T22:24:02",
          commitCount: 1,
          effort: 0.333333333333333,
          duration: 0,
        },
      };

      let workItemFixtureForTask1 = {
        id: "V29ya0l0ZW06NTViYWJhYWQtMzZmNi00YmFmLTljMmYtMTBjNWEyNDU5MWI4",
        name: "Implement Pull Request webhooks for Github",
        key: "55babaad-36f6-4baf-9c2f-10c5a24591b8",
        displayId: "PO-379",
        workItemType: "task",
        state: "In Progress",
        stateType: "wip",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(15),
          },
          currentDeliveryCycleDurations: [
            {
              state: "In Progress",
              stateType: "wip",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              daysInState: 0.0005092592592592592,
            },
            {
              state: "Selected for Development",
              stateType: "backlog",
              daysInState: 21.253032407407407,
            },
          ],
          earliestCommit: "2020-12-07T16:56:22",
          latestCommit: "2020-12-09T22:30:42",
          commitCount: 7,
          effort: 3.66666666666667,
          duration: 2.23217592592593,
        },
      };

      let workItemFixtureForTask2 = {
        id: "V29ya0l0ZW06MTNmOTgzNjEtOWRkNi00NWVhLWE4MzItOGRlYzBkOWFjZTU1",
        name: "State Type mapping widget implementation for workItems ",
        key: "13f98361-9dd6-45ea-a832-8dec0d9ace55",
        displayId: "PO-397",
        workItemType: "task",
        state: "Code-Review-Needed",
        stateType: "wip",
        workItemStateDetails: {
          currentStateTransition: {
            eventDate: getNDaysAgo(22),
          },
          currentDeliveryCycleDurations: [
            {
              state: "Code-Review-Needed",
              stateType: "wip",
              daysInState: null,
            },
            {
              state: "created",
              stateType: "backlog",
              daysInState: 0.019699074074074074,
            },
            {
              state: "In Progress",
              stateType: "wip",
              daysInState: 6.065995370370371,
            },
          ],
          earliestCommit: "2020-12-03T13:38:41",
          latestCommit: "2020-12-09T18:22:49",
          commitCount: 31,
          effort: 4.66666666666667,
          duration: 6.19731481481482,
        },
      };

      const workItemsFixture = [workItemFixtureForStory, workItemFixtureForTask1, workItemFixtureForTask2];

      test("should render correct chart config", () => {
        const expectedChartConfig = {
          ...chartConfigGroupedByType,
          series: [
            {
              ...fixedSeriesConfig,
              name: `${WorkItemTypeDisplayName["story"]} (1)`,
            },
            {
              ...fixedSeriesConfig,
              name: `${WorkItemTypeDisplayName["task"]} (2)`,
            },
          ],
        };

        expect(
          renderedChartConfig(
            <WorkItemsDurationsByPhaseChart
              workItems={workItemsFixture}
              targetMetrics={targetMetrics}
              title={"Work Queue:"}
              groupBy={"type"}
            />
          )
        ).toMatchObject(expectedChartConfig);
      });

      const {series} = renderedChartConfig(
        <WorkItemsDurationsByPhaseChart
          workItems={workItemsFixture}
          targetMetrics={targetMetrics}
          title={"Work Queue:"}
          groupBy={"type"}
        />
      );

      test("should create correct number of series.", () => {
        expect(series).toHaveLength(2);
      });

      describe(`series Story`, () => {
        const storySeries = series[0];

        test(`renders a chart with the correct number of data points`, () => {
          expect(storySeries.data).toHaveLength(1);
        });

        test("it sets correct value for y axis for each point", () => {
          // for non-closed workItems, filter backlog and transition having daysInState to be null in(currentDeliveryCycleDurations).
          // for this particular case we will only have single point(which is current workItemState)
          
          //a precision of 0 allows x to be anything from y - 0.5 to y + 0.5
          expect(storySeries.data[0].y).toBeCloseTo(32, 0);
        });

        test("it sets correct name for each point", () => {
          expectSetsAreEqual(
            storySeries.data.map((point) => point.name),
            [workItemFixtureForStory.displayId]
          );
        });
      });

      describe(`series Task`, () => {
        const taskSeries = series[1];
        test(`renders a chart with the correct number of data points`, () => {
          expect(taskSeries.data).toHaveLength(3);
        });

        test("it sets correct value for y axis for each point", () => {
          [15, 6.065995370370371, 22].forEach((x, i) => expect(x).toBeCloseTo((taskSeries.data[i].y), 0));
        });

        test("it sets correct name for each point", () => {
          expectSetsAreEqual(
            taskSeries.data.map((point) => point.name),
            [workItemFixtureForTask1.displayId, workItemFixtureForTask2.displayId]
          );
        });
      });
    });
  });
});
