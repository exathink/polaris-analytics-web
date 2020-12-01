import React from "react";
import {Colors, WorkItemStateTypeColor, WorkItemStateTypeDisplayName} from "../../config";
import {
  renderedChartConfig,
  renderedDataLabels,
  renderedTooltipConfig,
} from "../../../../framework/viz/charts/chart-test-utils";
import {WorkItemsEffortChart} from "./workItemsEffortChart";
import {expectSetsAreEqual} from "../../../../../test/test-utils";

afterEach(() => {
  jest.clearAllMocks();
});

const prototypeWorkItems = [
  {
    id: "V29ya0l0ZW06ZTg0ZTBlODgtZTEyZC00MzUwLThjZWItMDc5NGU2ZWExYWM3",
    name: "Flow Board: Wip total/Epic total are not consistent",
    key: "e84e0e88-e12d-4350-8ceb-0794e6ea1ac7",
    displayId: "PO-392",
    workItemType: "bug",
    state: "READY-FOR-DEVELOPMENT",
    stateType: "open",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-29T23:01:06.994000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "READY-FOR-DEVELOPMENT",
          stateType: "open",
          daysInState: null,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 0.016805555555555556,
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
    id: "V29ya0l0ZW06ODViYTUyZmQtMDVkNS00Y2UxLTlkNmMtODIzODRjYjRmYTA5",
    name: "Column chart for Wip Effort",
    key: "85ba52fd-05d5-4ce1-9d6c-82384cb4fa09",
    displayId: "PO-388",
    workItemType: "story",
    state: "In Progress",
    stateType: "wip",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-11-27T23:06:30.752000",
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
          daysInState: 4.290208333333333,
        },
      ],
      earliestCommit: "2020-11-27T23:05:28",
      latestCommit: "2020-11-27T23:06:29",
      commitCount: 3,
      effort: 1,
      duration: 0.000706018518518518,
    },
  },
  {
    id: "V29ya0l0ZW06OWViNDJiYzUtNTI2MC00N2ExLThjOTctOWE5NmFjYjYwNDQy",
    name: "Wip count for current pipeline does not include subtasks",
    key: "9eb42bc5-5260-47a1-8c97-9a96acb60442",
    displayId: "PO-248",
    workItemType: "bug",
    state: "ACCEPTED",
    stateType: "complete",
    workItemStateDetails: {
      currentStateTransition: {
        eventDate: "2020-08-19T16:06:32.793000",
      },
      currentDeliveryCycleDurations: [
        {
          state: "ACCEPTED",
          stateType: "complete",
          daysInState: null,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 1.5920833333333333,
        },
      ],
      earliestCommit: "2020-11-27T23:05:28",
      latestCommit: "2020-11-27T23:06:29",
      commitCount: 3,
      effort: 1,
      duration: 0.000706018518518518,
    },
  },
];

const commonChartProps = {
  backgroundColor: Colors.Chart.backgroundColor,
  zoomType: "xy",
  panning: true,
  panKey: "shift",
};

const fixedChartConfig = {
  chart: {
    ...commonChartProps,
  },

  xAxis: {
    type: "category",
    title: {
      text: null,
    },
  },
  yAxis: {
    type: "linear",

    title: {
      text: "Effort in Dev-Days",
    },
  },
};

describe("workItemEffortChart", () => {
  describe("when there are no work items", () => {
    const testWorkItems = [];
    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [],
    };

    const chartConfig = renderedChartConfig(<WorkItemsEffortChart workItems={testWorkItems} />);

    test("it renders an empty chart config in primary view", () => {
      expect(chartConfig).toMatchObject(expectedChartConfig);
    });

    test("it shows the number of work items in the title", () => {
      expect(chartConfig.title).toMatchObject({
        text: expect.stringMatching(/.*0.*/),
        align: "left",
      });
    });

    test("it displays a subtitle", () => {
      expect(chartConfig.subtitle).toMatchObject({
        text: expect.any(String),
        align: "left",
      });
    });
  });

  describe("when there are specs in progress", () => {
    const wipWorkItem = prototypeWorkItems[1];
    // Replace effort value in the wip item with the specified values
    const testWorkItems = [3, 6, 9].map((effort, index) => ({
      ...wipWorkItem,
      ...{
        displayId: `PO-30${index}`,
        workItemStateDetails: {
          ...wipWorkItem.workItemStateDetails,
          effort: effort,
        },
      },
    }));

    const chartConfig = renderedChartConfig(<WorkItemsEffortChart workItems={testWorkItems} />);

    test("it returns a chart with a single stacked column series with wip color", () => {
      const expectedSeries = {
        type: "column",
        name: WorkItemStateTypeDisplayName["wip"],
        stacking: "normal",
        color: WorkItemStateTypeColor["wip"],
      };
      expect(chartConfig.series).toMatchObject([expectedSeries]);
    });

    const series = chartConfig.series[0];

    test("it returns the correct number data points in the series", () => {
      expect(series.data.length).toBe(3);
    });

    test("it maps work item effort to the y axis", () => {
      expectSetsAreEqual(
        series.data.map((point) => ({y: point.y})),
        [3, 6, 9].map((effort) => ({
          y: effort,
        }))
      );
    });

    test("it sorts the points in descending order of effort", () => {
      expect(series.data.map((point) => point.y)).toMatchObject([9, 6, 3]);
    });

    test("it renders point data labels with displayId and effort for points with more than 30% of effort and only displayId otherwise", async () => {
      const dataLabels = await renderedDataLabels(<WorkItemsEffortChart workItems={testWorkItems} />);

      expectSetsAreEqual(dataLabels, ["PO-302<br/>9 days", "PO-301<br/>6 days", "PO-300"]);
    });

    test(" renders tooltips correctly", async () => {
      const [{header, body}] = await renderedTooltipConfig(<WorkItemsEffortChart workItems={testWorkItems} />);
      expect(header).toBe("Story: PO-302<br/>Column chart for Wip Effort");
      expect(body).toMatchObject([
        ["Effort", "9 Dev-Days"],
        ["-----------------", ""],
        ["Duration", "0.001 days"],
        ["Latest Commit", expect.stringMatching(/.* days ago/)],
        ["-----------------", ""],
        ["Current State:", "In Progress"],
        ["Entered:", expect.stringMatching(/.* days ago/)],
        ["Cycle Time:", expect.stringMatching(/.* days/)],
      ]);
    });
  });

  describe("when there are competed specs", () => {
    const completedWorkItem = prototypeWorkItems[2];
    // Replace effort value in the wip item with the specified values
    const testWorkItems = [3, 6, 9].map((effort, index) => ({
      ...completedWorkItem,
      ...{
        displayId: `PO-30${index}`,
        workItemStateDetails: {
          ...completedWorkItem.workItemStateDetails,
          effort: effort,
        },
      },
    }));

    const chartConfig = renderedChartConfig(<WorkItemsEffortChart workItems={testWorkItems} />);

    test("it returns a chart with a single stacked column series with completed color", () => {
      const expectedSeries = {
        type: "column",
        name: WorkItemStateTypeDisplayName["complete"],
        stacking: "normal",
        color: WorkItemStateTypeColor["complete"],
      };
      expect(chartConfig.series).toMatchObject([expectedSeries]);
    });
  });

  describe("when there are work items with no commits", () => {
    const noCommitsWorkItem = prototypeWorkItems[0];
    // Include one work item with each possible state type
    const testWorkItems = ["wip", "open", "complete"].map((stateType, index) => ({
      ...noCommitsWorkItem,
      ...{
        stateType: stateType,
        displayId: `PO-30${index}`,
      },
    }));

    const chartConfig = renderedChartConfig(<WorkItemsEffortChart workItems={testWorkItems} view={"primary"} />);

    test("it returns a chart with a single stacked column series ", () => {
      const expectedSeries = {
        type: "column",
        name: "No Commits",
        stacking: "normal",
      };
      expect(chartConfig.series).toMatchObject([expectedSeries]);
    });

    const [{data}] = chartConfig.series;

    test("it returns points sorted in state type order", () => {
      expect(data.map((point) => point.workItem.stateType)).toMatchObject(["open", "wip", "complete"]);
    });

    test("it returns points where the color is determined by its state type", () => {
      expect(data.map((point) => point.color)).toMatchObject([
        WorkItemStateTypeColor["open"],
        WorkItemStateTypeColor["wip"],
        WorkItemStateTypeColor["complete"],
      ]);
    });

    test("it disables data labels in primary view", () => {
      const [{dataLabels}] = chartConfig.series;
      expect(dataLabels.enabled).toBe(false);
    });

    describe(" when in detail View ", () => {
      const chartConfig = renderedChartConfig(<WorkItemsEffortChart workItems={testWorkItems} view={"detail"} />);
      test("it enables data labels", () => {
        const [{dataLabels}] = chartConfig.series;
        expect(dataLabels.enabled).toBe(true);
      });

      test("it show displayIds as data labels", async () => {
        const dataLabels = await renderedDataLabels(<WorkItemsEffortChart workItems={testWorkItems} />);
        expect(dataLabels).toMatchObject(["PO-301", "PO-300", "PO-302"]);
      });

      test(" it renders tooltips correctly", async () => {
        const [{header, body}] = await renderedTooltipConfig(<WorkItemsEffortChart workItems={testWorkItems} />);
        expect(header).toBe("Bug: PO-301<br/>Flow Board: Wip total/Epic total are not consistent");
        expect(body).toMatchObject([
          ["Effort", "Unknown"],
          ["Phase:", "Open"],
          ["-----------------", ""],
          ["Current State:", "READY-FOR-DEVELOPMENT"],
          ["Entered:", expect.stringMatching(/.* days ago/)],
          ["Cycle Time:", expect.stringMatching(/.* days/)],
          ["-----------------", ""],
          ["Latest Commit", "None"],
        ]);
      });
    });

    describe("when specsOnly is true", () => {
      const chartConfig = renderedChartConfig(<WorkItemsEffortChart workItems={testWorkItems} specsOnly={true} />);

      test("it returns and empty series", () => {
        expect(chartConfig.series).toMatchObject([]);
      });
    });
  });

  describe("when there are work items of all types", () => {
    const testWorkItems = [
      {
        ...prototypeWorkItems[0],
        stateType: "wip",
      },
      {
        ...prototypeWorkItems[0],
        stateType: "open",
      },
      {
        ...prototypeWorkItems[0],
        stateType: "complete",
      },
      // Spec in wip phase
      prototypeWorkItems[1],
      // Spec in complete phase
      prototypeWorkItems[2],
    ];

    const chartConfig = renderedChartConfig(<WorkItemsEffortChart workItems={testWorkItems} />);
    const [wipSeries, completedSeries, noCommitSeries, ...rest] = chartConfig.series;

    test("it returns one series per state type for specs and a single series for all work items without commits", () => {
      expect(wipSeries).toBeDefined();
      expect(completedSeries).toBeDefined();
      expect(noCommitSeries).toBeDefined();
      expect(rest).toMatchObject([]);
    });

    test("series have the correct number of data points", () => {
      expect(wipSeries.data.length).toBe(1);
      expect(completedSeries.data.length).toBe(1);
      expect(noCommitSeries.data.length).toBe(3);
    });

    describe("when specsOnly is true", () => {
      const chartConfig = renderedChartConfig(<WorkItemsEffortChart workItems={testWorkItems} specsOnly={true} />);
      const [wipSeries, completedSeries, noCommitSeries] = chartConfig.series;

      test("it does not include the no commit series", () => {
        expect(wipSeries).toBeDefined();
        expect(completedSeries).toBeDefined();
        expect(noCommitSeries).toBeUndefined();
      });
    });
  });
});

