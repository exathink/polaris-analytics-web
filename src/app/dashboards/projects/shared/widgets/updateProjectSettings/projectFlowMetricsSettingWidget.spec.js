import React from "react";
import {screen, waitFor} from "@testing-library/react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {ProjectFlowMetricsSettingWidget} from "./projectFlowMetricsSettingWidget";
import {GraphQLError} from "graphql";
import {PROJECT_CLOSED_DELIVERY_CYCLE_DETAIL} from "../../hooks/useQueryProjectClosedDeliveryCycleDetail";

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {})
});
afterAll(() => {
  console.log.mockRestore();
});

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  latestWorkItemEvent: "2020-12-09T22:31:01.244000", //TODO(need to see if this might cause time relative issue)
  days: 90,
  leadTimeTarget: 30,
  cycleTimeTarget: 7,
  leadTimeConfidenceTarget: 0.9,
  cycleTimeConfidenceTarget: 0.9,
  specsOnly: false,
};

const gqlRequest = {
  query: PROJECT_CLOSED_DELIVERY_CYCLE_DETAIL,
  variables: {
    key: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
    days: 90,
    specsOnly: false,
    referenceString: propsFixture.latestWorkItemEvent,
  },
};

const mocks = [
  {
    request: gqlRequest,
    result: {
      data: {
        project: {
          workItemDeliveryCycles: {
            edges: [
              {
                node: {
                  name: "Funnel closed does not match Flow Metrics Closed",
                  key: "5eb601cc-6a1d-483d-add7-417c321e7109:3588",
                  displayId: "PO-396",
                  workItemKey: "5eb601cc-6a1d-483d-add7-417c321e7109",
                  workItemType: "bug",
                  isBug: true,
                  state: "DEPLOYED-TO-STAGING",
                  startDate: "2020-12-02T00:37:17.095000",
                  endDate: "2020-12-09T22:06:08.221000",
                  leadTime: 7.895034722222222,
                  cycleTime: 7.894618055555555,
                  latency: 0.026180555555555554,
                  effort: 1.16666666666667,
                  duration: 4.00299768518519,
                  authorCount: 1,
                },
              },
              {
                node: {
                  name: "Capacity trends widget does not filter out robots. ",
                  key: "f6e67348-c174-44a3-b4a4-058b9a967f9b:3603",
                  displayId: "PO-402",
                  workItemKey: "f6e67348-c174-44a3-b4a4-058b9a967f9b",
                  workItemType: "bug",
                  isBug: true,
                  state: "DEPLOYED-TO-STAGING",
                  startDate: "2020-12-06T17:06:11.068000",
                  endDate: "2020-12-06T18:44:16.755000",
                  leadTime: 0.06811342592592592,
                  cycleTime: null,
                  latency: 0.052569444444444446,
                  effort: 0.333333333333333,
                  duration: 0,
                  authorCount: 1,
                },
              },
              {
                node: {
                  name: "Backfill Tests: EpicNodeRef and ImplementationCost interfaces for WorkItemDeliveryCycle Nodes",
                  key: "a18e5df6-70d0-4e5c-b02d-b5b09aafcf05:3534",
                  displayId: "PO-360",
                  workItemKey: "a18e5df6-70d0-4e5c-b02d-b5b09aafcf05",
                  workItemType: "task",
                  isBug: false,
                  state: "ROADMAP",
                  startDate: "2020-11-03T14:42:25.847000",
                  endDate: "2020-12-05T14:28:16.634000",
                  leadTime: 31.990162037037038,
                  cycleTime: 31.989745370370372,
                  latency: 0,
                  effort: null,
                  duration: null,
                  authorCount: null,
                },
              },
            ],
          },
        },
      },
    },
  },
];

describe("ProjectFlowMetricsSettingWidget", () => {
  describe("should render the widget without any error", () => {
    test("renders without any error", async () => {
      renderWithProviders(<ProjectFlowMetricsSettingWidget {...propsFixture} />, mocks);
      expect(await screen.findByTestId("flowmetrics-setting-view")).toBeInTheDocument();
    });

    test("it shows loading spinner", () => {
      renderWithProviders(<ProjectFlowMetricsSettingWidget {...propsFixture} />, mocks);
      expect(screen.queryByTestId("loading-spinner")).toBeInTheDocument();
    });
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
      renderWithProviders(<ProjectFlowMetricsSettingWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(await screen.queryByTestId("flowmetrics-setting-view")).not.toBeInTheDocument();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(<ProjectFlowMetricsSettingWidget {...propsFixture} />, mockGraphQlErrors);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(await screen.queryByTestId("flowmetrics-setting-view")).not.toBeInTheDocument();
    });
  });

  describe("when there are no workItems", () => {
    const emptyMocksFixture = [
      {
        request: gqlRequest,
        result: {
          data: {
            project: {
              workItemDeliveryCycles: {
                edges: [],
              },
            },
          },
        },
      },
    ];

    test("it renders both target and confidence sliders", async () => {
      renderWithProviders(<ProjectFlowMetricsSettingWidget {...propsFixture} />, emptyMocksFixture);
      await screen.findByTestId("target-range-slider");
      await screen.findByTestId("confidence-range-slider");
    });

    test("renders appropriate message on the chart title when there are no workItems", async () => {
      renderWithProviders(<ProjectFlowMetricsSettingWidget {...propsFixture} />, emptyMocksFixture);
      await screen.findByText(/0 work items closed/i);
    });
  });

  describe("when there are workItems", () => {
    test("it renders both target and confidence sliders", async () => {
      renderWithProviders(<ProjectFlowMetricsSettingWidget {...propsFixture} />, mocks);
      await screen.findByTestId("target-range-slider");
      await screen.findByTestId("confidence-range-slider");
    });

    // this ensures when widget is rendered its able to render till chart component(tests integration of widget view and chart)
    test("it renders chart", async () => {
      renderWithProviders(<ProjectFlowMetricsSettingWidget {...propsFixture} />, mocks, {
        chartTestId: "project-flowmetrics-chart",
      });
      await screen.findByTestId("project-flowmetrics-chart");
    });
  });
});
