import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../../framework/viz/charts/chart-test-utils";

import {expectSetsAreEqual, formatNumber} from "../../../../../../test/test-utils";

import {PullRequestsReviewTimeTrendsChart} from "./pullRequestsReviewTimeTrendsChart";
import {Colors} from "../../../../shared/config";
import {toMoment} from "../../../../../helpers/utility";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const pullRequestsReviewTimeTrendsFixture = [
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

const commonMeasurementProps = {
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
  title: {
    text: "Code Review Time",
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
    title: {
      text: "Days",
    },
  },
  time: {
    useUTC: false,
  },
};

const fixedSeriesConfig = {};

describe("PullRequestsReviewTimeTrendsChart", () => {
  describe("when there are no points", () => {
    const emptyPullRequestsReviewTime = {
      ...commonMeasurementProps,
      pullRequestMetricsTrends: [],
    };

    const expectedChartConfig = {
      ...fixedChartConfig,
      series: [
        {
          ...fixedSeriesConfig,
          data: [],
        },
        {
          ...fixedSeriesConfig,
          data: [],
        },
      ],
    };

    test("it renders an empty chart config in primary view", () => {
      expect(
        renderedChartConfig(<PullRequestsReviewTimeTrendsChart {...emptyPullRequestsReviewTime} view="primary" />)
      ).toMatchObject(expectedChartConfig);
    });

    test("it renders an empty chart config  in detail view", () => {
      expect(
        renderedChartConfig(<PullRequestsReviewTimeTrendsChart {...emptyPullRequestsReviewTime} view={"detail"} />)
      ).toMatchObject(expectedChartConfig);
    });
  });

  describe("pull requests review time trends chart", () => {
    const pullRequestsReviewTime = {
      ...commonMeasurementProps,
      pullRequestMetricsTrends: pullRequestsReviewTimeTrendsFixture,
    };

    const {
      series: [{data: maxAgeData}, {data: avgAgeData}],
    } = renderedChartConfig(<PullRequestsReviewTimeTrendsChart {...pullRequestsReviewTime} view={"primary"} />);

    const cases = [
      {metric: "maxAge", data: maxAgeData, displayName: "Max Age: "},
      {metric: "avgAge", data: avgAgeData, displayName: "Avg Age: "},
    ];

    // Generating test cases for similar usecases
    cases.forEach(({metric, data, displayName}, index) => {
      test(`it renders a chart with the correct number of data points for ${metric} series`, () => {
        expect(data).toHaveLength(pullRequestsReviewTimeTrendsFixture.length);
      });

      test(`it maps dates to the x axis and sets y to Days for ${metric} series`, () => {
        expectSetsAreEqual(
          data.map((point) => [point.x, point.y]),
          pullRequestsReviewTimeTrendsFixture.map((measurement) => {
            const metricValue = measurement[metric];
            return [toMoment(measurement.measurementDate, true).valueOf(), metricValue];
          })
        );
      });

      test(`it sets the reference to the measurement for each point for ${metric} series`, () => {
        expectSetsAreEqual(
          data.map((point) => point.measurement),
          pullRequestsReviewTimeTrendsFixture
        );
      });

      test(`should render the tooltip of point for ${metric} series`, async () => {
        const [actual] = await renderedTooltipConfig(
          <PullRequestsReviewTimeTrendsChart {...pullRequestsReviewTime} view={"primary"} />,
          (points) => [points[0]],
          index
        );

        const firstReviewTimePoint = pullRequestsReviewTimeTrendsFixture.sort(
          (m1, m2) => toMoment(m1.measurementDate, true).valueOf() - toMoment(m2.measurementDate, true).valueOf()
        )[0];
        expect(actual).toMatchObject({
          header: expect.stringMatching(`${commonMeasurementProps.measurementWindow}`),
          body: [
            [displayName, `${formatNumber(firstReviewTimePoint[metric])} Days`],
            ["Code Reviews Completed: ", `${formatNumber(firstReviewTimePoint.totalClosed)}`],
          ],
        });
      });
    });
  });
});
