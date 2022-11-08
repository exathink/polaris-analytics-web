import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../framework/viz/charts/chart-test-utils";

import {expectSetsAreEqual, formatNumber} from "../../../../../test/test-utils";

import {MeasurementTrendLineChart} from "./measurementTrendLineChart";
import {AppTerms, Colors} from "../../../shared/config";
import {epoch, i18nDate} from "../../../../helpers/utility";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const measurementsFixture = [
  {
    measurementDate: "2020-12-01",
    measurementWindow: 30,
    primaryKey: 1.31095732285237,
    secondaryKey: 36,
    tertiaryKey: 29,
  },
  {
    measurementDate: "2020-11-24",
    measurementWindow: 30,
    primaryKey: 0.893518078421409,
    secondaryKey: 41,
    tertiaryKey: 27,
  },
  {
    measurementDate: "2020-11-17",
    measurementWindow: 30,
    primaryKey: 1.1846755006529,
    secondaryKey: 39,
    tertiaryKey: 32,
  },
  {
    measurementDate: "2020-11-10",
    measurementWindow: 30,
    primaryKey: 0.72456336961962,
    secondaryKey: 37,
    tertiaryKey: 37,
  },
  {
    measurementDate: "2020-11-03",
    measurementWindow: 30,
    primaryKey: 0.705498012000488,
    secondaryKey: 38,
    tertiaryKey: 33,
  },
  {
    measurementDate: "2020-10-27",
    measurementWindow: 30,
    primaryKey: 0.797267541473766,
    secondaryKey: 36,
    tertiaryKey: 49,
  },
  {
    measurementDate: "2020-10-20",
    measurementWindow: 30,
    primaryKey: 1.07294166335979,
    secondaryKey: 35,
    tertiaryKey: 48,
  },
];

const measurementConfig = {
  title: "General Chart",
  yAxisUom: "Days",
  plotBands: {
    metric: "secondaryKey",
  },
  yAxisNormalization: {
    metric: "secondaryKey",
    minScale: 0,
    maxScale: 1.25,
  },
  tooltip: {
    formatter: (measurement, seriesKey, intl) => {
      const obj = {
        primaryKey: ["First Series: ", `${formatNumber(measurement.primaryKey)} Days`],
        secondaryKey: ["Second Series: ", `${formatNumber(measurement.secondaryKey)} Days`],
        tertiaryKey: ["Third Series: ", `${formatNumber(measurement.tertiaryKey)} Days`],
      };

      return {
        header: `${measurementFixture.measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
        body: [obj[seriesKey]],
      };
    },
  },
};

const measurementFixture = {
  measurementPeriod: 45,
  measurementWindow: 30,
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
    type: "line",
    ...commonChartProps,
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
  },
  xAxis: {
    type: "datetime",
  },
  yAxis: {
    type: "linear",
    id: "cycle-metric",
  },
  time: {
    useUTC: false,
  },
};

const fixedSeriesConfig = {};

describe("MeasurementTrendLineChart", () => {
  describe("when there are no points and no config", () => {
    const emptyMeasurement = {
      ...measurementFixture,
      measurements: [],
      metrics: [{key: "primaryKey", displayName: "First Series", visible: true, type: "spline"}],
      config: {},
    };

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [
        {
          ...fixedSeriesConfig,
          data: [],
        },
      ],
    };

    test("it renders an empty chart config in primary view", () => {
      expect(renderedChartConfig(<MeasurementTrendLineChart {...emptyMeasurement} view="primary" />)).toMatchObject(
        expectedChartConfig
      );
    });

    test("it renders an empty chart config  in detail view", () => {
      expect(renderedChartConfig(<MeasurementTrendLineChart {...emptyMeasurement} view={"detail"} />)).toMatchObject(
        expectedChartConfig
      );
    });
  });

  describe("when there are no points but there is config for the chart", () => {
    test("it sets the correct title/subtitle of the chart", () => {
      const measurementWithTitle = {
        ...measurementFixture,
        measurements: [],
        metrics: [{key: "primaryKey", displayName: "First Series", visible: true, type: "spline"}],
        config: {
          title: "General Chart Title",
          subTitle: `45 day trend`,
        },
      };

      const expectedChartConfig = {
        ...fixedChartConfig,
        title: {text: measurementWithTitle.config.title},
        subtitle: {text: measurementWithTitle.config.subTitle},
        series: [
          {
            ...fixedSeriesConfig,
            data: [],
          },
        ],
      };

      expect(renderedChartConfig(<MeasurementTrendLineChart {...measurementWithTitle} view="primary" />)).toMatchObject(
        expectedChartConfig
      );
    });

    test("it sets the correct unit of measurements and legendText for axis of the chart", () => {
      const measurementWithUom = {
        ...measurementFixture,
        measurements: [],
        metrics: [{key: "primaryKey", displayName: "First Series", visible: true, type: "spline"}],
        config: {
          xAxisUom: "datetime",
          yAxisUom: "Days",
          legendText: AppTerms.specs.display,
        },
      };

      const expectedChartConfig = {
        ...fixedChartConfig,
        yAxis: {title: {text: measurementWithUom.config.yAxisUom}},
        xAxis: {title: {text: measurementWithUom.config.xAxisUom}},
        legend: {title: {text: measurementWithUom.config.legendText}},
        series: [
          {
            ...fixedSeriesConfig,
            data: [],
          },
        ],
      };

      expect(renderedChartConfig(<MeasurementTrendLineChart {...measurementWithUom} view="primary" />)).toMatchObject(
        expectedChartConfig
      );
    });
  });


  describe("measurement trends chart with one series", () => {
    const singleMetricsFixture = {key: "primaryKey", displayName: "First Series", visible: true, type: "spline"};
    const pullRequestMeasurement = {
      ...measurementFixture,
      measurements: measurementsFixture,
      metrics: [singleMetricsFixture],
      config: measurementConfig,
    };

    const {
      series: [{data}],
    } = renderedChartConfig(<MeasurementTrendLineChart {...pullRequestMeasurement} view={"primary"} />);

    test("it renders a chart with the correct numbers of data points ", () => {
      expect(data).toHaveLength(measurementsFixture.length);
    });

    test("it maps dates to the x axis and sets y to days", () => {
      expectSetsAreEqual(
        data.map((point) => [point.x, point.y]),
        measurementsFixture.map((measurement) => {
          const yAxisVal = singleMetricsFixture.key;
          const primaryKey = measurement[yAxisVal];
          return [epoch(measurement.measurementDate, true), primaryKey];
        })
      );
    });

    test("it sets the reference to the measurement for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.measurement.key),
        measurementsFixture.map((x) => singleMetricsFixture.key)
      );
    });

    test("should render the tooltip for point", async () => {
      const [actual] = await renderedTooltipConfig(
        <MeasurementTrendLineChart {...pullRequestMeasurement} view={"primary"} />,
        (points) => [points[0]]
      );

      const firstMeasurementPoint = measurementsFixture.sort(
        (m1, m2) => epoch(m1.measurementDate, true) - epoch(m2.measurementDate, true)
      )[0];
      expect(actual).toMatchObject({
        header: expect.stringMatching(`${measurementFixture.measurementWindow}`),
        body: [["First Series: ", `${formatNumber(firstMeasurementPoint.primaryKey)} Days`]],
      });
    });
  });

  describe("measurement trends chart with multiple series", () => {
    const metricsFixturewithMultipleSeries = [
      {key: "primaryKey", displayName: "Primary Series", visible: true, type: "spline"},
      {key: "secondaryKey", displayName: "Secondary Series", visible: true, type: "spline"},
      {key: "tertiaryKey", displayName: "Tertiary Series", visible: true, type: "spline"},
    ];
    const pullRequestMeasurement = {
      ...measurementFixture,
      measurements: measurementsFixture,
      metrics: metricsFixturewithMultipleSeries,
      config: measurementConfig,
    };

    const {
      series: [{data: firstSeriesData}, {data: secondSeriesData}, {data: tertiarySeriesData}],
    } = renderedChartConfig(<MeasurementTrendLineChart {...pullRequestMeasurement} view={"primary"} />);

    const cases = [
      {metric: "primaryKey", data: firstSeriesData, displayName: "First Series: "},
      {metric: "secondaryKey", data: secondSeriesData, displayName: "Second Series: "},
      {metric: "tertiaryKey", data: tertiarySeriesData, displayName: "Third Series: "},
    ];

    // Generating test cases for similar usecases
    cases.forEach(({metric, data, displayName}, index) => {
      test(`it renders a chart with the correct numbers of data points for ${metric} series`, () => {
        expect(data).toHaveLength(measurementsFixture.length);
      });

      test(`it maps dates to the x axis and sets y to days for ${metric} series`, () => {
        expectSetsAreEqual(
          data.map((point) => [point.x, point.y]),
          measurementsFixture.map((measurement) => {
            const yAxisKey = metricsFixturewithMultipleSeries[index].key;
            const yAxisVal = measurement[yAxisKey];
            return [epoch(measurement.measurementDate, true), yAxisVal];
          })
        );
      });

      test(`it sets the reference to the measurement of each point for ${metric} series`, () => {
        expectSetsAreEqual(
          data.map((point) => point.measurement.key),
          measurementsFixture.map((x) => metric)
        );
      });

      test(`should render the tooltip of point for ${metric} series`, async () => {
        const [actual] = await renderedTooltipConfig(
          <MeasurementTrendLineChart {...pullRequestMeasurement} view={"primary"} />,
          (points) => [points[0]],
          index
        );

        const firstMeasurementPoint = measurementsFixture.sort(
          (m1, m2) => epoch(m1.measurementDate, true) - epoch(m2.measurementDate, true)
        )[0];
        expect(actual).toMatchObject({
          header: expect.stringMatching(`${measurementFixture.measurementWindow}`),
          body: [[displayName, `${formatNumber(firstMeasurementPoint[metric])} Days`]],
        });
      });
    });
  });
});
