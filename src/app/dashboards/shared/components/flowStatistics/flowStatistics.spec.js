import {screen, within} from "@testing-library/react";
import {AvgCycleTime, AvgDuration, AvgEffort, AvgLatency, AvgLeadTime, EffortOUT, Volume} from "./flowStatistics";
import {renderWithProviders} from "../../../../framework/viz/charts/chart-test-utils";
import { AppTerms } from "../../config";

export function renderAndAssertMetricComponent(Component, metricVal, uom) {
  renderWithProviders(Component);
  const {getByText: getByTextValue} = within(screen.getByTestId("metricValue"));
  const {getByText: getByTextUOM} = within(screen.getByTestId("uom"));

  expect(getByTextValue(metricVal)).toBeInTheDocument();
  expect(getByTextUOM(uom)).toBeInTheDocument();
}

const cycleMetricsTrends = [
  {
    measurementWindow: 30,
    avgLeadTime: 8.786741898148149,
    avgCycleTime: 3.057752314814815,
    totalEffort: 9.16666666666667,
    avgEffort: 0.916666666666667,
    avgDuration: 1.61421064814815,
    avgLatency: 0.9143016975308642,
    cadence: 5,
    workItemsInScope: 10,
    workItemsWithCommits: 10,
  },
  {
    measurementWindow: 30,
    avgLeadTime: 14.021097608024691,
    avgCycleTime: 11.025003215020575,
    totalEffort: 11.4166666666667,
    avgEffort: 0.634259259259259,
    avgDuration: 0.452519933127572,
    avgLatency: 10.113334619341563,
    cadence: 12,
    workItemsInScope: 18,
    workItemsWithCommits: 18,
  },
];

const propsFixture = {
  currentMeasurement: cycleMetricsTrends[0],
  previousMeasurement: cycleMetricsTrends[1],
};

describe("Metrics", () => {
  describe("Response Time Metrics", () => {
    describe("when there is no data", () => {
      const emptyPropsFixture = {
        currentMeasurement: {},
        previousMeasurement: {},
      };

      describe("cellrender", () => {
        test("Avg LeadTime", () => {
          renderAndAssertMetricComponent(<AvgLeadTime displayType="cellrender" {...emptyPropsFixture} />, "N/A", "");
        });
        test("Avg CycleTime", () => {
          renderAndAssertMetricComponent(<AvgCycleTime displayType="cellrender" {...emptyPropsFixture} />, "N/A", "");
        });
        test("Coding", () => {
          renderAndAssertMetricComponent(<AvgDuration displayType="cellrender" {...emptyPropsFixture} />, "N/A", "");
        });

        test("Delivery", () => {
          renderAndAssertMetricComponent(<AvgLatency displayType="cellrender" {...emptyPropsFixture} />, "N/A", "");
        });

        test("Avg Effort", () => {
          renderAndAssertMetricComponent(<AvgEffort displayType="cellrender" {...emptyPropsFixture} />, "N/A", "");
        });
      });

      describe("statistic", () => {
        test("Avg LeadTime", () => {
          renderAndAssertMetricComponent(<AvgLeadTime displayType="statistic" {...emptyPropsFixture} />, "N/A", "");
          const {getByText: getByTextTitle} = within(screen.getByTestId("metricTitle"));
          expect(getByTextTitle("Lead Time")).toBeInTheDocument();
        });
        test("Avg CycleTime", () => {
          renderAndAssertMetricComponent(<AvgCycleTime displayType="statistic" {...emptyPropsFixture} />, "N/A", "");
          const {getByText: getByTextTitle} = within(screen.getByTestId("metricTitle"));
          expect(getByTextTitle("Cycle Time")).toBeInTheDocument();
        });
        test("Coding", () => {
          renderAndAssertMetricComponent(<AvgDuration displayType="statistic" {...emptyPropsFixture} />, "N/A", "");
          const {getByText: getByTextTitle} = within(screen.getByTestId("metricTitle"));
          expect(getByTextTitle("Coding")).toBeInTheDocument();
        });

        test("Delivery", () => {
          renderAndAssertMetricComponent(<AvgLatency displayType="statistic" {...emptyPropsFixture} />, "N/A", "");
          const {getByText: getByTextTitle} = within(screen.getByTestId("metricTitle"));
          expect(getByTextTitle("Shipping")).toBeInTheDocument();
        });

        test("Avg Effort", () => {
          renderAndAssertMetricComponent(<AvgEffort displayType="statistic" {...emptyPropsFixture} />, "N/A", "");
          const {getByText: getByTextTitle} = within(screen.getByTestId("metricTitle"));
          expect(getByTextTitle("Effort")).toBeInTheDocument();
        });
      });
    });

    describe("when there is data", () => {
      describe("cellrender", () => {
        test("Avg LeadTime", () => {
          renderAndAssertMetricComponent(<AvgLeadTime displayType="cellrender" {...propsFixture} />, 8.79, "Days");
        });

        test("Avg CycleTime", () => {
          renderAndAssertMetricComponent(<AvgCycleTime displayType="cellrender" {...propsFixture} />, 3.06, "Days");
        });

        test("Coding", () => {
          renderAndAssertMetricComponent(<AvgDuration displayType="cellrender" {...propsFixture} />, 1.61, "Days");
        });

        test("Delivery", () => {
          renderAndAssertMetricComponent(<AvgLatency displayType="cellrender" {...propsFixture} />, 0.91, "Days");
        });

        test("Avg Effort", () => {
          renderAndAssertMetricComponent(<AvgEffort displayType="cellrender" {...propsFixture} />, 0.92, "FTE Days");
        });
      });

      describe("card", () => {
        test("Avg LeadTime", () => {
          renderAndAssertMetricComponent(<AvgLeadTime displayType="card" {...propsFixture} />, 8.79, "Days");
        });

        test("Avg CycleTime", () => {
          renderAndAssertMetricComponent(<AvgCycleTime displayType="card" {...propsFixture} />, 3.06, "Days");
        });

        test("Coding", () => {
          renderAndAssertMetricComponent(<AvgDuration displayType="card" {...propsFixture} />, 1.61, "Days");
        });

        test("Delivery", () => {
          renderAndAssertMetricComponent(<AvgLatency displayType="card" {...propsFixture} />, 0.91, "Days");
        });

        test("Avg Effort", () => {
          renderAndAssertMetricComponent(<AvgEffort displayType="card" {...propsFixture} />, 0.92, "FTE Days");
        });
      });
    });
  });

  describe("Throughput Metrics", () => {
    describe("when there is no data", () => {
      const emptyPropsFixture = {
        currentMeasurement: {},
        previousMeasurement: {},
      };

      describe("cellrender", () => {
        test("Volume PC", () => {
          renderAndAssertMetricComponent(
            <Volume
              displayType="cellrender"
              {...emptyPropsFixture}
              specsOnly={true}
              normalized={true}
              contributorCount={2}
            />,
            "N/A",
            ""
          );
        });

        test("EffortOUT PC", () => {
          renderAndAssertMetricComponent(
            <EffortOUT displayType="cellrender" {...emptyPropsFixture} contributorCount={2} normalized={true} />,
            "N/A",
            ""
          );
        });
      });

      describe("statistic", () => {
        test("Volume PC", () => {
          renderAndAssertMetricComponent(
            <Volume
              displayType="statistic"
              {...emptyPropsFixture}
              specsOnly={true}
              normalized={true}
              contributorCount={2}
            />,
            "N/A",
            ""
          );
          const {getByText: getByTextTitle} = within(screen.getByTestId("metricTitle"));
          expect(getByTextTitle("Volume")).toBeInTheDocument();
          expect(getByTextTitle("pc")).toBeInTheDocument();
        });

        test("EffortOUT PC", () => {
          renderAndAssertMetricComponent(
            <EffortOUT displayType="statistic" {...emptyPropsFixture} contributorCount={2} normalized={true} />,
            "N/A",
            ""
          );
          const {getByText: getByTextTitle} = within(screen.getByTestId("metricTitle"));
          expect(getByTextTitle("Total Effort")).toBeInTheDocument();

          expect(getByTextTitle("pc")).toBeInTheDocument();
        });
      });
    });

    describe("when there is data", () => {
      describe("cellrender", () => {
        test("Volume PC", () => {
          renderAndAssertMetricComponent(
            <Volume
              displayType="cellrender"
              {...propsFixture}
              specsOnly={true}
              normalized={true}
              contributorCount={2}
            />,
            "5.00",
            AppTerms.specs.display
          );
        });

        test("EffortOUT PC", () => {
          renderAndAssertMetricComponent(
            <EffortOUT displayType="cellrender" {...propsFixture} contributorCount={2} normalized={true} />,
            4.58,
            "FTE Days"
          );
        });
      });

      describe("card", () => {
        test("Volume PC", () => {
          renderAndAssertMetricComponent(
            <Volume displayType="card" {...propsFixture} specsOnly={true} normalized={true} contributorCount={2} />,
            "5.00",
            AppTerms.specs.display
          );
        });

        test("EffortOUT PC", () => {
          renderAndAssertMetricComponent(
            <EffortOUT displayType="card" {...propsFixture} contributorCount={2} normalized={true} />,
            4.58,
            "FTE Days"
          );
        });
      });
    });
  });
});
