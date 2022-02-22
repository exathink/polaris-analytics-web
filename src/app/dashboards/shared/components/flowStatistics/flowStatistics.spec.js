import {render, screen, within} from "@testing-library/react";
import {AvgCycleTime, AvgDuration, AvgEffort, AvgLatency, AvgLeadTime, EffortOUT, Volume} from "./flowStatistics";

const cycleMetricsTrends = [
  {
    __typename: "AggregateCycleMetricsImpl",
    measurementDate: "2022-02-22",
    measurementWindow: 30,
    avgLeadTime: 8.786741898148149,
    minCycleTime: 0.05439814814814815,
    q1CycleTime: 0.34609953703703705,
    medianCycleTime: 0.8606134259259259,
    q3CycleTime: 3.3922800925925927,
    percentileCycleTime: 5.209108796296296,
    maxCycleTime: 15.379155092592592,
    avgCycleTime: 3.057752314814815,
    percentileLeadTime: 10.95736111111111,
    maxLeadTime: 24.58478009259259,
    totalEffort: 9.16666666666667,
    percentileEffort: 2,
    avgEffort: 0.916666666666667,
    maxEffort: 2.16666666666667,
    avgDuration: 1.61421064814815,
    maxDuration: 9.1990162037037,
    percentileDuration: 3.25040509259259,
    avgLatency: 0.9143016975308642,
    maxLatency: 2.9307523148148147,
    percentileLatency: 2.9307523148148147,
    workItemsWithNullCycleTime: 0,
    cadence: 5,
    workItemsInScope: 10,
    workItemsWithCommits: 10,
    earliestClosedDate: "2022-01-25T22:08:36.980000",
    latestClosedDate: "2022-02-11T00:53:54.619000",
    targetPercentile: null,
  },
  {
    __typename: "AggregateCycleMetricsImpl",
    measurementDate: "2022-01-23",
    measurementWindow: 30,
    avgLeadTime: 14.021097608024691,
    minCycleTime: 0.03163194444444444,
    q1CycleTime: 0.2088773148148148,
    medianCycleTime: 0.9319907407407407,
    q3CycleTime: 2.0102083333333334,
    percentileCycleTime: 13.519884259259259,
    maxCycleTime: 166.10803240740742,
    avgCycleTime: 11.025003215020575,
    percentileLeadTime: 8.128900462962964,
    maxLeadTime: 166.10952546296295,
    totalEffort: 11.4166666666667,
    percentileEffort: 1,
    avgEffort: 0.634259259259259,
    maxEffort: 1.33333333333333,
    avgDuration: 0.452519933127572,
    maxDuration: 5.969375,
    percentileDuration: 0.958958333333333,
    avgLatency: 10.113334619341563,
    maxLatency: 160.1386574074074,
    percentileLatency: 5.960289351851852,
    workItemsWithNullCycleTime: 0,
    cadence: 12,
    workItemsInScope: 18,
    workItemsWithCommits: 18,
    earliestClosedDate: "2022-01-02T16:48:22.651000",
    latestClosedDate: "2022-01-23T23:39:00.282000",
    targetPercentile: null,
  },
];

const propsFixture = {
  currentMeasurement: cycleMetricsTrends[0],
  previousMeasurement: cycleMetricsTrends[1],
};

describe("Metrics", () => {
  describe("Response Time Metrics", () => {
    test("Avg LeadTime", () => {
      render(<AvgLeadTime displayType="cellrender" {...propsFixture} />);
      const {getByText: getByTextValue} = within(screen.getByTestId("metricValue"));
      const {getByText: getByTextUOM} = within(screen.getByTestId("uom"));

      expect(getByTextValue("8.79")).toBeInTheDocument();
      expect(getByTextUOM("days")).toBeInTheDocument();
    });

    test("Avg CycleTime", () => {
      render(<AvgCycleTime displayType="cellrender" {...propsFixture} />);
      const {getByText: getByTextValue} = within(screen.getByTestId("metricValue"));
      const {getByText: getByTextUOM} = within(screen.getByTestId("uom"));

      expect(getByTextValue("3.06")).toBeInTheDocument();
      expect(getByTextUOM("days")).toBeInTheDocument();
    });

    test("Coding", () => {
      render(<AvgDuration displayType="cellrender" {...propsFixture} />);
      const {getByText: getByTextValue} = within(screen.getByTestId("metricValue"));
      const {getByText: getByTextUOM} = within(screen.getByTestId("uom"));

      expect(getByTextValue("1.61")).toBeInTheDocument();
      expect(getByTextUOM("days")).toBeInTheDocument();
    });

    test("Delivery", () => {
      render(<AvgLatency displayType="cellrender" {...propsFixture} />);
      const {getByText: getByTextValue} = within(screen.getByTestId("metricValue"));
      const {getByText: getByTextUOM} = within(screen.getByTestId("uom"));

      expect(getByTextValue("0.91")).toBeInTheDocument();
      expect(getByTextUOM("days")).toBeInTheDocument();
    });

    test("Avg Effort", () => {
      render(<AvgEffort displayType="cellrender" {...propsFixture} />);
      const {getByText: getByTextValue} = within(screen.getByTestId("metricValue"));
      const {getByText: getByTextUOM} = within(screen.getByTestId("uom"));

      expect(getByTextValue("0.92")).toBeInTheDocument();
      expect(getByTextUOM("dev-days")).toBeInTheDocument();
    });
  });

  describe("Throughput Metrics", () => {
    test("Volume PC", () => {
      render(
        <Volume displayType="cellrender" {...propsFixture} specsOnly={true} normalized={true} contributorCount={2} />
      );
      const {getByText: getByTextValue} = within(screen.getByTestId("metricValue"));
      const {getByText: getByTextUOM} = within(screen.getByTestId("uom"));

      expect(getByTextValue("5")).toBeInTheDocument();
      expect(getByTextUOM("specs")).toBeInTheDocument();
    });

    test("EffortOUT PC", () => {
      render(<EffortOUT displayType="cellrender" {...propsFixture} contributorCount={2} normalized={true} />);
      const {getByText: getByTextValue} = within(screen.getByTestId("metricValue"));
      const {getByText: getByTextUOM} = within(screen.getByTestId("uom"));

      expect(getByTextValue("4.58")).toBeInTheDocument();
      expect(getByTextUOM("dev-days")).toBeInTheDocument();
    });
  });
});
