import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual, formatNumber, getNDaysAgo} from "../../../../../../test/test-utils";
import {Colors} from "../../../../shared/config";
import {DefectBacklogTrendsChart} from "./defectBacklogTrendsChart";
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
  backlogTrends: [
    {
      measurementDate: getNDaysAgo(40),
      measurementWindow: 30,
      backlogSize: 21,
      minBacklogSize: 21,
      maxBacklogSize: 25,
      q1BacklogSize: 22,
      q3BacklogSize: 24,
      medianBacklogSize: 23,
      avgBacklogSize: 23,
    },
    {
      measurementDate: getNDaysAgo(32),
      measurementWindow: 30,
      backlogSize: 15,
      minBacklogSize: 15,
      maxBacklogSize: 24,
      q1BacklogSize: 21,
      q3BacklogSize: 23,
      medianBacklogSize: 22,
      avgBacklogSize: 21,
    },
    {
      measurementDate: getNDaysAgo(25),
      measurementWindow: 30,
      backlogSize: 15,
      minBacklogSize: 15,
      maxBacklogSize: 23,
      q1BacklogSize: 15,
      q3BacklogSize: 22,
      medianBacklogSize: 21,
      avgBacklogSize: 19,
    },
  ],
  view: "primary",
  ...commonMeasurementProps,
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
    text: "Defect Backlog",
  },
  subtitle: {
    text: `${commonMeasurementProps.measurementPeriod} day trend`,
  },
  legend: {
    title: {
      text: `Backlog Size`,
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
      text: `${commonMeasurementProps.measurementWindow} days ending`,
    },
  },
  yAxis: {
    type: "linear",
    id: "cycle-metric",
    title: {
      text: `Defects`,
    },
  },
  tooltip: {
    useHTML: true,
    followPointer: false,
    hideDelay: 0,
  },
};

describe("DefectBacklogTrendsChart", () => {
  describe("when there is no series data", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      backlogTrends: [],
    };

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [{}, {}],
    };

    test("it renders an empty chart config", () => {
      expect(renderedChartConfig(<DefectBacklogTrendsChart {...emptyPropsFixture} />)).toMatchObject(
        expectedChartConfig
      );
    });
  });

  describe("when there is data for all trend series", () => {
    const {series} = renderedChartConfig(<DefectBacklogTrendsChart {...propsFixture} />);

    test("renders two series", () => {
      expect(series).toHaveLength(2);
    });

    test("renders correct chart config", () => {
      const expectedChartConfig = {
        ...fixedChartConfig,
        series: [
          {key: "average_backlog_size", name: "Avg. Backlog", type: "line"},
          {key: "backlog_size_box", name: "Range", type: "boxplot"},
        ],
      };
      expect(renderedChartConfig(<DefectBacklogTrendsChart {...propsFixture} />)).toMatchObject(expectedChartConfig);
    });

    const {backlogTrends} = propsFixture;

    describe(`Avg. Backlog series`, () => {
      const [avgBacklogSeries] = series;

      test(`renders a chart with the correct number of data points`, () => {
        expect(avgBacklogSeries.data).toHaveLength(backlogTrends.length);
      });

      test("it maps dates to the x axis and sets y to a measurement value", () => {
        expectSetsAreEqual(
          avgBacklogSeries.data.map((point) => [point.x, point.y]),
          backlogTrends.map((measurement) => {
            return [epoch(measurement.measurementDate, true), measurement["avgBacklogSize"]];
          })
        );
      });

      test("it sets the reference to the measurement for each point", () => {
        expectSetsAreEqual(
          avgBacklogSeries.data.map((point) => point.measurement.key),
          backlogTrends.map((measurement) => measurement.key)
        );
      });

      test("should render the tooltip for point", async () => {
        const [actual] = await renderedTooltipConfig(
          <DefectBacklogTrendsChart {...propsFixture} />,
          (points) => [points[0]],
          0
        );

        const [testPoint] = backlogTrends.sort((m1, m2) => epoch(m1.measurementDate, true) - epoch(m2.measurementDate, true));
        expect(actual).toMatchObject({
          header: expect.stringContaining(`${commonMeasurementProps.measurementWindow}`),
          body: [[expect.stringContaining("Defects"), `${testPoint.avgBacklogSize}`]],
        });
      });
    });

    describe(`Range Boxplot series`, () => {
      const [_, rangeSeries] = series;

      test(`renders a chart with the correct number of data points`, () => {
        expect(rangeSeries.data).toHaveLength(backlogTrends.length);
      });

      test("it correctly maps all values of the series to boxplot points", () => {
        expectSetsAreEqual(
          rangeSeries.data.map((point) => [point.x, point.low, point.q1, point.median, point.q3, point.high]),
          backlogTrends.map((measurement) => {
            return [
              epoch(measurement.measurementDate, true),
              measurement["minBacklogSize"],
              measurement["q1BacklogSize"],
              measurement["medianBacklogSize"],
              measurement["q3BacklogSize"],
              measurement["maxBacklogSize"],
            ];
          })
        );
      });

      test("it sets the reference to the measurement for each point ", () => {
        expectSetsAreEqual(
          rangeSeries.data.map((point) => point.measurement),
          backlogTrends.map((measurement) => measurement)
        );
      });

      test("should render the tooltip for point", async () => {
        const [actual] = await renderedTooltipConfig(
          <DefectBacklogTrendsChart {...propsFixture} />,
          (points) => [points[0]],
          1
        );

        const [testPoint] = backlogTrends.sort((m1, m2) => epoch(m1.measurementDate) - epoch(m2.measurementDate));
        expect(actual).toMatchObject({
          header: expect.stringContaining(`${commonMeasurementProps.measurementWindow}`),
          body: [
            [expect.stringContaining("Maximum"), `${formatNumber(testPoint.maxBacklogSize)} defects`],
            [expect.stringContaining("Upper Quartile"), `${formatNumber(testPoint.q3BacklogSize)} defects`],
            [expect.stringContaining("Median"), `${formatNumber(testPoint.medianBacklogSize)} defects`],
            [expect.stringContaining("Lower Quartile"), `${formatNumber(testPoint.q1BacklogSize)} defects`],
            [expect.stringContaining("Minimum"), `${formatNumber(testPoint.minBacklogSize)} defects`],
          ],
        });
      });
    });
  });
});
