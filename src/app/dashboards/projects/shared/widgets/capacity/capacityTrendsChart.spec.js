import React from "react";
import {renderedChartConfig} from "../../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual} from "../../../../../../test/test-utils";
import {Colors} from "../../../../shared/config";
import {CapacityTrendsChart} from "./capacityTrendsChart";
import {epoch} from "../../../../../helpers/utility";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const propsFixture = {
  capacityTrends: [
    {
      measurementDate: "2020-12-17",
      contributorCount: 3,
      totalCommitDays: 49,
      avgCommitDays: 16.333333333333332,
      minCommitDays: 14,
      maxCommitDays: 20,
    },
    {
      measurementDate: "2020-12-10",
      contributorCount: 3,
      totalCommitDays: 60,
      avgCommitDays: 20,
      minCommitDays: 16,
      maxCommitDays: 27,
    },
    {
      measurementDate: "2020-12-03",
      contributorCount: 3,
      totalCommitDays: 54,
      avgCommitDays: 18,
      minCommitDays: 13,
      maxCommitDays: 25,
    },
    {
      measurementDate: "2020-11-26",
      contributorCount: 3,
      totalCommitDays: 50,
      avgCommitDays: 16.666666666666668,
      minCommitDays: 9,
      maxCommitDays: 25,
    },
    {
      measurementDate: "2020-11-19",
      contributorCount: 3,
      totalCommitDays: 46,
      avgCommitDays: 15.333333333333334,
      minCommitDays: 4,
      maxCommitDays: 26,
    },
    {
      measurementDate: "2020-11-12",
      contributorCount: 3,
      totalCommitDays: 42,
      avgCommitDays: 14,
      minCommitDays: 1,
      maxCommitDays: 23,
    },
    {
      measurementDate: "2020-11-05",
      contributorCount: 2,
      totalCommitDays: 42,
      avgCommitDays: 21,
      minCommitDays: 18,
      maxCommitDays: 24,
    },
  ],
  contributorDetail: [],
  cycleMetricsTrends: [
    {
      measurementDate: "2020-12-17",
      totalEffort: 31.1666666666667,
    },
    {
      measurementDate: "2020-12-10",
      totalEffort: 40.8333333333333,
    },
    {
      measurementDate: "2020-12-03",
      totalEffort: 40.8333333333333,
    },
    {
      measurementDate: "2020-11-26",
      totalEffort: 46,
    },
    {
      measurementDate: "2020-11-19",
      totalEffort: 40.3333333333333,
    },
    {
      measurementDate: "2020-11-12",
      totalEffort: 38.1666666666667,
    },
    {
      measurementDate: "2020-11-05",
      totalEffort: 36.6666666666667,
    },
  ],
  measurementPeriod: 45,
  measurementWindow: 30,
  view: "primary",
  parentView: "primary",
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
    ...commonChartProps,
  },
  title: {
    text: `Capacity Trends `,
  },
  subtitle: {
    text: `45 day trend`,
  },
  xAxis: {
    type: "datetime",
    title: {
      text: `30 days ending`,
    },
  },
  yAxis: [
    {
      id: "commit-days",
      type: "linear",
      title: {
        text: `Dev-Days`,
      },
    },
  ],
  tooltip: {
    useHTML: true,
    followPointer: false,
    hideDelay: 0,
  },
};

describe("CapacityTrendsChart", () => {
  describe("when there is no trends series data", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      capacityTrends: [],
      cycleMetricsTrends: [],
    };

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [{}, {}, {}], // as it renders three series, baseline, total capacity, total effort
    };

    test("it renders an empty chart config", () => {
      expect(renderedChartConfig(<CapacityTrendsChart {...emptyPropsFixture} />)).toMatchObject(expectedChartConfig);
    });

    test("when there is no trends data for Total Capacity series but there is data for Total Effort Series", () => {
      const emptyPropsFixture = {
        ...propsFixture,
        capacityTrends: [],
      };

      const cycleMetricsTrends = {
        key: "totalEffort",
        id: "totalEffort",
        type: "spline",
        name: "Total Effort",
        visible: true,
        data: propsFixture.cycleMetricsTrends
          .map((measurement) => ({
            x: epoch(measurement.measurementDate, true),
            y: measurement["totalEffort"],
            measurement: measurement,
          }))
          .sort((m1, m2) => m1.x - m2.x),
        stacking: null,
        color: "#4c84ec",
      };

      const expectedChartConfig = {
        ...fixedChartConfig,
        series: [{}, {}, cycleMetricsTrends], // as it renders three series, baseline, total capacity, total effort
      };
      expect(renderedChartConfig(<CapacityTrendsChart {...emptyPropsFixture} />)).toMatchObject(expectedChartConfig);
    });

    test("when there is no trends data for Total Effort Series but there is data for Total Capacity series", () => {
      const emptyPropsFixture = {
        ...propsFixture,
        cycleMetricsTrends: [],
      };

      const capacityTrends = {
        key: "totalCommitDays",
        id: "totalCommitDays",
        type: "spline",
        name: "Total Capacity",
        visible: true,
        data: propsFixture.capacityTrends
          .map((measurement) => ({
            x: epoch(measurement.measurementDate, true),
            y: measurement["totalCommitDays"],
            measurement: measurement,
          }))
          .sort((m1, m2) => m1.x - m2.x),
        stacking: null,
        color: "#0f49b1",
      };

      const expectedChartConfig = {
        ...fixedChartConfig,
        series: [{}, capacityTrends, {}], // as it renders three series, baseline, total capacity, total effort
      };
      expect(renderedChartConfig(<CapacityTrendsChart {...emptyPropsFixture} />)).toMatchObject(expectedChartConfig);
    });
  });

  describe("when there is data for all trend series", () => {
    const {series} = renderedChartConfig(<CapacityTrendsChart {...propsFixture} />);

    const trends = [
      {trend: "capacityTrends", displayName: "Total Capacity", key: "totalCommitDays"},
      {trend: "cycleMetricsTrends", displayName: "Total Effort", key: "totalEffort"},
    ];

    trends.forEach((trend, index) => {
      describe(`${trend.displayName} series`, () => {
        const seriesFixture = propsFixture[trend.trend];
        const seriesData = series[index + 1];

        test(`renders a chart with the correct number of data points`, () => {
          expect(seriesFixture).toHaveLength(seriesData.data.length);
        });

        test("it maps date to the x axis and sets y to a measurement value", () => {
          expectSetsAreEqual(
            seriesData.data.map((point) => [point.x, point.y]),
            seriesFixture.map((measurement) => {
              return [epoch(measurement.measurementDate, true), measurement[trend.key]];
            })
          );
        });
      });
    });
  });
});
