import {screen, waitFor} from "@testing-library/react";
import {GraphQLError} from "graphql/error";
import React from "react";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {FLOW_RATE_TRENDS_QUERY} from "../../hooks/useQueryProjectFlowRateTrends";
import {DefectArrivalCloseRateWidget} from "./defectArrivalCloseRateWidget";

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  view: "primary",
  days: 45,
  measurementWindow: 30,
  samplingFrequency: 7,
};

const gqlRequest = {
  query: FLOW_RATE_TRENDS_QUERY,
  variables: {
    key: propsFixture.instanceKey,
    days: propsFixture.days,
    measurementWindow: propsFixture.measurementWindow,
    samplingFrequency: propsFixture.samplingFrequency,
    defectsOnly: true,
  },
};

const mocksFixture = [
  {
    request: gqlRequest,
    result: {
      data: {
        project: {
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
        },
      },
    },
  },
];

describe("DefectArrivalCloseRateWidget", () => {
  test("renders without an error", () => {
    renderWithProviders(<DefectArrivalCloseRateWidget {...propsFixture} />, mocksFixture);
  });

  test("shows a loading spinner", async () => {
    renderWithProviders(<DefectArrivalCloseRateWidget {...propsFixture} />, mocksFixture);
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
      renderWithProviders(<DefectArrivalCloseRateWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(<DefectArrivalCloseRateWidget {...propsFixture} />, mockGraphQlErrors);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });
  });

  describe("when there is series data", () => {
    test("should render correct chart title", async () => {
      renderWithProviders(<DefectArrivalCloseRateWidget {...propsFixture} />, mocksFixture);
      expect(await screen.findByText(/Defect Arrival/i)).toBeInTheDocument();
    });

    test("makes sure chart is rendered from widget, with correct legend titles", async () => {
      renderWithProviders(<DefectArrivalCloseRateWidget {...propsFixture} />, mocksFixture, {
        chartTestId: "arrival-close-rate-chart",
      });

      // assert the chart existence (this also ensures chart is rendered)
      await screen.findByTestId("arrival-close-rate-chart");

      expect(await screen.findByText(/Defect Arrival/i)).toBeInTheDocument();
    });
  });
});
