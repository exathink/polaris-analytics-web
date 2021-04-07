import React from "react";
import {GraphQLError} from "graphql";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {waitFor} from "@testing-library/react";
import {getNDaysAgo} from "../../../../../../test/test-utils";
import {getServerDate} from "../../../../../helpers/utility";
import {PROJECT_CLOSED_DELIVERY_CYCLE_DETAIL} from "../../hooks/useQueryProjectClosedDeliveryCycleDetail";
import {ProjectDeliveryCycleFlowMetricsWidget} from "./projectDeliveryCycleFlowMetricsWidget";


const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  specsOnly: true,
  view: "primary",
  showAll: true,
  latestWorkItemEvent: getNDaysAgo(9),
  leadTimeTarget: 14,
  cycleTimeTarget: 7,
  leadTimeConfidenceTarget: 0.8,
  cycleTimeConfidenceTarget: 0.9,
  before: getServerDate("2020-03-03"),
  days: 30,
  initialMetric: "cycleTime",
};

const gqlRequest = {
  query: PROJECT_CLOSED_DELIVERY_CYCLE_DETAIL,
  variables: {
    key: propsFixture.instanceKey,
    days: propsFixture.days,
    specsOnly: propsFixture.specsOnly,
    before: propsFixture.before,
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
                  name: "Defects Backlog Trends- remaining tests",
                  key: "4fd9f455-4aad-418d-b500-53e2233659eb:4270",
                  displayId: "PO-555",
                  workItemKey: "4fd9f455-4aad-418d-b500-53e2233659eb",
                  workItemType: "task",
                  isBug: false,
                  state: "Closed",
                  startDate: getNDaysAgo(29),
                  endDate: getNDaysAgo(22),
                  leadTime: 5.271967592592593,
                  cycleTime: 5.258449074074074,
                  latency: 0.000023148148148148147,
                  effort: 0.2,
                  duration: 0,
                  authorCount: 1,
                },
              },
              {
                node: {
                  name: "Account contributors query fails for Account Contributor Activity Summary Widget",
                  key: "c7e1f25b-80cc-4a54-8f5b-36a223736dbd:4264",
                  displayId: "PO-547",
                  workItemKey: "c7e1f25b-80cc-4a54-8f5b-36a223736dbd",
                  workItemType: "bug",
                  isBug: true,
                  state: "DEPLOYED-TO-PROD",
                  startDate: getNDaysAgo(40),
                  endDate: getNDaysAgo(22),
                  leadTime: 16.350092592592592,
                  cycleTime: null,
                  latency: 0.30030092592592594,
                  effort: 0.2,
                  duration: 0,
                  authorCount: 1,
                },
              },
            ],
          },
        },
      },
    },
  },
];

describe("ProjectDeliveryCycleFlowMetricsWidget", () => {
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

      renderWithProviders(<ProjectDeliveryCycleFlowMetricsWidget {...propsFixture} />, mockNetworkError);

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });

    test("it logs the error when there is a GraphQl error", async () => {
      await waitFor(() => expect(logGraphQlError).not.toHaveBeenCalled());

      renderWithProviders(<ProjectDeliveryCycleFlowMetricsWidget {...propsFixture} />, mockGraphQlErrors);

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
    });
  });

  describe("when there are no errors", () => {
    test("renders widget without any error", () => {
      renderWithProviders(<ProjectDeliveryCycleFlowMetricsWidget {...propsFixture} />, mocks);
    });
  });
});
