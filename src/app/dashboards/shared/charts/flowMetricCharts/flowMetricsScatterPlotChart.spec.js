import React from "react";
import {expectSetsAreEqual, formatDateRaw, formatNumber, getNDaysAgo} from "../../../../../test/test-utils";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../framework/viz/charts/chart-test-utils";
import {epoch} from "../../../../helpers/utility";
import {AppTerms, Colors, Symbols, WorkItemTypeDisplayName, WorkItemTypeScatterRadius} from "../../config";
import {FlowMetricsScatterPlotChart} from "./flowMetricsScatterPlotChart";
import {projectDeliveryCycleFlowMetricsMeta} from "../../helpers/metricsMeta";
// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const metricsMeta = projectDeliveryCycleFlowMetricsMeta;

const propsFixture = {
  days: 30,
  model: [], // override this in specific test.
  selectedMetric: "leadTime",
  metricsMeta,
  metricTarget: 30,
  targetConfidence: 0.9,
  specsOnly: true,
  showEpics: false,
  yAxisScale: "logarithmic",
};

const commonChartProps = {
  animation: false,
  backgroundColor: Colors.Chart.backgroundColor,
  panning: true,
  panKey: "shift",
  zoomType: "xy",
};

const fixedChartConfig = {
  chart: {
    type: "scatter",
    ...commonChartProps,
  },

  legend: {
    title: {
      text: "Type",
      style: {
        fontStyle: "italic",
      },
    },
    align: "right",
    layout: "vertical",
    verticalAlign: "middle",
    itemMarginBottom: 3,
  },
  xAxis: {
    type: "datetime",
    title: {
      text: `Date Closed`,
    },
  },
  yAxis: {
    id: "cycle-metric",
    title: {
      text: `days`,
    },
  },
  tooltip: {
    useHTML: true,
    followPointer: false,
    hideDelay: 0,
  },
  plotOptions: {
    series: {
      animation: false,
      dataLabels: {
        enabled: true,
        format: `{point.name}`,
        inside: true,
        verticalAlign: "center",
        style: {
          color: "black",
          textOutline: "none",
        },
      },
    },
  },
  time: {
    useUTC: false,
  },
};

describe("FlowMetricsScatterPlotChart", () => {
  describe("when selected metric is leadTime", () => {
    const fixedChartConfigWithLeadTime = {
      ...fixedChartConfig,
      title: {
        text: `${metricsMeta["leadTime"].display} Stability, Last 30 Days`,
      },
      yAxis: {
        ...fixedChartConfig.yAxis,
        plotLines: [
          {
            color: "blue",
            value: 30,
            dashStyle: "longdashdot",
            width: 1,
            zIndex: 7,
            label: {
              text: expect.stringMatching(`90th pct. LT Target=30 days`),
              align: "left",
              verticalAlign: "top",
            },
          },
        ],
      },
    };
    describe("when there are no workitems", () => {
      const emptyPropsFixture = {
        ...propsFixture,
        model: [],
      };

      const expectedChartConfig = {
        ...fixedChartConfigWithLeadTime,
        series: [],
      };

      test("it renders an empty chart config", () => {
        expect(renderedChartConfig(<FlowMetricsScatterPlotChart {...emptyPropsFixture} />)).toMatchObject(
          expectedChartConfig
        );
      });
    });

    describe("when there is a single workitem", () => {
      const workItemFixture = {
        name: "Funnel closed does not match Flow Metrics Closed",
        key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
        displayId: "PO-396",
        workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
        workItemType: "bug",
        state: "DEPLOYED-TO-STAGING",
        startDate: getNDaysAgo(18),
        endDate: getNDaysAgo(10),
        leadTime: 7.895034722222222,
        cycleTime: 7.894618055555555,
        latency: 0.026180555555555554,
        duration: 4.00299768518519,
        effort: 1.16666666666667,
        authorCount: 1,
      };

      const singlePropsFixture = {
        ...propsFixture,
        model: [workItemFixture],
      };

      const fixedSeriesConfig = {
        key: workItemFixture.workItemType,
        id: workItemFixture.workItemType,
        name: WorkItemTypeDisplayName[workItemFixture.workItemType],
        color: Colors.WorkItemType.bug,
        marker: {
          symbol: Symbols.WorkItemType.bug,
          radius: WorkItemTypeScatterRadius[workItemFixture.workItemType],
        },
        turboThreshold: 0,
        allowPointSelect: true,
      };
      const expectedChartConfig = {
        ...fixedChartConfigWithLeadTime,
        yAxis: {
          ...fixedChartConfigWithLeadTime.yAxis,
          plotLines: [
            ...fixedChartConfigWithLeadTime.yAxis.plotLines,
            {
              color: "green",
              dashStyle: "longdashdot",
              width: 1,
              label: {
                text: expect.stringContaining(`Actual=`),
                align: "right",
                verticalAlign: "middle",
              },
            },
          ],
        },
        subtitle: {
          text: expect.stringMatching(`1 ${AppTerms.specs.display} closed`),
        },
        series: [fixedSeriesConfig],
      };

      const renderedChartConfigValue = renderedChartConfig(<FlowMetricsScatterPlotChart {...singlePropsFixture} />);

      test("it renders correct chart config", () => {
        expect(renderedChartConfigValue).toMatchObject(expectedChartConfig);
      });

      const {series} = renderedChartConfigValue;
      test("should create single series", () => {
        expect(series).toHaveLength(1);
      });

      const [{data}] = series;
      test(`renders a chart with the correct number of data points`, () => {
        expect(data).toHaveLength(1);
      });

      test("it sets correct value for y axis for the point", () => {
        expect(data[0].y).toEqual(workItemFixture.leadTime);
      });

      test("it sets the reference of workItemMetaData for each point", () => {
        expect(data[0].cycle).toEqual(workItemFixture);
      });

      test(`should render the tooltip of the point`, async () => {
        const [actual] = await renderedTooltipConfig(
          <FlowMetricsScatterPlotChart {...singlePropsFixture} />,
          (points) => [points[0]],
          0
        );

        const {
          leadTime,
          cycleTime,
          latency,
          authorCount,
          workItemType,
          name,
          displayId,
          endDate,
          state,
        } = workItemFixture;
        const backlogTime = leadTime - cycleTime;
        expect(actual).toMatchObject({
          header: `${WorkItemTypeDisplayName[workItemType]}: ${name} (${displayId})`,
          body: [
            [`Closed: `, `${formatDateRaw(epoch(endDate))}`],
            [`State: `, `${state}`],
            ["Lead Time: ", `${formatNumber(leadTime)} days`],
          ],
        });
      });
    });

    describe("when there are multiple workitems", () => {
      const workItemFixtureForBug = {
        name: "Funnel closed does not match Flow Metrics Closed",
        key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
        displayId: "PO-396",
        workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
        workItemType: "bug",
        state: "DEPLOYED-TO-STAGING",
        startDate: getNDaysAgo(18),
        endDate: getNDaysAgo(10),
        leadTime: 7.895034722222222,
        cycleTime: 7.894618055555555,
        latency: 0.026180555555555554,
        duration: 4.00299768518519,
        effort: 1.16666666666667,
        authorCount: 1,
      };
      const workItemFixtureForStory = {
        name: "Refresh Open Pull Requests view when pull requests are updated. ",
        key: "5bb46a5e-0dfd-41db-9dfc-b0e451aefd46:3590",
        displayId: "PO-399",
        workItemKey: "5bb46a5e-0dfd-41db-9dfc-b0e451aefd46",
        workItemType: "story",
        state: "DEPLOYED-TO-STAGING",
        startDate: getNDaysAgo(12),
        endDate: getNDaysAgo(10),
        leadTime: 1.2248842592592593,
        cycleTime: 1.2246180555555557,
        latency: 1.0530902777777778,
        duration: 0.135092592592593,
        effort: 1,
        authorCount: 1,
      };
      const workItemFixtureForTask = {
        name: "Setup web tests in CI environment",
        key: "9eb7d2cb-05a0-406c-b66d-3c289766abf1:3581",
        displayId: "PO-391",
        workItemKey: "9eb7d2cb-05a0-406c-b66d-3c289766abf1",
        workItemType: "task",
        state: "Done",
        startDate: getNDaysAgo(12),
        endDate: getNDaysAgo(10),
        leadTime: 1.5071527777777778,
        cycleTime: null,
        latency: 0.0002777777777777778,
        duration: 0.570034722222222,
        effort: 2,
        authorCount: 1,
      };
      const multiplePropsFixture = {
        ...propsFixture,
        model: [workItemFixtureForBug, workItemFixtureForStory, workItemFixtureForTask],
      };

      const fixedSeriesConfig = [
        {
          key: workItemFixtureForBug.workItemType,
          id: workItemFixtureForBug.workItemType,
          name: WorkItemTypeDisplayName[workItemFixtureForBug.workItemType],
          color: Colors.WorkItemType[workItemFixtureForBug.workItemType],
          marker: {
            symbol: Symbols.WorkItemType[workItemFixtureForBug.workItemType],
            radius: WorkItemTypeScatterRadius[workItemFixtureForBug.workItemType],
          },
          turboThreshold: 0,
          allowPointSelect: true,
        },
        {
          key: workItemFixtureForStory.workItemType,
          id: workItemFixtureForStory.workItemType,
          name: WorkItemTypeDisplayName[workItemFixtureForStory.workItemType],
          color: Colors.WorkItemType[workItemFixtureForStory.workItemType],
          marker: {
            symbol: Symbols.WorkItemType[workItemFixtureForStory.workItemType],
            radius: WorkItemTypeScatterRadius[workItemFixtureForStory.workItemType],
          },
          turboThreshold: 0,
          allowPointSelect: true,
        },
        {
          key: workItemFixtureForTask.workItemType,
          id: workItemFixtureForTask.workItemType,
          name: WorkItemTypeDisplayName[workItemFixtureForTask.workItemType],
          color: Colors.WorkItemType[workItemFixtureForTask.workItemType],
          marker: {
            symbol: Symbols.WorkItemType[workItemFixtureForTask.workItemType],
            radius: WorkItemTypeScatterRadius[workItemFixtureForTask.workItemType],
          },
          turboThreshold: 0,
          allowPointSelect: true,
        },
      ];
      const expectedChartConfig = {
        ...fixedChartConfigWithLeadTime,
        yAxis: {
          ...fixedChartConfigWithLeadTime.yAxis,
          plotLines: [
            ...fixedChartConfigWithLeadTime.yAxis.plotLines,
            {
              color: "green",
              dashStyle: "longdashdot",
              width: 1,
              label: {
                text: expect.stringContaining(`Actual=`),
                align: "right",
                verticalAlign: "middle",
              },
            },
          ],
        },
        subtitle: {
          text: expect.stringMatching(`3 ${AppTerms.specs.display} closed`),
        },
        series: fixedSeriesConfig,
      };

      const renderedChartConfigValue = renderedChartConfig(<FlowMetricsScatterPlotChart {...multiplePropsFixture} />);

      test("it renders correct chart config", () => {
        expect(renderedChartConfigValue).toMatchObject(expectedChartConfig);
      });

      const {series} = renderedChartConfigValue;
      test("should create correct number of series", () => {
        expect(series).toHaveLength(3);
      });

      // get the points from all series
      const data = series.flatMap((s) => s.data);
      test(`renders a chart with the correct number of data points`, () => {
        expect(data).toHaveLength(3);
      });

      test("it sets correct value for y axis for each point", () => {
        expectSetsAreEqual(
          data.map((point) => point.y),
          multiplePropsFixture.model.map((wifixture) => wifixture.leadTime)
        );
      });

      test("it sets the reference of workItemMetaData for each point", () => {
        expect(data.map((point) => point.cycle)).toEqual(multiplePropsFixture.model.map((wifixture) => wifixture));
      });

      test(`should render the tooltip for point, when workItemType is story`, async () => {
        const [actual] = await renderedTooltipConfig(
          <FlowMetricsScatterPlotChart {...multiplePropsFixture} />,
          (points) => [points[0]],
          1 // this will return point from second series (which is story series)
        );

        const {
          leadTime,
          cycleTime,
          latency,
          authorCount,
          workItemType,
          name,
          displayId,
          endDate,
          state,
        } = workItemFixtureForStory;
        const backlogTime = leadTime - cycleTime;
        expect(actual).toMatchObject({
          header: `${WorkItemTypeDisplayName[workItemType]}: ${name} (${displayId})`,
          body: [
            [`Closed: `, `${formatDateRaw(epoch(endDate))}`],
            [`State: `, `${state}`],
            ["Lead Time: ", `${formatNumber(leadTime)} days`],

          ],
        });
      });
    });
  });

  describe("when selected metric is cycle time", () => {
    const selectedMetric = "cycleTime";
    const fixedChartConfigWithCycleTime = {
      ...fixedChartConfig,
      title: {
        text: `${metricsMeta[selectedMetric].display} Stability, Last 30 Days`,
      },
      yAxis: {
        ...fixedChartConfig.yAxis,
        plotLines: [
          {
            color: "orange",
            value: 7,
            dashStyle: "longdashdot",
            width: 1,
            zIndex: 7,
            label: {
              text: expect.stringContaining(`90th pct. CT Target=7 days`),
              align: "left",
              verticalAlign: "top",
            },
          },
        ],
      },
    };

    describe("when there are no workitems", () => {
      const emptyPropsFixture = {
        ...propsFixture,
        metricTarget: 7,
        targetConfidence: 0.9,
        selectedMetric,
        model: [],
      };

      const expectedChartConfig = {
        ...fixedChartConfigWithCycleTime,
        series: [],
      };

      test("it renders an empty chart config", () => {
        expect(renderedChartConfig(<FlowMetricsScatterPlotChart {...emptyPropsFixture} />)).toMatchObject(
          expectedChartConfig
        );
      });
    });

    describe("when there is a single workitem", () => {
      const workItemFixture = {
        name: "Funnel closed does not match Flow Metrics Closed",
        key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
        displayId: "PO-396",
        workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
        workItemType: "bug",
        state: "DEPLOYED-TO-STAGING",
        startDate: getNDaysAgo(18),
        endDate: getNDaysAgo(10),
        leadTime: 7.895034722222222,
        cycleTime: 7.894618055555555,
        latency: 0.026180555555555554,
        duration: 4.00299768518519,
        effort: 1.16666666666667,
        authorCount: 1,
      };

      const singlePropsFixture = {
        ...propsFixture,
        metricTarget: 7,
        targetConfidence: 0.9,
        selectedMetric,
        model: [workItemFixture],
      };

      const fixedSeriesConfig = {
        key: workItemFixture.workItemType,
        id: workItemFixture.workItemType,
        name: WorkItemTypeDisplayName[workItemFixture.workItemType],
        color: Colors.WorkItemType.bug,
        marker: {
          symbol: Symbols.WorkItemType.bug,
          radius: WorkItemTypeScatterRadius[workItemFixture.workItemType],
        },
        turboThreshold: 0,
        allowPointSelect: true,
      };

      const expectedChartConfig = {
        ...fixedChartConfigWithCycleTime,
        yAxis: {
          ...fixedChartConfigWithCycleTime.yAxis,
          plotLines: [
            ...fixedChartConfigWithCycleTime.yAxis.plotLines,
            {
              color: "green",
              dashStyle: "longdashdot",
              width: 1,
              label: {
                text: expect.stringContaining(`Actual=`),
                align: "right",
                verticalAlign: "middle",
              },
            },
          ],
        },
        subtitle: {
          text: expect.stringContaining(`1 ${AppTerms.specs.display} closed`),
        },
        series: [fixedSeriesConfig],
      };

      const renderedChartConfigValue = renderedChartConfig(<FlowMetricsScatterPlotChart {...singlePropsFixture} />);

      test("it renders correct chart config", () => {
        expect(renderedChartConfigValue).toMatchObject(expectedChartConfig);
      });

      test(`should render the tooltip of the point`, async () => {
        const [actual] = await renderedTooltipConfig(
          <FlowMetricsScatterPlotChart {...singlePropsFixture} />,
          (points) => [points[0]],
          0
        );

        const {
          leadTime,
          cycleTime,
          latency,
          authorCount,
          workItemType,
          name,
          displayId,
          endDate,
          state,
        } = workItemFixture;
        const backlogTime = leadTime - cycleTime;
        expect(actual).toMatchObject({
          header: `${WorkItemTypeDisplayName[workItemType]}: ${name} (${displayId})`,
          body: [
            [`Closed: `, `${formatDateRaw(epoch(endDate))}`],
            [`State: `, `${state}`],
            ["Cycle Time: ", `${formatNumber(cycleTime)} days`],

          ],
        });
      });
    });

    describe("when there are multiple workitems", () => {
      const workItemFixtureForBug = {
        name: "Funnel closed does not match Flow Metrics Closed",
        key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
        displayId: "PO-396",
        workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
        workItemType: "bug",
        state: "DEPLOYED-TO-STAGING",
        startDate: getNDaysAgo(18),
        endDate: getNDaysAgo(10),
        leadTime: 7.895034722222222,
        cycleTime: 7.894618055555555,
        latency: 0.026180555555555554,
        duration: 4.00299768518519,
        effort: 1.16666666666667,
        authorCount: 1,
      };
      const workItemFixtureForStory = {
        name: "Refresh Open Pull Requests view when pull requests are updated. ",
        key: "5bb46a5e-0dfd-41db-9dfc-b0e451aefd46:3590",
        displayId: "PO-399",
        workItemKey: "5bb46a5e-0dfd-41db-9dfc-b0e451aefd46",
        workItemType: "story",
        state: "DEPLOYED-TO-STAGING",
        startDate: getNDaysAgo(12),
        endDate: getNDaysAgo(10),
        leadTime: 1.2248842592592593,
        cycleTime: 1.2246180555555557,
        latency: 1.0530902777777778,
        duration: 0.135092592592593,
        effort: 1,
        authorCount: 1,
      };
      const workItemFixtureForTask = {
        name: "Setup web tests in CI environment",
        key: "9eb7d2cb-05a0-406c-b66d-3c289766abf1:3581",
        displayId: "PO-391",
        workItemKey: "9eb7d2cb-05a0-406c-b66d-3c289766abf1",
        workItemType: "task",
        state: "Done",
        startDate: getNDaysAgo(12),
        endDate: getNDaysAgo(10),
        leadTime: 1.5071527777777778,
        cycleTime: null,
        latency: 0.0002777777777777778,
        duration: 0.570034722222222,
        effort: 2,
        authorCount: 1,
      };
      const multiplePropsFixture = {
        ...propsFixture,
        metricTarget: 7,
        targetConfidence: 0.9,
        selectedMetric,
        model: [workItemFixtureForBug, workItemFixtureForStory, workItemFixtureForTask],
      };

      const fixedSeriesConfig = [
        {
          key: workItemFixtureForBug.workItemType,
          id: workItemFixtureForBug.workItemType,
          name: WorkItemTypeDisplayName[workItemFixtureForBug.workItemType],
          color: Colors.WorkItemType[workItemFixtureForBug.workItemType],
          marker: {
            symbol: Symbols.WorkItemType[workItemFixtureForBug.workItemType],
            radius: WorkItemTypeScatterRadius[workItemFixtureForBug.workItemType],
          },
          turboThreshold: 0,
          allowPointSelect: true,
        },
        {
          key: workItemFixtureForStory.workItemType,
          id: workItemFixtureForStory.workItemType,
          name: WorkItemTypeDisplayName[workItemFixtureForStory.workItemType],
          color: Colors.WorkItemType[workItemFixtureForStory.workItemType],
          marker: {
            symbol: Symbols.WorkItemType[workItemFixtureForStory.workItemType],
            radius: WorkItemTypeScatterRadius[workItemFixtureForStory.workItemType],
          },
          turboThreshold: 0,
          allowPointSelect: true,
        },
        {
          key: workItemFixtureForTask.workItemType,
          id: workItemFixtureForTask.workItemType,
          name: WorkItemTypeDisplayName[workItemFixtureForTask.workItemType],
          color: Colors.WorkItemType[workItemFixtureForTask.workItemType],
          marker: {
            symbol: Symbols.WorkItemType[workItemFixtureForTask.workItemType],
            radius: WorkItemTypeScatterRadius[workItemFixtureForTask.workItemType],
          },
          turboThreshold: 0,
          allowPointSelect: true,
        },
      ];

      const expectedChartConfig = {
        ...fixedChartConfigWithCycleTime,
        yAxis: {
          ...fixedChartConfigWithCycleTime.yAxis,
          plotLines: [
            ...fixedChartConfigWithCycleTime.yAxis.plotLines,
            {
              color: "green",
              dashStyle: "longdashdot",
              width: 1,
              label: {
                text: expect.stringContaining(`Actual=`),
                align: "right",
                verticalAlign: "middle",
              },
            },
          ],
        },
        subtitle: {
          text: expect.stringContaining(`(1 with no cycle time)`),
        },
        series: fixedSeriesConfig,
      };

      const renderedChartConfigValue = renderedChartConfig(<FlowMetricsScatterPlotChart {...multiplePropsFixture} />);

      test("it renders correct chart config", () => {
        expect(renderedChartConfigValue).toMatchObject(expectedChartConfig);
      });
    });
  });

  describe("when selected metric is Backlog Time", () => {
    const selectedMetric = "backlogTime";
    const fixedChartConfigWithBacklogTime = {
      ...fixedChartConfig,
      title: {
        text: `${metricsMeta[selectedMetric].display} Stability, Last 30 Days`,
      },
      yAxis: {
        ...fixedChartConfig.yAxis,
        plotLines: [
          {
            color: "blue",
            value: 7,
            dashStyle: "longdashdot",
            width: 1,
            zIndex: 7,
            label: {
              text: expect.stringContaining(`90th pct. LT Target=7 days`),
              align: "left",
              verticalAlign: "top",
            },
          },
        ],
      },
    };

    describe("when there is a single workitem", () => {
      const workItemFixture = {
        name: "Funnel closed does not match Flow Metrics Closed",
        key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
        displayId: "PO-396",
        workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
        workItemType: "bug",
        state: "DEPLOYED-TO-STAGING",
        startDate: getNDaysAgo(18),
        endDate: getNDaysAgo(10),
        leadTime: 7.895034722222222,
        cycleTime: 7.894618055555555,
        latency: 0.026180555555555554,
        duration: 4.00299768518519,
        effort: 1.16666666666667,
        authorCount: 1,
      };

      const singlePropsFixture = {
        ...propsFixture,
        // for backlog tab we are sending cycleTime targets
        metricTarget: 7,
        targetConfidence: 0.9,
        selectedMetric,
        model: [workItemFixture],
      };

      const fixedSeriesConfig = {
        key: workItemFixture.workItemType,
        id: workItemFixture.workItemType,
        name: WorkItemTypeDisplayName[workItemFixture.workItemType],
        color: Colors.WorkItemType.bug,
        marker: {
          symbol: Symbols.WorkItemType.bug,
          radius: WorkItemTypeScatterRadius[workItemFixture.workItemType],
        },
        turboThreshold: 0,
        allowPointSelect: true,
      };

      const expectedChartConfig = {
        ...fixedChartConfigWithBacklogTime,
        yAxis: {
          ...fixedChartConfigWithBacklogTime.yAxis,
          plotLines: [
            ...fixedChartConfigWithBacklogTime.yAxis.plotLines,
            {
              color: "green",
              dashStyle: "longdashdot",
              width: 1,
              label: {
                text: expect.stringContaining(`Actual=`),
                align: "right",
                verticalAlign: "middle",
              },
            },
          ],
        },
        series: [fixedSeriesConfig],
      };

      const renderedChartConfigValue = renderedChartConfig(<FlowMetricsScatterPlotChart {...singlePropsFixture} />);

      test("it renders correct chart config", () => {
        expect(renderedChartConfigValue).toMatchObject(expectedChartConfig);
      });

      test(`should render the tooltip of the point`, async () => {
        const [actual] = await renderedTooltipConfig(
          <FlowMetricsScatterPlotChart {...singlePropsFixture} />,
          (points) => [points[0]],
          0
        );

        const {
          leadTime,
          cycleTime,
          latency,
          authorCount,
          workItemType,
          name,
          displayId,
          endDate,
          state,
        } = workItemFixture;
        const backlogTime = leadTime - cycleTime;
        expect(actual).toMatchObject({
          header: `${WorkItemTypeDisplayName[workItemType]}: ${name} (${displayId})`,
          body: [
            [`Closed: `, `${formatDateRaw(epoch(endDate))}`],
            [`State: `, `${state}`],
            ["Backlog Time: ", `${formatNumber(backlogTime)} days`],

          ],
        });
      });
    });
  });

  describe("when selected metric is Effort", () => {
    const selectedMetric = "effort";
    const fixedChartConfigWithEffort = {
      ...fixedChartConfig,
      title: {
        text: `${metricsMeta[selectedMetric].display} Stability, Last 30 Days`,
      },
      yAxis: {
        ...fixedChartConfig.yAxis,
        plotLines: [],
      },
    };

    const workItemFixture = {
      name: "Funnel closed does not match Flow Metrics Closed",
      key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
      displayId: "PO-396",
      workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
      workItemType: "bug",
      state: "DEPLOYED-TO-STAGING",
      startDate: getNDaysAgo(18),
      endDate: getNDaysAgo(10),
      leadTime: 7.895034722222222,
      cycleTime: 7.894618055555555,
      latency: 0.026180555555555554,
      duration: 4.00299768518519,
      effort: 1.16666666666667,
      authorCount: 1,
    };

    const singlePropsFixture = {
      ...propsFixture,
      // for effort tab we are sending null targets
      metricTarget: null,
      targetConfidence: null,
      selectedMetric,
      model: [workItemFixture],
    };

    const fixedSeriesConfig = {
      key: workItemFixture.workItemType,
      id: workItemFixture.workItemType,
      name: WorkItemTypeDisplayName[workItemFixture.workItemType],
      color: Colors.WorkItemType.bug,
      marker: {
        symbol: Symbols.WorkItemType.bug,
        radius: WorkItemTypeScatterRadius[workItemFixture.workItemType],
      },
      turboThreshold: 0,
      allowPointSelect: true,
    };
    const expectedChartConfig = {
      ...fixedChartConfigWithEffort,
      subtitle: {
        text: expect.stringMatching(`1 ${AppTerms.specs.display} closed`),
      },
      yAxis: {
        ...fixedChartConfig.yAxis,
        title: {
          text: "FTE Days",
        },
        plotLines: [],
      },
      series: [fixedSeriesConfig],
    };

    const renderedChartConfigValue = renderedChartConfig(<FlowMetricsScatterPlotChart {...singlePropsFixture} />);

    test("it renders correct chart config", () => {
      expect(renderedChartConfigValue).toMatchObject(expectedChartConfig);
    });
  });

  describe("when selected metric is Authors", () => {
    const selectedMetric = "authors";
    const fixedChartConfigWithAuthors = {
      ...fixedChartConfig,
      title: {
        text: `${metricsMeta[selectedMetric].display} Stability, Last 30 Days`,
      },
      yAxis: {
        ...fixedChartConfig.yAxis,
        title: {
          text: "authors",
        },
        plotLines: [],
      },
    };

    const workItemFixture = {
      name: "Funnel closed does not match Flow Metrics Closed",
      key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
      displayId: "PO-396",
      workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
      workItemType: "bug",
      state: "DEPLOYED-TO-STAGING",
      startDate: getNDaysAgo(18),
      endDate: getNDaysAgo(10),
      leadTime: 7.895034722222222,
      cycleTime: 7.894618055555555,
      latency: 0.026180555555555554,
      duration: 4.00299768518519,
      effort: 1.16666666666667,
      authorCount: 1,
    };

    const singlePropsFixture = {
      ...propsFixture,
      // for authors tab we are sending null targets
      metricTarget: null,
      targetConfidence: null,
      selectedMetric,
      model: [workItemFixture],
    };

    const fixedSeriesConfig = {
      key: workItemFixture.workItemType,
      id: workItemFixture.workItemType,
      name: WorkItemTypeDisplayName[workItemFixture.workItemType],
      color: Colors.WorkItemType.bug,
      marker: {
        symbol: Symbols.WorkItemType.bug,
        radius: WorkItemTypeScatterRadius[workItemFixture.workItemType],
      },
      turboThreshold: 0,
      allowPointSelect: true,
    };
    const expectedChartConfig = {
      ...fixedChartConfigWithAuthors,
      subtitle: {
        text: expect.stringMatching(`1 ${AppTerms.specs.display} closed`),
      },
      series: [fixedSeriesConfig],
    };

    const renderedChartConfigValue = renderedChartConfig(<FlowMetricsScatterPlotChart {...singlePropsFixture} />);

    test("it renders correct chart config", () => {
      expect(renderedChartConfigValue).toMatchObject(expectedChartConfig);
    });
  });
});
