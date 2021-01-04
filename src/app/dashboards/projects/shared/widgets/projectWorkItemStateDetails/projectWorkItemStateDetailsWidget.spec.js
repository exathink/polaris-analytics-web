import React from "react";
import {GraphQLError} from "graphql";
import {renderComponentWithMockedProvider, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {PROJECT_PIPELINE_STATE_DETAILS} from "../../hooks/useQueryProjectPipelineStateDetails";
import {PROJECT_AGGREGATE_CYCLE_METRICS} from "../../hooks/useQueryProjectCycleMetrics";
import {ProjectWorkItemStateDetailsWidget} from "./projectWorkItemStateDetailsWidget";
import {screen, waitFor} from "@testing-library/react";

const propsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  context: {},
  latestWorkItemEvent: "2020-12-09T22:31:01.244000",
  days: 7,
  targetPercentile: 1,
  leadTimeTargetPercentile: 0.9,
  cycleTimeTargetPercentile: 0.9,
  activeOnly: true,
  specsOnly: true
};

const gqlRequest1 = {
  query: PROJECT_PIPELINE_STATE_DETAILS,
  variables: {
    key: propsFixture.instanceKey,
    specsOnly: true,
    referenceString: propsFixture.latestWorkItemEvent,
    activeOnly: propsFixture.activeOnly,
  },
};

const gqlRequest2 = {
  query: PROJECT_AGGREGATE_CYCLE_METRICS,
  variables: {
    key: propsFixture.instanceKey,
    days: propsFixture.days,
    targetPercentile: propsFixture.targetPercentile,
    specsOnly: propsFixture.specsOnly,
    referenceString: propsFixture.latestWorkItemEvent,
  },
};

const mocks = [
  {
    request: gqlRequest1,
    result: {
      data: {
        project: {
          id: "UHJvamVjdDo0MWFmOGI5Mi01MWY2LTRlODgtOTc2NS1jYzNkYmVhMzVlMWE=",
          workItems: {
            edges: [
              {
                node: {
                  id: "V29ya0l0ZW06NTViYWJhYWQtMzZmNi00YmFmLTljMmYtMTBjNWEyNDU5MWI4",
                  name: "Implement Pull Request webhooks for Github",
                  key: "55babaad-36f6-4baf-9c2f-10c5a24591b8",
                  displayId: "PO-379",
                  workItemType: "task",
                  state: "In Progress",
                  stateType: "wip",
                  workItemStateDetails: {
                    currentStateTransition: {
                      eventDate: "2020-12-09T22:31:01.244000",
                    },
                    currentDeliveryCycleDurations: [
                      {
                        state: "created",
                        stateType: "backlog",
                        daysInState: 0.0005092592592592592,
                      },
                      {
                        state: "Selected for Development",
                        stateType: "backlog",
                        daysInState: 21.253032407407407,
                      },
                      {
                        state: "In Progress",
                        stateType: "wip",
                        daysInState: null,
                      },
                    ],
                    earliestCommit: "2020-12-07T16:56:22",
                    latestCommit: "2020-12-09T22:30:42",
                    commitCount: 7,
                    effort: 3.66666666666667,
                    duration: 2.23217592592593,
                  },
                },
              },
              {
                node: {
                  id: "V29ya0l0ZW06MTNmOTgzNjEtOWRkNi00NWVhLWE4MzItOGRlYzBkOWFjZTU1",
                  name: "State Type mapping widget implementation for workItems ",
                  key: "13f98361-9dd6-45ea-a832-8dec0d9ace55",
                  displayId: "PO-397",
                  workItemType: "task",
                  state: "Code-Review-Needed",
                  stateType: "wip",
                  workItemStateDetails: {
                    currentStateTransition: {
                      eventDate: "2020-12-09T15:36:46.408000",
                    },
                    currentDeliveryCycleDurations: [
                      {
                        state: "In Progress",
                        stateType: "wip",
                        daysInState: 6.065995370370371,
                      },
                      {
                        state: "Code-Review-Needed",
                        stateType: "wip",
                        daysInState: null,
                      },
                      {
                        state: "created",
                        stateType: "backlog",
                        daysInState: 0.019699074074074074,
                      },
                    ],
                    earliestCommit: "2020-12-03T13:38:41",
                    latestCommit: "2020-12-09T18:22:49",
                    commitCount: 31,
                    effort: 4.66666666666667,
                    duration: 6.19731481481482,
                  },
                },
              },
              {
                node: {
                  id: "V29ya0l0ZW06MDc4YjE5YjgtMzBjOC00NjI0LTgyNDctNmE0YjAwN2RlOTk1",
                  name: "Show work queues in value stream mapping detail view. ",
                  key: "078b19b8-30c8-4624-8247-6a4b007de995",
                  displayId: "PO-403",
                  workItemType: "story",
                  state: "In Progress",
                  stateType: "wip",
                  workItemStateDetails: {
                    currentStateTransition: {
                      eventDate: "2020-12-08T22:24:26.088000",
                    },
                    currentDeliveryCycleDurations: [
                      {
                        state: "In Progress",
                        stateType: "wip",
                        daysInState: null,
                      },
                      {
                        state: "created",
                        stateType: "backlog",
                        daysInState: 0.0012847222222222223,
                      },
                    ],
                    earliestCommit: "2020-12-08T22:24:02",
                    latestCommit: "2020-12-08T22:24:02",
                    commitCount: 1,
                    effort: 0.333333333333333,
                    duration: 0,
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
  {
    request: gqlRequest2,
    result: {
      data: {
        project: {
          minLeadTime: null,
          avgLeadTime: null,
          maxLeadTime: null,
          minCycleTime: null,
          avgCycleTime: null,
          maxCycleTime: null,
          percentileLeadTime: null,
          percentileCycleTime: null,
          targetPercentile: 0.9,
          workItemsInScope: 0,
          workItemsWithNullCycleTime: 0,
          earliestClosedDate: null,
          latestClosedDate: null,
        },
      },
    },
  },
];

describe("ProjectWorkItemStateDetailsWidget", () => {
  /**
   * this particular widget renders ProjectPipelineStateDetailsView component 
   * which in turn uses withNavigationContext consumer. 
   * currently we are keeping these tests on hold which require Router as parent.
   */
  test("when there are multiple workItems", async () => {

  });

  describe("when there are errors", () => {
    let logGraphQlError;
    beforeEach(() => {
      logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError");
    });
    afterEach(() => {
      logGraphQlError.mockRestore();
    });

    const mockNetworkError = [
      {
        request: gqlRequest1,
        error: new Error("A network error Occurred"),
      },
      {
        request: gqlRequest2,
        error: new Error("A network error Occurred"),
      },
    ];

    const mockGraphQlErrors = [
      {
        request: gqlRequest1,
        result: {
          errors: [new GraphQLError("A GraphQL Error Occurred")],
        },
      },
      {
        request: gqlRequest2,
        result: {
          errors: [new GraphQLError("A GraphQL Error Occurred")],
        },
      },
    ];

    test("it renders nothing and logs the error when there is a network error", async () => {
      renderComponentWithMockedProvider(<ProjectWorkItemStateDetailsWidget {...propsFixture} />, mockNetworkError);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/work queue/i)).toBeNull();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderComponentWithMockedProvider(<ProjectWorkItemStateDetailsWidget {...propsFixture} />, mockGraphQlErrors);
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/work queue/i)).toBeNull();
    });
  });
});
