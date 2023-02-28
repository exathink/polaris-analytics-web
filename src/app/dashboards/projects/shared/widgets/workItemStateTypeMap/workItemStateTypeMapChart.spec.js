import React from "react";
import {renderedChartConfig} from "../../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual} from "../../../../../../test/test-utils";
import {Colors, WorkItemStateTypeColor, WorkItemStateTypeDisplayName} from "../../../../shared/config";
import {WorkItemStateTypeMapChart} from "./workItemStateTypeMapChart";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const workItemSourcesFixture = [
  {
    key: "a92d9cc9-25ba-4337-899f-cba7797a6c12",
    name: "Polaris Platform",
    // Note: This fixture omits the mapping for the "created" state, which is
    // removed by the component before display. This state is normally present in
    // the mapping returned from the server, but it makes for a more intuitive test case to test for the removal
    // separately, so we will setup the default fixture without this state mapped.
    workItemStateMappings: [
      {
        state: "accepted",
        stateType: "closed",
      },
      {
        state: "planned",
        stateType: "complete",
      },
      {
        state: "unscheduled",
        stateType: "backlog",
      },
      {
        state: "unstarted",
        stateType: "open",
      },
      {
        state: "started",
        stateType: "open",
      },
      {
        state: "delivered",
        stateType: "wip",
      },
      {
        state: "finished",
        stateType: "complete",
      },
    ],
  },
  {
    key: "46694f4f-e003-4430-a7a7-e4f288f40d22",
    name: "Polaris",
    workItemStateMappings: [
      {
        state: "ACCEPTED",
        stateType: "closed",
      },
      {
        state: "Closed",
        stateType: "open",
      },
      {
        state: "Code-Review-Needed",
        stateType: "wip",
      },
      {
        state: "Done",
        stateType: "closed",
      },
      {
        state: "ABANDONED",
        stateType: "backlog",
      },
      {
        state: "Backlog",
        stateType: "backlog",
      },
      {
        state: "ROADMAP",
        stateType: "backlog",
      },
      {
        state: "DEV-DONE",
        stateType: "complete",
      },
      {
        state: "created",
        stateType: "open",
      },
      {
        state: "DEPLOYED-TO-STAGING",
        stateType: "open",
      },
      {
        state: "Selected for Development",
        stateType: "open",
      },
      {
        state: "RELEASED",
        stateType: "complete",
      },
      {
        state: "DESIGN",
        stateType: "open",
      },
      {
        state: "In Progress",
        stateType: "wip",
      },
      {
        state: "READY-FOR-DEVELOPMENT",
        stateType: "backlog",
      },
    ],
  },
];

const commonChartProps = {
  animation: false,
  backgroundColor: Colors.Chart.backgroundColor,
};

const fixedChartConfig = {
  chart: {
    ...commonChartProps,
  },
  title: {
    text: `Delivery Process Mapping`,
  },
  subtitle: {
    text: `Drag a workflow state to its desired phase.`,
  },
  plotOptions: {
    series: {
      cursor: "move",
      stickyTracking: true,
      dragDrop: {
        draggableX: true,
        draggableY: true,
        dragMinY: 0,
        dragMaxY: 20,
        dragMinX: 0,
        dragMaxX: 5,
        liveRedraw: false,
      },
      dataLabels: {
        enabled: true,
        format: "{point.name}",
      },
    },
    column: {
      stacking: "normal",
      minPointLength: 2,
    },
  },
  xAxis: {
    categories: Object.values(WorkItemStateTypeDisplayName),
    title: {
      text: "Phase",
    },
  },
  yAxis: {
    visible: false,
    softMin: 0,
    softMax: 20,
  },
  tooltip: {
    useHTML: true,
    followPointer: false,
    hideDelay: 0
  },
  time: {
    useUTC: false,
  },
};

// this sereis should be last in the series array.
const fixedSeriesConfig = {
  name: "State Types",
  type: "column",
  showInLegend: false,
  data: Object.entries(WorkItemStateTypeDisplayName).map(([key, displayValue], index) => {
    return {
      name: displayValue,
      y: 1.2,
      x: index,
      pointWidth: 100,
      color: WorkItemStateTypeColor[key],
      dragDrop: {
        draggableX: false,
        draggableY: false,
      },
      dataLabels: {
        enabled: false,
      },
    };
  }),
};

describe("WorkItemStateTypeMapChart", () => {
  describe("when there are no states to be mapped", () => {
    const workItemSourcesWithEmptyWorkItemMappings = [
      {
        key: "testKey",
        name: "testName",
        workItemStateMappings: [],
      },
    ];

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [fixedSeriesConfig],
    };

    test("it renders an empty chart config", () => {
      expect(
        renderedChartConfig(
          <WorkItemStateTypeMapChart
            workItemSource={workItemSourcesWithEmptyWorkItemMappings[0]}
            view="detail"
            enableEdits={true}
          />
        )
      ).toMatchObject(expectedChartConfig);
    });
  });

  describe("work items state type map chart", () => {
    const workItemSourcesWithMultipleWorkItemMappings = workItemSourcesFixture;
    const [{key: workItemSourceKey}] = workItemSourcesFixture;

    const {series} = renderedChartConfig(
      <WorkItemStateTypeMapChart
        workItemSource={workItemSourcesWithMultipleWorkItemMappings[0]}
        view="detail"
        enableEdits={true}
      />
    );

    describe("work item state series", () => {
      const seriesData = series.filter((s, i) => i !== series.length - 1);
      const {workItemStateMappings} = workItemSourcesWithMultipleWorkItemMappings.find(
        (x) => x.key === workItemSourceKey
      );

      test("it renders a chart with the correct number of data points", () => {
        expect(series).toHaveLength(workItemStateMappings.length + 1);
      });

      test("it maps state type categories to the x axis and sets y to a fix value", () => {
        expectSetsAreEqual(
          // each state bar is modelled as series with single point.
          seriesData.flatMap((s) => s.data).map((point) => [point.x, point.y]),
          workItemStateMappings.map((item) => {
            return [Object.keys(WorkItemStateTypeDisplayName).indexOf(item.stateType), 2];
          })
        );
      });

      test("it sets correct name for each point ", () => {
        expectSetsAreEqual(
          // each state bar is modelled as series with single point.
          seriesData.flatMap((s) => s.data).map((point) => [point.name]),
          workItemStateMappings.map((item) => {
            return [item.state];
          })
        );
      });

      test("it sets correct color for each point ", () => {
        expectSetsAreEqual(
          // each state bar is modelled as series with single point.
          seriesData.flatMap((s) => s.data).map((point) => [point.color]),
          workItemStateMappings.map((item) => {
            return [WorkItemStateTypeColor[item.stateType]];
          })
        );
      });
    });

    describe("when the input has a mapping for a created state", () => {
      const workItemsSourceFixture = [
        {
          key: "a92d9cc9-25ba-4337-899f-cba7797a6c12",
          name: "Polaris Platform",
          // Note: This fixture omits the mapping for the "created" state, which is
          // removed by the component before display. This state is normally present in
          // the mapping returned from the server, but it makes for a more intuitive test case to test for the removal
          // separately, so we will setup the default fixture without this state mapped.
          workItemStateMappings: [
            {
              state: "created",
              stateType: "backlog",
            },
            {
              state: "accepted",
              stateType: "closed",
            },
            {
              state: "planned",
              stateType: "complete",
            },
            {
              state: "unscheduled",
              stateType: "backlog",
            },
            {
              state: "unstarted",
              stateType: "open",
            },
            {
              state: "started",
              stateType: "open",
            },
            {
              state: "delivered",
              stateType: "wip",
            },
            {
              state: "finished",
              stateType: "complete",
            },
          ],
        },
      ];
      const {series} = renderedChartConfig(
        <WorkItemStateTypeMapChart
          workItemSource={workItemsSourceFixture[0]}
          view="detail"
          enableEdits={true}
        />
      );

      test("it filters out the created state in the chart series", () => {
        expect(series.find(s => s.name === 'created')).toBeUndefined()
      });
    });
    describe("base pedestal series", () => {
      const basePedestalSeries = series.find((s, i) => i === series.length - 1);

      test("it maps categories index to x axis and sets y to a fix value", () => {
        expectSetsAreEqual(
          // each state bar is modelled as series with single point.
          basePedestalSeries.data.map((point) => [point.x, point.y]),
          Object.entries(WorkItemStateTypeDisplayName).map(([key, displayValue], index) => {
            return [index, 1.2];
          })
        );
      });

      test("it sets correct color for each point", () => {
        expectSetsAreEqual(
          // each state bar is modelled as series with single point.
          basePedestalSeries.data.map((point) => [point.color]),
          Object.entries(WorkItemStateTypeDisplayName).map(([key, displayValue], index) => {
            return [WorkItemStateTypeColor[key]];
          })
        );
      });
    });
  });
});
