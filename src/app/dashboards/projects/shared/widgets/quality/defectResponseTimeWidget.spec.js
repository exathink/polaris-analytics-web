import {screen, waitFor} from "@testing-library/react";
import {GraphQLError} from "graphql/error";
import React from "react";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {getFlowMetricsTrendsQuery} from "../../hooks/useQueryDimensionFlowMetricsTrends";
import {DefectResponseTimeWidget} from "./defectResponseTimeWidget";

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  view: "primary",
  days: 45,
  measurementWindow: 30,
  samplingFrequency: 7,
  leadTimeConfidenceTarget: 0.8,
  cycleTimeConfidenceTarget: 0.9,
};

const gqlRequest = {
  query: getFlowMetricsTrendsQuery,
  variables: {
    key: propsFixture.instanceKey,
    days: propsFixture.days,
    measurementWindow: propsFixture.measurementWindow,
    samplingFrequency: propsFixture.samplingFrequency,
    leadTimeTargetPercentile: propsFixture.leadTimeConfidenceTarget,
    cycleTimeTargetPercentile: propsFixture.cycleTimeConfidenceTarget,
    specsOnly: true,
    defectsOnly: true,
  },
};

const mocksFixture = [
  {
    request: gqlRequest,
    result: {
      data: {
        project: {
          cycleMetricsTrends: [
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
        },
      },
    },
  },
];

describe("DefectResponseTimeWidget", () => {
  test("renders without an error", () => {
    renderWithProviders(<DefectResponseTimeWidget {...propsFixture} />, mocksFixture);
  });

  test("shows a loading spinner", async () => {
    renderWithProviders(<DefectResponseTimeWidget {...propsFixture} />, mocksFixture);
    expect(await screen.findByTestId("loading-spinner")).toBeInTheDocument();
  });

  describe("when there are errors", () => {
    let logGraphQlError;
    beforeEach(() => {
      logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError").mockImplementation(() => {});
    });
    afterEach(() => {
      logGraphQlError.mockRestore();
    });

    const mockNetworkError = [
      {
        request: gqlRequest,
        error: new Error("A network error Occurred"),
      },
    ];

    const mockGraphQlErrors = [
      {
        request: gqlRequest,
        result: {
          errors: [new GraphQLError("A GraphQL Error Occurred")],
        },
      },
    ];

    test("it renders nothing and logs the error when there is a network error", async () => {
      renderWithProviders(<DefectResponseTimeWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(<DefectResponseTimeWidget {...propsFixture} />, mockGraphQlErrors);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });
  });

  describe("when there is series data", () => {
    test("should render correct chart title", async () => {
      renderWithProviders(<DefectResponseTimeWidget {...propsFixture} />, mocksFixture);
      expect(await screen.findByText(/Defect Response Time/i)).toBeInTheDocument();
    });

    test("makes sure chart is rendered from widget, with correct legend title", async () => {
      renderWithProviders(<DefectResponseTimeWidget {...propsFixture} />, mocksFixture, {
        chartTestId: "defect-response-chart",
      });

      // assert the chart existence (this also ensures chart is rendered)
      await screen.findByTestId("defect-response-chart");

      expect(await screen.findByText(/Specs/i)).toBeInTheDocument();
    });
  });
});
