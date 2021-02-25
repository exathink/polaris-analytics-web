import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual, formatNumber, getNDaysAgo} from "../../../../../../test/test-utils";
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
      measurementDate: getNDaysAgo(1),
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
      earliestClosedDate: getNDaysAgo(25),
      latestClosedDate: getNDaysAgo(16),
      targetPercentile: null,
    },
    {
      measurementDate: getNDaysAgo(7),
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
      earliestClosedDate: getNDaysAgo(25),
      latestClosedDate: getNDaysAgo(16),
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
