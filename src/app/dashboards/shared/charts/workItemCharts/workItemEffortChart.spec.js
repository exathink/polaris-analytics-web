import React from "react";
import {Colors, WorkItemStateTypeColor} from "../../config";
import {renderedChartConfig} from "../../../../framework/viz/charts/chart-test-utils";
import {WorkItemsEffortChart} from "./workItemsEffortChart";
import {expectSetsAreEqual} from "../../../../../test/test-utils";

afterEach(() => {
  jest.clearAllMocks();
});

const workItems = [
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
          state: "ABANDONED",
          stateType: "complete",
          daysInState: null,
        },
        {
          state: "created",
          stateType: "backlog",
          daysInState: 1.5920833333333333,
        },
      ],
      earliestCommit: null,
      latestCommit: null,
      commitCount: null,
      effort: null,
      duration: null,
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

  describe("when there are work items in progress", () => {
    const wipWorkItem = workItems[1];
    // Replace effort value in the wip item with the specified values
    const testWorkItems = [3, 6, 9].map((effort) => ({
      ...wipWorkItem,
      ...{
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
        name: "Build",
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
      expect(series.data.map(point => point.y)).toMatchObject([9,6,3]);
    });


  });
});
