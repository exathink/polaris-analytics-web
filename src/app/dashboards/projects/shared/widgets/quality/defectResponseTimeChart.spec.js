import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual, formatNumber} from "../../../../../../test/test-utils";
import {Colors} from "../../../../shared/config";
import {DefectResponseTimeChart} from "./defectResponseTimeChart";
import {epoch} from "../../../../../helpers/utility";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const commonMeasurementProps = {
  measurementPeriod: 45,
  measurementWindow: 30,
};

const propsFixture = {
  flowMetricsTrends: [
    {
      measurementDate: "2021-02-25",
      avgLeadTime: 8.614592013888888,
      minCycleTime: null,
      q1CycleTime: null,
      medianCycleTime: null,
      q3CycleTime: null,
      percentileCycleTime: null,
      maxCycleTime: null,
      avgCycleTime: null,
      percentileLeadTime: 15.663148148148148,
      maxLeadTime: 15.663148148148148,
      totalEffort: 1.28333333333333,
      percentileEffort: 0.5,
      avgEffort: 0.320833333333333,
      maxEffort: 0.5,
      avgDuration: 0.00133101851851852,
      maxDuration: 0.00377314814814815,
      percentileDuration: 0.00377314814814815,
      avgLatency: 7.395515046296296,
      maxLatency: 15.045439814814815,
      percentileLatency: 15.045439814814815,
      workItemsWithNullCycleTime: 4,
      workItemsInScope: 4,
      workItemsWithCommits: 4,
      earliestClosedDate: "2021-01-31T15:30:54.457000",
      latestClosedDate: "2021-02-09T18:24:36.648000",
      targetPercentile: null,
    },
    {
      measurementDate: "2021-02-18",
      avgLeadTime: 8.614592013888888,
      minCycleTime: null,
      q1CycleTime: null,
      medianCycleTime: null,
      q3CycleTime: null,
      percentileCycleTime: null,
      maxCycleTime: null,
      avgCycleTime: null,
      percentileLeadTime: 15.663148148148148,
      maxLeadTime: 15.663148148148148,
      totalEffort: 1.28333333333333,
      percentileEffort: 0.5,
      avgEffort: 0.320833333333333,
      maxEffort: 0.5,
      avgDuration: 0.00133101851851852,
      maxDuration: 0.00377314814814815,
      percentileDuration: 0.00377314814814815,
      avgLatency: 7.395515046296296,
      maxLatency: 15.045439814814815,
      percentileLatency: 15.045439814814815,
      workItemsWithNullCycleTime: 4,
      workItemsInScope: 4,
      workItemsWithCommits: 4,
      earliestClosedDate: "2021-01-31T15:30:54.457000",
      latestClosedDate: "2021-02-09T18:24:36.648000",
      targetPercentile: null,
    },
    {
      measurementDate: "2021-02-11",
      avgLeadTime: 7.863567386831276,
      minCycleTime: 8.165266203703704,
      q1CycleTime: 8.165266203703704,
      medianCycleTime: 8.165266203703704,
      q3CycleTime: 8.787557870370371,
      percentileCycleTime: 8.787557870370371,
      maxCycleTime: 8.787557870370371,
      avgCycleTime: 8.476412037037036,
      percentileLeadTime: 12.381631944444445,
      maxLeadTime: 15.663148148148148,
      totalEffort: 4.45,
      percentileEffort: 1.5,
      avgEffort: 0.494444444444444,
      maxEffort: 1.5,
      avgDuration: 0.0837564300411523,
      maxDuration: 0.712847222222222,
      percentileDuration: 0.712847222222222,
      avgLatency: 6.2506558641975305,
      maxLatency: 15.045439814814815,
      percentileLatency: 15.045439814814815,
      workItemsWithNullCycleTime: 7,
      workItemsInScope: 9,
      workItemsWithCommits: 9,
      earliestClosedDate: "2021-01-17T00:53:10.050000",
      latestClosedDate: "2021-02-09T18:24:36.648000",
      targetPercentile: null,
    },
    {
      measurementDate: "2021-02-04",
      avgLeadTime: 11.674032738095239,
      minCycleTime: 8.165266203703704,
      q1CycleTime: 8.165266203703704,
      medianCycleTime: 8.165266203703704,
      q3CycleTime: 8.787557870370371,
      percentileCycleTime: 8.787557870370371,
      maxCycleTime: 8.787557870370371,
      avgCycleTime: 8.476412037037036,
      percentileLeadTime: 11.042488425925926,
      maxLeadTime: 42.95509259259259,
      totalEffort: 3.75,
      percentileEffort: 1.5,
      avgEffort: 0.535714285714286,
      maxEffort: 1.5,
      avgDuration: 0.107005621693122,
      maxDuration: 0.712847222222222,
      percentileDuration: 0.712847222222222,
      avgLatency: 3.8400396825396825,
      maxLatency: 8.16568287037037,
      percentileLatency: 8.16568287037037,
      workItemsWithNullCycleTime: 5,
      workItemsInScope: 7,
      workItemsWithCommits: 7,
      earliestClosedDate: "2021-01-11T21:32:14.538000",
      latestClosedDate: "2021-01-31T15:30:54.457000",
      targetPercentile: null,
    },
  ],
  ...commonMeasurementProps,
};

const commonChartProps = {
  type: "line",
  animation: false,
  backgroundColor: Colors.Chart.backgroundColor,
  panning: true,
  panKey: "shift",
  zoomType: "xy",
};

const fixedChartConfig = {
  chart: {
    ...commonChartProps,
  },
  title: {
    text: `Defect Response Time`,
  },
  subtitle: {
    text: `45 day trend`,
  },
  legend: {
    title: {
      text: `Specs`,
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
      text: `30 days ending`,
    },
  },
  yAxis: {
    type: "linear",
    id: "cycle-metric",
    title: {
      text: "Days",
    },
  },
  tooltip: {
    useHTML: true,
    followPointer: false,
    hideDelay: 0,
  },
};

describe("DefectResponseTimeChart", () => {
  describe("when there is no series data", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      flowMetricsTrends: [],
    };

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [{}, {}],
    };

    test("it renders an empty chart config", () => {
      expect(renderedChartConfig(<DefectResponseTimeChart {...emptyPropsFixture} />)).toMatchObject(
        expectedChartConfig
      );
    });
  });

  describe("when there is data for all trend series", () => {
    const {series} = renderedChartConfig(<DefectResponseTimeChart {...propsFixture} />);

    test("renders two series", () => {
      expect(series).toHaveLength(2);
    });

    test("renders correct chart config", () => {
      const expectedChartConfig = {
        ...fixedChartConfig,
        series: [
          {key: "avgLeadTime", visible: true, type: "spline"},
          {key: "avgCycleTime", visible: true, type: "spline"},
        ],
      };
      expect(renderedChartConfig(<DefectResponseTimeChart {...propsFixture} />)).toMatchObject(expectedChartConfig);
    });

    const {flowMetricsTrends} = propsFixture;
    const trends = [
      {key: "avgLeadTime", displayName: "Avg. Lead Time"},
      {key: "avgCycleTime", displayName: "Avg. Cycle Time"},
    ];

    trends.forEach((trend, index) => {
      describe(`${trend.displayName} series`, () => {
        const responseTimeSeries = series[index];

        test(`renders a chart with the correct number of data points`, () => {
          expect(responseTimeSeries.data).toHaveLength(flowMetricsTrends.length);
        });

        test("it maps dates to the x axis and sets y to a measurement value", () => {
          expectSetsAreEqual(
            responseTimeSeries.data.map((point) => [point.x, point.y]),
            flowMetricsTrends.map((measurement) => {
              return [epoch(measurement.measurementDate, true), measurement[trend.key]];
            })
          );
        });

        test("it sets the reference to the measurement for each point ", () => {
          expectSetsAreEqual(
            responseTimeSeries.data.map((point) => point.measurement),
            flowMetricsTrends.map((measurement) => measurement)
          );
        });

        test("should render the tooltip for point", async () => {
          const [actual] = await renderedTooltipConfig(
            <DefectResponseTimeChart {...propsFixture} />,
            (points) => [points[0]],
            index
          );

          const [testPoint] = flowMetricsTrends.sort(
            (m1, m2) => epoch(m1.measurementDate, true) - epoch(m2.measurementDate, true)
          );
          expect(actual).toMatchObject({
            header: expect.stringMatching(`${commonMeasurementProps.measurementWindow}`),
            body:
              trend.key === "avgLeadTime"
                ? [[expect.stringContaining("Avg Lead Time"), `${formatNumber(testPoint.avgLeadTime)} days`]]
                : [[expect.stringContaining("Avg Cycle Time"), `${formatNumber(testPoint.avgCycleTime)} days`]],
          });
        });
      });
    });
  });
});
