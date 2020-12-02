import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../framework/viz/charts/chart-test-utils";

import {expectSetsAreEqual, formatNumber} from "../../../../../test/test-utils";

import {MeasurementTrendLineChart} from "./measurementTrendLineChart";
import {Colors} from "../../../shared/config";
import {toMoment, i18nNumber, i18nDate} from "../../../../helpers/utility";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const measurementFixture = {
  measurementPeriod: 45,
  measurementWindow: 30,
};

const metricsFixture = [{key: "totalClosed", displayName: "Total Closed", visible: true, type: "spline"}];
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

describe("MeasureMentTrendLineChart", () => {
  describe("when there are no points and no config", () => {
    const emptyMeasurement = {
      ...measurementFixture,
      measurements: [],
      metrics: [...metricsFixture],
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
        metrics: [...metricsFixture],
        config: {
          title: "Code Reviews Completed",
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
        metrics: [...metricsFixture],
        config: {
          xAxisUom: "datetime",
          yAxisUom: "Code Reviews",
          legendText: "Specs",
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

  describe("pull request trends chart", () => {
    const pullRequestMeasurementsFixture = [
      {
        measurementDate: "2020-12-01",
        measurementWindow: 30,
        avgAge: 1.31095732285237,
        maxAge: 6.04251819444444,
        totalClosed: 36,
      },
      {
        measurementDate: "2020-11-24",
        measurementWindow: 30,
        avgAge: 0.893518078421409,
        maxAge: 5.36438644675926,
        totalClosed: 41,
      },
      {
        measurementDate: "2020-11-17",
        measurementWindow: 30,
        avgAge: 1.1846755006529,
        maxAge: 13.126145775463,
        totalClosed: 39,
      },
      {
        measurementDate: "2020-11-10",
        measurementWindow: 30,
        avgAge: 0.72456336961962,
        maxAge: 13.126145775463,
        totalClosed: 37,
      },
      {
        measurementDate: "2020-11-03",
        measurementWindow: 30,
        avgAge: 0.705498012000488,
        maxAge: 13.126145775463,
        totalClosed: 38,
      },
      {
        measurementDate: "2020-10-27",
        measurementWindow: 30,
        avgAge: 0.797267541473766,
        maxAge: 13.126145775463,
        totalClosed: 36,
      },
      {
        measurementDate: "2020-10-20",
        measurementWindow: 30,
        avgAge: 1.07294166335979,
        maxAge: 10.1607696759259,
        totalClosed: 35,
      },
    ];
    const pullRequestMetricsFixture = [
      {key: "totalClosed", displayName: "Total Closed", visible: true, type: "spline"},
    ];
    const pullRequestConfig = {
      title: "Code Reviews Completed",
      yAxisUom: "Code Reviews",
      plotBands: {
        metric: "totalClosed",
      },
      yAxisNormalization: {
        metric: "totalClosed",
        minScale: 0,
        maxScale: 1.25,
      },
      tooltip: {
        formatter: (measurement, seriesKey, intl) => {
          return {
            header: `${measurementFixture.measurementWindow} days ending ${i18nDate(
              intl,
              measurement.measurementDate
            )}`,
            body: [
              ["Code Reviews Completed: ", `${i18nNumber(intl, measurement.totalClosed)}`],
              ["Avg Age: ", `${intl.formatNumber(measurement.avgAge)} Days`],
              ["Max Age: ", `${intl.formatNumber(measurement.maxAge)} Days`],
            ],
          };
        },
      },
    };
    const pullRequestMeasurement = {
      ...measurementFixture,
      measurements: pullRequestMeasurementsFixture,
      metrics: pullRequestMetricsFixture,
      config: pullRequestConfig,
    };

    const {
      series: [{data}],
    } = renderedChartConfig(<MeasurementTrendLineChart {...pullRequestMeasurement} view={"primary"} />);

    test("it renders a chart with the correct numbers of data points ", () => {
      expect(data).toHaveLength(pullRequestMeasurementsFixture.length);
    });

    test("it maps dates to the x axis and sets y to completed pull requests", () => {
      expectSetsAreEqual(
        data.map((point) => [point.x, point.y]),
        pullRequestMeasurementsFixture.map((measurement) => {
          const totalClosed = measurement[pullRequestMetricsFixture[0].key];
          return [toMoment(measurement.measurementDate, true).valueOf(), totalClosed];
        })
      );
    });

    test("it sets the reference to the measurement for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.measurement),
        pullRequestMeasurementsFixture
      );
    });

    test("should render the tooltip for point", async () => {
      const [actual] = await renderedTooltipConfig(
        <MeasurementTrendLineChart {...pullRequestMeasurement} view={"primary"} />,
        (points) => [points[0]]
      );

      const firstMeasurementPoint = pullRequestMeasurementsFixture.sort(
        (m1, m2) => toMoment(m1.measurementDate, true).valueOf() - toMoment(m2.measurementDate, true).valueOf()
      )[0];
      expect(actual).toMatchObject({
        header: expect.stringMatching(`${measurementFixture.measurementWindow}`),
        body: [
          ["Code Reviews Completed: ", `${formatNumber(firstMeasurementPoint.totalClosed)}`],
          ["Avg Age: ", `${formatNumber(firstMeasurementPoint.avgAge)} Days`],
          ["Max Age: ", `${formatNumber(firstMeasurementPoint.maxAge)} Days`],
        ],
      });
    });
  });
});
