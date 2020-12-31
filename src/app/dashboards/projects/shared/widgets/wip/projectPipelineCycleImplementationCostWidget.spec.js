import React from "react";
import {gqlUtils, renderComponentWithMockedProvider} from "../../../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {ProjectPipelineImplementationCostWidget} from "./projectPipelineCycleImplementationCostWidget";
import {PROJECT_PIPELINE_STATE_DETAILS} from "../../hooks/useQueryProjectPipelineStateDetails";
import {getReferenceString} from "../../../../../helpers/utility";

const widgetPropsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  specsOnly: false,
  wipLimit: 20,
  workItemScope: "all",
  context: {},
  latestWorkItemEvent: "2020-12-09T22:31:01.244000",
  latestCommit: "2020-12-09T22:30:42",
  view: "primary",
};

const gqlRequest = {
  query: PROJECT_PIPELINE_STATE_DETAILS,
  variables: {
    key: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
    specsOnly: false,
    referenceString: getReferenceString(widgetPropsFixture.latestWorkItemEvent, widgetPropsFixture.latestCommit),
  },
};

const gqlMocks = [
  {
    request: gqlRequest,
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
                        state: "In Progress",
                        stateType: "wip",
                        daysInState: null,
                      },
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
                        state: "created",
                        stateType: "backlog",
                        daysInState: 0.019699074074074074,
                      },
                      {
                        state: "Code-Review-Needed",
                        stateType: "wip",
                        daysInState: null,
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
                  id: "V29ya0l0ZW06MjVmYzIyN2QtMzBhZC00ZjQzLWI5ZTUtNTc2NTA3ZjM2MmUw",
                  name: "Order work items sources by most recently updated when displaying state mappings. ",
                  key: "25fc227d-30ad-4f43-b9e5-576507f362e0",
                  displayId: "PO-405",
                  workItemType: "story",
                  state: "READY-FOR-DEVELOPMENT",
                  stateType: "open",
                  workItemStateDetails: {
                    currentStateTransition: {
                      eventDate: "2020-12-08T23:03:15.254000",
                    },
                    currentDeliveryCycleDurations: [
                      {
                        state: "READY-FOR-DEVELOPMENT",
                        stateType: "open",
                        daysInState: null,
                      },
                      {
                        state: "created",
                        stateType: "backlog",
                        daysInState: 0.003171296296296296,
                      },
                    ],
                    earliestCommit: null,
                    latestCommit: null,
                    commitCount: null,
                    effort: null,
                    duration: null,
                  },
                },
              },
            ],
          },
        },
      },
    },
  },
];

describe("ProjectPipelineImplementationCostWidget", () => {
  describe("renders without any error", () => {
    test("it shows a loading spinner", async () => {
      renderComponentWithMockedProvider(<ProjectPipelineImplementationCostWidget {...widgetPropsFixture} />, gqlMocks);
      await screen.findByTestId("loading-spinner");
    });

    test("should render the widget with correct title", async () => {
      renderComponentWithMockedProvider(<ProjectPipelineImplementationCostWidget {...widgetPropsFixture} />, gqlMocks);
      expect(await screen.findByText(/Total Wip Effort/i)).toBeInTheDocument();
    });
  });

  describe("when there are errors", () => {
    let logGraphQlError;
    beforeEach(() => {
      // changing the mockImplementation to be no-op, so that console remains clean. as we only need to assert whether it has been called.
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
      renderComponentWithMockedProvider(
        <ProjectPipelineImplementationCostWidget {...widgetPropsFixture} />,
        mockNetworkError
      );

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/Total Wip Effort/i)).not.toBeInTheDocument();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderComponentWithMockedProvider(
        <ProjectPipelineImplementationCostWidget {...widgetPropsFixture} />,
        mockGraphQlErrors
      );

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/Total Wip Effort/i)).not.toBeInTheDocument();
    });
  });
});
