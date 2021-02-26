import {screen, waitFor} from "@testing-library/react";
import {GraphQLError} from "graphql/error";
import React from "react";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {BACKLOG_TRENDS_QUERY} from "../../hooks/useQueryProjectBacklogTrends";
import {DefectBacklogTrendsWidget} from "./defectBacklogTrendsWidget";

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  view: "primary",
  days: 45,
  measurementWindow: 30,
  samplingFrequency: 7,
};

const gqlRequest = {
  query: BACKLOG_TRENDS_QUERY,
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
          backlogTrends: [
            {
              measurementDate: getNDaysAgo(40),
              measurementWindow: 30,
              backlogSize: 21,
              minBacklogSize: 21,
              maxBacklogSize: 25,
              q1BacklogSize: 22,
              q3BacklogSize: 24,
              medianBacklogSize: 23,
              avgBacklogSize: 23,
            },
            {
              measurementDate: getNDaysAgo(32),
              measurementWindow: 30,
              backlogSize: 15,
              minBacklogSize: 15,
              maxBacklogSize: 24,
              q1BacklogSize: 21,
              q3BacklogSize: 23,
              medianBacklogSize: 22,
              avgBacklogSize: 21,
            },
            {
              measurementDate: getNDaysAgo(25),
              measurementWindow: 30,
              backlogSize: 15,
              minBacklogSize: 15,
              maxBacklogSize: 23,
              q1BacklogSize: 15,
              q3BacklogSize: 22,
              medianBacklogSize: 21,
              avgBacklogSize: 19,
            },
          ],
        },
      },
    },
  },
];

describe("DefectBacklogTrendsWidget", () => {
  test("renders without an error", () => {
    renderWithProviders(<DefectBacklogTrendsWidget {...propsFixture} />, mocksFixture);
  });

  test("shows a loading spinner", async () => {
    renderWithProviders(<DefectBacklogTrendsWidget {...propsFixture} />, mocksFixture);
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
      renderWithProviders(<DefectBacklogTrendsWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(<DefectBacklogTrendsWidget {...propsFixture} />, mockGraphQlErrors);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });
  });

  describe("when there is series data", () => {
    test("should render correct chart title", async () => {
      renderWithProviders(<DefectBacklogTrendsWidget {...propsFixture} />, mocksFixture);
      expect(await screen.findByText(/Defect Backlog/i)).toBeInTheDocument();
    });

    test("makes sure chart is rendered from widget, with correct legend title", async () => {
      renderWithProviders(<DefectBacklogTrendsWidget {...propsFixture} />, mocksFixture, {
        chartTestId: "backlog-trends-chart",
      });

      // assert the chart existence (this also ensures chart is rendered)
      await screen.findByTestId("backlog-trends-chart");

      expect(await screen.findByText(/Backlog Size/i)).toBeInTheDocument();
    });
  });
});
