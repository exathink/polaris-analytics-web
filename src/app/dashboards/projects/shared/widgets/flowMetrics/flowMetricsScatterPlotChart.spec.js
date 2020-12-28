import React from "react";
import {expectSetsAreEqual, formatDateRaw, formatNumber} from "../../../../../../test/test-utils";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../../framework/viz/charts/chart-test-utils";
import {epoch} from "../../../../../helpers/utility";
import {
  Colors,
  Symbols,
  WorkItemColorMap,
  WorkItemSymbolMap,
  WorkItemTypeDisplayName,
  WorkItemTypeScatterRadius,
  WorkItemTypeSortOrder,
} from "../../../../shared/config";
import {FlowMetricsScatterPlotChart} from "./flowMetricsScatterPlotChart";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

// props fixture
const propsFixture = {
  days: 30,
  model: [
    {
      name: "Funnel closed does not match Flow Metrics Closed",
      key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
      displayId: "PO-396",
      workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
      workItemType: "bug",
      state: "DEPLOYED-TO-STAGING",
      startDate: "2020-12-02T00:37:17.095000",
      endDate: "2020-12-09T22:06:08.221000",
      leadTime: 7.895034722222222,
      cycleTime: 7.894618055555555,
      latency: 0.026180555555555554,
      duration: 4.00299768518519,
      effort: 1.16666666666667,
      authorCount: 1,
    },
    {
      name: "Capacity trends widget does not filter out robots. ",
      key: "f6e67348-c174-44a3-b4a4-058b9a967f9b:3603",
      displayId: "PO-402",
      workItemKey: "f6e67348-c174-44a3-b4a4-058b9a967f9b",
      workItemType: "bug",
      state: "DEPLOYED-TO-STAGING",
      startDate: "2020-12-06T17:06:11.068000",
      endDate: "2020-12-06T18:44:16.755000",
      leadTime: 0.06811342592592592,
      cycleTime: null,
      latency: 0.052569444444444446,
      duration: 0,
      effort: 0.333333333333333,
      authorCount: 1,
    },
    {
      name: "Show unmapped states in WorkItemStateMapping GraphQL queries",
      key: "23a42cd4-9004-4b66-818e-c5ecf38c65cc:3595",
      displayId: "PO-400",
      workItemKey: "23a42cd4-9004-4b66-818e-c5ecf38c65cc",
      workItemType: "task",
      state: "DEPLOYED-TO-STAGING",
      startDate: "2020-12-04T19:23:48.782000",
      endDate: "2020-12-05T05:03:34.833000",
      leadTime: 0.40261574074074075,
      cycleTime: null,
      latency: 0.06302083333333333,
      duration: 0.000486111111111111,
      effort: 1,
      authorCount: 1,
    },
    {
      name: "Refresh Open Pull Requests view when pull requests are updated. ",
      key: "5bb46a5e-0dfd-41db-9dfc-b0e451aefd46:3590",
      displayId: "PO-399",
      workItemKey: "5bb46a5e-0dfd-41db-9dfc-b0e451aefd46",
      workItemType: "story",
      state: "DEPLOYED-TO-STAGING",
      startDate: "2020-12-03T22:18:11.793000",
      endDate: "2020-12-05T03:42:01.684000",
      leadTime: 1.2248842592592593,
      cycleTime: 1.2246180555555557,
      latency: 1.0530902777777778,
      duration: 0.135092592592593,
      effort: 1,
      authorCount: 1,
    },
    {
      name: "Add a GraphQL mutation to register webhooks on a repository connector",
      key: "c4eb4a8f-e1a6-4667-8937-eb4f367fc0a5:3582",
      displayId: "PO-390",
      workItemKey: "c4eb4a8f-e1a6-4667-8937-eb4f367fc0a5",
      workItemType: "task",
      state: "DEPLOYED-TO-STAGING",
      startDate: "2020-11-24T21:30:37.892000",
      endDate: "2020-12-03T19:31:17.641000",
      leadTime: 8.91712962962963,
      cycleTime: 8.345,
      latency: null,
      duration: 11.1508333333333,
      effort: 5.33333333333333,
      authorCount: 2,
    },
    {
      name: "Code Review Time Trends Chart",
      key: "415bddce-4c64-4abf-bcb0-73460c5dafc9:3591",
      displayId: "PO-395",
      workItemKey: "415bddce-4c64-4abf-bcb0-73460c5dafc9",
      workItemType: "story",
      state: "DEPLOYED-TO-STAGING",
      startDate: "2020-11-30T23:37:00.228000",
      endDate: "2020-12-03T04:16:24.988000",
      leadTime: 2.1940393518518517,
      cycleTime: null,
      latency: 0.24116898148148147,
      duration: 0.0443171296296296,
      effort: 0.333333333333333,
      authorCount: 1,
    },
    {
      name: "Code Reviews Completed Trend Chart",
      key: "033a700e-5ed7-4992-9141-5f178383ca22:3592",
      displayId: "PO-393",
      workItemKey: "033a700e-5ed7-4992-9141-5f178383ca22",
      workItemType: "story",
      state: "DEPLOYED-TO-STAGING",
      startDate: "2020-11-30T00:41:05.937000",
      endDate: "2020-12-03T04:16:19.928000",
      leadTime: 3.149467592592593,
      cycleTime: null,
      latency: 0.40784722222222225,
      duration: 0.0113310185185185,
      effort: 0.333333333333333,
      authorCount: 1,
    },
    {
      name: "Column chart for Wip Effort",
      key: "85ba52fd-05d5-4ce1-9d6c-82384cb4fa09:3584",
      displayId: "PO-388",
      workItemKey: "85ba52fd-05d5-4ce1-9d6c-82384cb4fa09",
      workItemType: "story",
      state: "DEPLOYED-TO-STAGING",
      startDate: "2020-11-23T16:08:36.135000",
      endDate: "2020-12-02T08:20:57.774000",
      leadTime: 8.67525462962963,
      cycleTime: 4.385034722222223,
      latency: null,
      duration: 4.80559027777778,
      effort: 2.33333333333333,
      authorCount: 1,
    },
    {
      name: "Add Troubleshooting steps for node-gyp error while doing yarn install in Polaris-analytics-web repo",
      key: "f4731dba-6ae0-40a1-9d99-be9097b95310:3594",
      displayId: "PO-394",
      workItemKey: "f4731dba-6ae0-40a1-9d99-be9097b95310",
      workItemType: "task",
      state: "Done",
      startDate: "2020-11-30T13:01:01.872000",
      endDate: "2020-11-30T16:33:56.571000",
      leadTime: 0.1478587962962963,
      cycleTime: null,
      latency: 0.0025462962962962965,
      duration: 0,
      effort: 0.5,
      authorCount: 1,
    },
    {
      name: "Setup web tests in CI environment",
      key: "9eb7d2cb-05a0-406c-b66d-3c289766abf1:3581",
      displayId: "PO-391",
      workItemKey: "9eb7d2cb-05a0-406c-b66d-3c289766abf1",
      workItemType: "task",
      state: "Done",
      startDate: "2020-11-28T04:11:00.554000",
      endDate: "2020-11-29T16:21:18.853000",
      leadTime: 1.5071527777777778,
      cycleTime: null,
      latency: 0.0002777777777777778,
      duration: 0.570034722222222,
      effort: 2,
      authorCount: 1,
    },
  ],
  selectedMetric: "leadTime",
  metricsMeta: {
    leadTime: {
      display: "Lead Time",
      value: (cycle) => cycle.leadTime,
    },
    cycleTime: {
      display: "Cycle Time",
      value: (cycle) => cycle.cycleTime,
    },
    duration: {
      display: "Duration",
      value: (cycle) => cycle.duration,
    },
    latency: {
      display: "Delivery Latency",
      value: (cycle) => cycle.latency,
    },
    effort: {
      display: "Effort",
      value: (cycle) => cycle.effort,
    },
    authors: {
      display: "Authors",
      value: (cycle) => cycle.authorCount,
    },
    backlogTime: {
      display: "Backlog Time",
      value: (cycle) => (cycle.cycleTime > 0 ? cycle.leadTime - cycle.cycleTime : 0),
    },
  },
  projectCycleMetrics: {
    minLeadTime: 0.06811342592592592,
    avgLeadTime: 3.4181550925925928,
    maxLeadTime: 8.91712962962963,
    minCycleTime: 1.2246180555555557,
    avgCycleTime: 5.462317708333333,
    maxCycleTime: 8.345,
    percentileLeadTime: 8.67525462962963,
    percentileCycleTime: 8.345,
    targetPercentile: 0.9,
    workItemsInScope: 10,
    workItemsWithNullCycleTime: 6,
    earliestClosedDate: "2020-11-29T16:21:18.853000",
    latestClosedDate: "2020-12-09T22:06:08.221000",
  },
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
      text: `Days`,
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
function mapSymbol(workItem) {
  if (!workItem.isBug) {
    return WorkItemSymbolMap[workItem.workItemType];
  } else {
    return Symbols.WorkItemType.bug;
  }
}
function mapColor(workItem) {
  if (!workItem.isBug) {
    return WorkItemColorMap[workItem.workItemType];
  } else {
    return Colors.WorkItemType.bug;
  }
}
describe("FlowMetricsScatterPlotChart", () => {
  describe("when there is no model data", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      model: [],
    };

    const {metricsMeta, selectedMetric} = propsFixture;
    const expectedChartConfig = {
      ...fixedChartConfig,
      title: {
        text: metricsMeta[selectedMetric].display,
      },
      series: [],
    };

    test("it renders an empty chart config", () => {
      expect(renderedChartConfig(<FlowMetricsScatterPlotChart {...emptyPropsFixture} />)).toMatchObject(
        expectedChartConfig
      );
    });
  });

  describe("when there is model data", () => {
    const {model, metricsMeta, selectedMetric} = propsFixture;
    const deliveryCyclesByWorkItemType = model.reduce((groups, cycle) => {
      if (groups[cycle.workItemType] != null) {
        groups[cycle.workItemType].push(cycle);
      } else {
        groups[cycle.workItemType] = [cycle];
      }
      return groups;
    }, {});

    describe("when metrics are selected", () => {
      const selectedMetrics = ["leadTime", "cycleTime", "latency", "duration", "effort", "authors", "backlogTime"];
      selectedMetrics.forEach((selectedMetric) => {
        test(`it renders chart config when selectedMetric is ${selectedMetric}`, () => {
          const selectedMetricPropsFixture = {
            ...propsFixture,
            selectedMetric: selectedMetric,
          };

          const seriesData = Object.entries(deliveryCyclesByWorkItemType)
            .sort((entryA, entryB) => WorkItemTypeSortOrder[entryA[0]] - WorkItemTypeSortOrder[entryB[0]])
            .map(([workItemType, cycles]) => ({
              key: workItemType,
              id: workItemType,
              name: WorkItemTypeDisplayName[workItemType],
              color: mapColor(cycles[0]),
              marker: {
                symbol: mapSymbol(cycles[0]),
                radius: WorkItemTypeScatterRadius[workItemType],
              },
              data: cycles.map((cycle) => ({
                x: epoch(cycle.endDate),
                y: metricsMeta[selectedMetric].value(cycle),
                z: 1,
                cycle: cycle,
              })),
              turboThreshold: 0,
              allowPointSelect: true,
            }));

          const expectedChartConfig = {
            ...fixedChartConfig,
            title: {
              text: metricsMeta[selectedMetric].display,
            },
            series: seriesData,
          };
          expect(renderedChartConfig(<FlowMetricsScatterPlotChart {...selectedMetricPropsFixture} />)).toMatchObject(
            expectedChartConfig
          );
        });
      });
    });

    describe("all series", () => {
      const {series} = renderedChartConfig(<FlowMetricsScatterPlotChart {...propsFixture} />);
      const cases = [
        {name: "Bug", data: propsFixture.model.filter((x) => x.workItemType === "bug")},
        {name: "Story", data: propsFixture.model.filter((x) => x.workItemType === "story")},
        {name: "Task", data: propsFixture.model.filter((x) => x.workItemType === "task")},
      ];
      cases.forEach((item, index) => {
        describe(`${item.name}`, () => {
          const individualSeries = series[index];
          test("renders a chart with the correct number of data points", () => {
            expect(item.data).toHaveLength(individualSeries.data.length);
          });

          test("it maps dates to the x axis and sets y to be selected metric value", () => {
            expectSetsAreEqual(
              individualSeries.data.map((point) => [point.x, point.y]),
              item.data.map((cycle) => {
                return [epoch(cycle.endDate), metricsMeta[selectedMetric].value(cycle)];
              })
            );
          });

          test("it sets the reference to cycle for each point ", () => {
            expectSetsAreEqual(
              individualSeries.data.map((point) => point.cycle),
              item.data.map((cycle) => cycle)
            );
          });

          test("should render the tooltip for point", async () => {
            const [actual] = await renderedTooltipConfig(
              <FlowMetricsScatterPlotChart {...propsFixture} />,
              (points) => [points[0]],
              index
            );
            const firstPointCycle = item.data[0];

            const leadTime = metricsMeta["leadTime"].value(firstPointCycle);
            const cycleTime = metricsMeta["cycleTime"].value(firstPointCycle);
            const latency = metricsMeta["latency"].value(firstPointCycle);
            const authorCount = metricsMeta["authors"].value(firstPointCycle);
            const backlogTime = metricsMeta["backlogTime"].value(firstPointCycle);

            expect(actual).toMatchObject({
              header: `${WorkItemTypeDisplayName[firstPointCycle.workItemType]}: ${firstPointCycle.name} (${
                firstPointCycle.displayId
              })`,
              body: [
                [`Closed: `, `${formatDateRaw(epoch(firstPointCycle.endDate))}`],
                [`State: `, `${firstPointCycle.state}`],
                ["Lead Time: ", `${formatNumber(leadTime)} days`],
                [`------`, ``],
                ["Backlog Time: ", backlogTime > 0 ? `${formatNumber(backlogTime)} days` : "N/A"],
                ["Cycle Time: ", cycleTime > 0 ? `${formatNumber(cycleTime)} days` : "N/A"],

                ["Delivery Latency: ", `${formatNumber(latency)} days`],

                ["Duration: ", expect.stringMatching(`days`)],
                ["Effort: ", expect.stringMatching(`dev-days`)],
                ["Authors: ", `${formatNumber(authorCount)}`],
              ],
            });
          });
        });
      });
    });
  });
});
