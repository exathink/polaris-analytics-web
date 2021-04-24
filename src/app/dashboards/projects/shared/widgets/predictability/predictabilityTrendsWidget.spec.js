import React from "react";
import {GraphQLError} from "graphql";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {waitFor} from "@testing-library/react";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {ProjectPredictabilityTrendsWidget} from "./predictabilityTrendsWidget";
import {FLOW_METRICS_TRENDS_QUERY} from "../../hooks/useQueryProjectFlowMetricsTrends";
import {getServerDate} from "../../../../../helpers/utility";

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  view: "primary",
  latestWorkItemEvent: getNDaysAgo(21),
  days: 45,
  measurementWindow: 30,
  samplingFrequency: 7,
  targetPercentile: 0.9,
  cycleTimeTarget: 7,
  leadTimeTarget: 14,
  leadTimeConfidenceTarget: 0.8,
  cycleTimeConfidenceTarget: 0.9,
};

const gqlRequest = {
  query: FLOW_METRICS_TRENDS_QUERY,
  variables: {
    key: propsFixture.instanceKey,
    days: propsFixture.days,
    specsOnly: true,
    measurementWindow: propsFixture.measurementWindow,
    samplingFrequency: propsFixture.samplingFrequency,
    targetPercentile: propsFixture.targetPercentile,
    referenceString: propsFixture.latestWorkItemEvent
  },
};

const mocks = [
  {
    request: gqlRequest,
    result: {
      data: {
        project: {
          cycleMetricsTrends: [
            {
              measurementDate: getServerDate(getNDaysAgo(12)),
              avgLeadTime: 12.97279057017544,
              minCycleTime: 3.405196759259259,
              q1CycleTime: 4.403263888888889,
              medianCycleTime: 5.258449074074074,
              q3CycleTime: 15.35707175925926,
              percentileCycleTime: 16.286979166666665,
              maxCycleTime: 16.286979166666665,
              avgCycleTime: 8.863108465608466,
              percentileLeadTime: 26.364618055555557,
              maxLeadTime: 40.05020833333333,
              totalEffort: 18.1666666666667,
              percentileEffort: 2.33333333333333,
              avgEffort: 0.956140350877193,
              maxEffort: 2.83333333333333,
              avgDuration: 1.0260568957115,
              maxDuration: 9.22451388888889,
              percentileDuration: 3.91827546296296,
              avgLatency: 3.370505604288499,
              maxLatency: 10.464282407407408,
              percentileLatency: 10.149212962962963,
              workItemsWithNullCycleTime: 12,
              workItemsInScope: 19,
              workItemsWithCommits: 19,
              earliestClosedDate: getNDaysAgo(29),
              latestClosedDate: getNDaysAgo(22),
              targetPercentile: null,
            },
            {
              measurementDate: getServerDate(getNDaysAgo(19)),
              avgLeadTime: 13.94028838734568,
              minCycleTime: 3.405196759259259,
              q1CycleTime: 4.5105208333333335,
              medianCycleTime: 8.450486111111111,
              q3CycleTime: 12.820277777777777,
              percentileCycleTime: 15.35707175925926,
              maxCycleTime: 16.286979166666665,
              avgCycleTime: 8.958380787037036,
              percentileLeadTime: 26.364618055555557,
              maxLeadTime: 40.05020833333333,
              totalEffort: 23.3333333333333,
              percentileEffort: 2.33333333333333,
              avgEffort: 0.972222222222222,
              maxEffort: 2.83333333333333,
              avgDuration: 0.903971354166667,
              maxDuration: 9.22451388888889,
              percentileDuration: 2.33913194444444,
              avgLatency: 3.9867997685185186,
              maxLatency: 10.618506944444444,
              percentileLatency: 10.149212962962963,
              workItemsWithNullCycleTime: 14,
              workItemsInScope: 24,
              workItemsWithCommits: 24,
              earliestClosedDate: getNDaysAgo(34),
              latestClosedDate: getNDaysAgo(29),
              targetPercentile: null,
            },
          ],
        },
      },
    },
  },
];

describe("ProjectPredictabilityTrendsWidget", () => {
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

    test("it logs the error when there is a network error", async () => {
      await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());

      renderWithProviders(<ProjectPredictabilityTrendsWidget {...propsFixture} />, mockNetworkError);

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });

    test("it logs the error when there is a GraphQl error", async () => {
      await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());

      renderWithProviders(<ProjectPredictabilityTrendsWidget {...propsFixture} />, mockGraphQlErrors);

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });
  });

  describe("when there are no errors", () => {
    test("renders widget without any error", () => {
      renderWithProviders(<ProjectPredictabilityTrendsWidget {...propsFixture} />, mocks);
    });
  });
});
