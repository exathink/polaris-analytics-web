import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../../framework/viz/charts/chart-test-utils";
import {expectSetsAreEqual, getNDaysAgo} from "../../../../../../test/test-utils";
import {AppTerms, Colors} from "../../../../shared/config";
import {DefectArrivalCloseRateChart} from "./defectArrivalCloseRateChart";
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
  flowRateTrends: [
    {
      measurementDate: getNDaysAgo(1),
      measurementWindow: 30,
      arrivalRate: 7,
      closeRate: 5,
    },
    {
      measurementDate: getNDaysAgo(7),
      measurementWindow: 30,
      arrivalRate: 9,
      closeRate: 5,
    },
    {
      measurementDate: getNDaysAgo(15),
      measurementWindow: 30,
      arrivalRate: 10,
      closeRate: 11,
    },
  ],
  view: "primary",
  ...commonMeasurementProps,
};

const commonChartProps = {
  type: "column",
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
    text: "Defect Volume",
  },
  subtitle: {
    text: `${commonMeasurementProps.measurementPeriod} day trend`,
  },
  legend: {
    title: {
      text: AppTerms.specs.display,
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
    allowDecimals: false,
    title: {
      text: "Defects",
    },
    // min: -11,
    // max: 10,
  },
  legend: {
    title: {
      text: ``,
      style: {
        fontStyle: "italic",
      },
    },
    align: "right",
    layout: "vertical",
    verticalAlign: "middle",
    itemMarginBottom: 3,
  },
  tooltip: {
    useHTML: true,
    hideDelay: 0,
  },
};

describe("DefectArrivalCloseRateChart", () => {
  describe("when there is no series data", () => {
    const emptyPropsFixture = {
      ...propsFixture,
      flowRateTrends: [],
    };

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [{}, {}],
    };

    test("it renders an empty chart config", () => {
      expect(renderedChartConfig(<DefectArrivalCloseRateChart {...emptyPropsFixture} />)).toMatchObject(
        expectedChartConfig
      );
    });
  });

  describe("when there is data for all trend series", () => {
    const {series} = renderedChartConfig(<DefectArrivalCloseRateChart {...propsFixture} />);

    test("renders two series", () => {
      expect(series).toHaveLength(2);
    });

    test("renders correct chart config", () => {
      const expectedChartConfig = {
        ...fixedChartConfig,
        series: [
          {key: "arrivalRate", name: "Arrival Rate", stacking: "normal", color: Colors.DefectRate.arrival},
          {key: "closeRate", name: "Close Rate", stacking: "normal", color: Colors.DefectRate.close},
        ],
      };
      expect(renderedChartConfig(<DefectArrivalCloseRateChart {...propsFixture} />)).toMatchObject(expectedChartConfig);
    });

    const {flowRateTrends} = propsFixture;

    describe(`Arrival Rate series`, () => {
      const arrivalRateSeries = series[0];

      test(`renders a chart with the correct number of data points`, () => {
        expect(arrivalRateSeries.data).toHaveLength(flowRateTrends.length);
      });

      test("it maps dates to the x axis and sets y to a measurement value", () => {
        expectSetsAreEqual(
          arrivalRateSeries.data.map((point) => [point.x, point.y]),
          flowRateTrends.map((measurement) => {
            return [epoch(measurement.measurementDate, true), measurement["arrivalRate"]];
          })
        );
      });

      test("it sets the reference to the measurement for each point", () => {
        expectSetsAreEqual(
          arrivalRateSeries.data.map((point) => point.measurement.key),
          flowRateTrends.map((measurement) => measurement.key)
        );
      });

      test("should render the tooltip for point", async () => {
        const [actual] = await renderedTooltipConfig(
          <DefectArrivalCloseRateChart {...propsFixture} />,
          (points) => [points[0]],
          0
        );

        const [testPoint] = flowRateTrends.sort(
          (m1, m2) => epoch(m1.measurementDate, true) - epoch(m2.measurementDate, true)
        );
        expect(actual).toMatchObject({
          header: expect.stringContaining(`${commonMeasurementProps.measurementWindow}`),
          body: [[expect.stringContaining("Defects Opened"), `${testPoint.arrivalRate}`]],
        });
      });
    });

    describe(`Close Rate series`, () => {
      const closeRateSeries = series[1];

      test(`renders a chart with the correct number of data points`, () => {
        expect(closeRateSeries.data).toHaveLength(flowRateTrends.length);
      });

      test("it maps dates to the x axis and sets y to a measurement value", () => {
        expectSetsAreEqual(
          closeRateSeries.data.map((point) => [point.x, point.y]),
          flowRateTrends.map((measurement) => {
            return [epoch(measurement.measurementDate, true), -measurement["closeRate"]];
          })
        );
      });

      test("it sets the reference to the measurement for each point ", () => {
        expectSetsAreEqual(
          closeRateSeries.data.map((point) => point.measurement),
          flowRateTrends.map((measurement) => measurement)
        );
      });

      test("should render the tooltip for point", async () => {
        const [actual] = await renderedTooltipConfig(
          <DefectArrivalCloseRateChart {...propsFixture} />,
          (points) => [points[0]],
          1
        );

        const [testPoint] = flowRateTrends.sort(
          (m1, m2) => epoch(m1.measurementDate, true) - epoch(m2.measurementDate, true)
        );
        expect(actual).toMatchObject({
          header: expect.stringContaining(`${commonMeasurementProps.measurementWindow}`),
          body: [[expect.stringContaining("Defects Closed"), `${testPoint.closeRate}`]],
        });
      });
    });
  });
});
