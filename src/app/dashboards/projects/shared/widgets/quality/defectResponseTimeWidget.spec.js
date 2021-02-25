import {screen, waitFor} from "@testing-library/react";
import {GraphQLError} from "graphql/error";
import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {FLOW_METRICS_TRENDS_QUERY} from "../../hooks/useQueryProjectFlowMetricsTrends";
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
  query: FLOW_METRICS_TRENDS_QUERY,
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
              measurementDate: "2021-02-25",
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
              earliestClosedDate: "2021-01-31T15:30:54.457000",
              latestClosedDate: "2021-02-09T18:24:36.648000",
              targetPercentile: null,
            },
            {
              measurementDate: "2021-02-18",
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
              earliestClosedDate: "2021-01-31T15:30:54.457000",
              latestClosedDate: "2021-02-09T18:24:36.648000",
              targetPercentile: null,
            },
            {
              measurementDate: "2021-02-11",
              avgLeadTime: 7.863567386831276,
              minCycleTime: 8.165266203703704,
              q1CycleTime: 8.165266203703704,
              medianCycleTime: 8.165266203703704,
              q3CycleTime: 8.787557870370371,
              percentileCycleTime: 8.787557870370371,
              maxCycleTime: 8.787557870370371,
              avgCycleTime: 8.476412037037036,
              percentileLeadTime: 12.381631944444445,
              maxLeadTime: 15.663148148148148,
              totalEffort: 4.45,
              percentileEffort: 1.5,
              avgEffort: 0.494444444444444,
              maxEffort: 1.5,
              avgDuration: 0.0837564300411523,
              maxDuration: 0.712847222222222,
              percentileDuration: 0.712847222222222,
              avgLatency: 6.2506558641975305,
              maxLatency: 15.045439814814815,
              percentileLatency: 15.045439814814815,
              workItemsWithNullCycleTime: 7,
              workItemsInScope: 9,
              workItemsWithCommits: 9,
              earliestClosedDate: "2021-01-17T00:53:10.050000",
              latestClosedDate: "2021-02-09T18:24:36.648000",
              targetPercentile: null,
            },
            {
              measurementDate: "2021-02-04",
              avgLeadTime: 11.674032738095239,
              minCycleTime: 8.165266203703704,
              q1CycleTime: 8.165266203703704,
              medianCycleTime: 8.165266203703704,
              q3CycleTime: 8.787557870370371,
              percentileCycleTime: 8.787557870370371,
              maxCycleTime: 8.787557870370371,
              avgCycleTime: 8.476412037037036,
              percentileLeadTime: 11.042488425925926,
              maxLeadTime: 42.95509259259259,
              totalEffort: 3.75,
              percentileEffort: 1.5,
              avgEffort: 0.535714285714286,
              maxEffort: 1.5,
              avgDuration: 0.107005621693122,
              maxDuration: 0.712847222222222,
              percentileDuration: 0.712847222222222,
              avgLatency: 3.8400396825396825,
              maxLatency: 8.16568287037037,
              percentileLatency: 8.16568287037037,
              workItemsWithNullCycleTime: 5,
              workItemsInScope: 7,
              workItemsWithCommits: 7,
              earliestClosedDate: "2021-01-11T21:32:14.538000",
              latestClosedDate: "2021-01-31T15:30:54.457000",
              targetPercentile: null,
            },
          ],
        },
      },
    },
  },
];

describe("DefectResponseTimeWidget", () => {
  test("render DefectResponseTimeWidget without an error", () => {
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
