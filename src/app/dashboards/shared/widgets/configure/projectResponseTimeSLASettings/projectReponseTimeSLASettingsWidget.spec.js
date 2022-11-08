import React from "react";
import {screen, waitFor} from "@testing-library/react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {getNDaysAgo} from "../../../../../../test/test-utils"
import {ProjectResponseTimeSLASettingsWidget} from "./projectResponseTimeSLASettingsWidget";
import {GraphQLError} from "graphql";
import {queryDimensionClosedDeliveryCycleDetail} from "../../../../projects/shared/hooks/useQueryProjectClosedDeliveryCycleDetail";
import { AppTerms } from "../../../config";

beforeAll(() => {
  jest.spyOn(console, "log").mockImplementation(() => {})
});
afterAll(() => {
  console.log.mockRestore();
});

const propsFixture = {
  dimension: 'project',
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  latestWorkItemEvent: getNDaysAgo(35),
  days: 90,
  leadTimeTarget: 30,
  cycleTimeTarget: 7,
  leadTimeConfidenceTarget: 0.9,
  cycleTimeConfidenceTarget: 0.9,
  specsOnly: false,
};

const gqlRequest = {
  query: queryDimensionClosedDeliveryCycleDetail('project'),
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
                  stateType: "closed",
                  epicName: "Internal Quality",
                  startDate: getNDaysAgo(42),
                  endDate: getNDaysAgo(35),
                  teamNodeRefs: [],
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
                  stateType: "closed",
                  epicName: "Internal Quality",
                  startDate: getNDaysAgo(39),
                  endDate: getNDaysAgo(38),
                  teamNodeRefs: [],
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
                  stateType: "closed",
                  epicName: "Internal Quality",
                  startDate: getNDaysAgo(71),
                  endDate: getNDaysAgo(39),
                  teamNodeRefs: [],
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
      renderWithProviders(<ProjectResponseTimeSLASettingsWidget {...propsFixture} />, mocks);
      expect(await screen.findByTestId("flowmetrics-setting-view")).toBeInTheDocument();
    });

    test("it shows loading spinner", () => {
      renderWithProviders(<ProjectResponseTimeSLASettingsWidget {...propsFixture} />, mocks);
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
      renderWithProviders(<ProjectResponseTimeSLASettingsWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(await screen.queryByTestId("flowmetrics-setting-view")).not.toBeInTheDocument();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(<ProjectResponseTimeSLASettingsWidget {...propsFixture} />, mockGraphQlErrors);
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
      renderWithProviders(<ProjectResponseTimeSLASettingsWidget {...propsFixture} />, emptyMocksFixture);
      await screen.findByTestId("target-range-slider");
      await screen.findByTestId("confidence-range-slider");
    });

    test("renders appropriate message on the chart title when there are no workItems", async () => {
      renderWithProviders(<ProjectResponseTimeSLASettingsWidget {...propsFixture} />, emptyMocksFixture);
      const cardsRegex = new RegExp(`0 ${AppTerms.cards.display} closed`, "i")
      await screen.findByText(cardsRegex);
    });
  });

  describe("when there are workItems", () => {
    test("it renders both target and confidence sliders", async () => {
      renderWithProviders(<ProjectResponseTimeSLASettingsWidget {...propsFixture} />, mocks);
      await screen.findByTestId("target-range-slider");
      await screen.findByTestId("confidence-range-slider");
    });

    // this ensures when widget is rendered its able to render till chart component(tests integration of widget view and chart)
    test("it renders chart", async () => {
      renderWithProviders(<ProjectResponseTimeSLASettingsWidget {...propsFixture} />, mocks, {
        chartTestId: "project-flowmetrics-chart",
      });
      await screen.findByTestId("project-flowmetrics-chart");
    });
  });
});
