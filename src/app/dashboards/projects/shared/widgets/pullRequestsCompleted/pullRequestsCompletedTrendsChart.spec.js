import React from "react";
import {renderedChartConfig, renderedTooltipConfig} from "../../../../../framework/viz/charts/chart-test-utils";

import {expectSetsAreEqual, formatNumber} from "../../../../../../test/test-utils";

import {PullRequestsCompletedTrendsChart} from "./pullRequestsCompletedTrendsChart";
import {Colors} from "../../../../shared/config";
import {epoch} from "../../../../../helpers/utility";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const pullRequestsCompletedTrendsFixture = [
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
    text: "Requests Completed",
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
      text: "Review Requests",
    },
  },
  time: {
    useUTC: false,
  },
};

const fixedSeriesConfig = {};

describe("PullRequestsCompletedTrendsChart", () => {
  describe("when there are no points", () => {
    const emptyPullRequestsCompleted = {
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
      ],
    };

    test("it renders an empty chart config in primary view", () => {
      expect(
        renderedChartConfig(<PullRequestsCompletedTrendsChart {...emptyPullRequestsCompleted} view="primary" />)
      ).toMatchObject(expectedChartConfig);
    });

    test("it renders an empty chart config  in detail view", () => {
      expect(
        renderedChartConfig(<PullRequestsCompletedTrendsChart {...emptyPullRequestsCompleted} view={"detail"} />)
      ).toMatchObject(expectedChartConfig);
    });
  });

  describe("pull requests completed trends chart", () => {
    const pullRequestsCompleted = {
      ...commonMeasurementProps,
      pullRequestMetricsTrends: pullRequestsCompletedTrendsFixture,
    };

    const {
      series: [{data}],
    } = renderedChartConfig(<PullRequestsCompletedTrendsChart {...pullRequestsCompleted} view={"primary"} />);

    test("it renders a chart with the correct number of data points ", () => {
      expect(data).toHaveLength(pullRequestsCompletedTrendsFixture.length);
    });

    test("it maps dates to the x axis and sets y to completed pull requests", () => {
      expectSetsAreEqual(
        data.map((point) => [point.x, point.y]),
        pullRequestsCompletedTrendsFixture.map((measurement) => {
          return [epoch(measurement.measurementDate, true), measurement.totalClosed];
        })
      );
    });

    test("it sets the reference to the measurement for each point ", () => {
      expectSetsAreEqual(
        data.map((point) => point.measurement),
        pullRequestsCompletedTrendsFixture
      );
    });

    test("should render the tooltip for point", async () => {
      const [actual] = await renderedTooltipConfig(
        <PullRequestsCompletedTrendsChart {...pullRequestsCompleted} view={"primary"} />,
        (points) => [points[0]]
      );

      const firstCompletedPRPoint = pullRequestsCompletedTrendsFixture.sort(
        (m1, m2) => epoch(m1.measurementDate, true) - epoch(m2.measurementDate, true)
      )[0];
      expect(actual).toMatchObject({
        header: expect.stringMatching(`${commonMeasurementProps.measurementWindow}`),
        body: [
          ["Requests Completed: ", `${formatNumber(firstCompletedPRPoint.totalClosed)}`],
          ["Avg Age: ", `${formatNumber(firstCompletedPRPoint.avgAge)} Days`],
          ["Max Age: ", `${formatNumber(firstCompletedPRPoint.maxAge)} Days`],
        ],
      });
    });
  });
});
