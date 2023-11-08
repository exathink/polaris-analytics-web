import React from "react";
import {gqlUtils, renderWithProviders} from "../../../../../../framework/viz/charts/chart-test-utils";
import {waitFor, screen} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {DimensionWipEffortWidget} from "./dimensionWipEffortWidget";
import {dimensionWorkItemDetailsQuery} from "../../hooks/useQueryDimensionWorkItemDetails";
import {getReferenceString} from "../../../../../../helpers/utility";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const widgetPropsFixture = {
  dimension: 'project',
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
  query: dimensionWorkItemDetailsQuery('project'),
  variables: {
    key: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
    specsOnly: false,
    activeOnly: true,
    includeSubTasks: undefined,
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
                  workItemsSourceKey: "46694f4f-e003-4430-a7a7-e4f288f40d22",
                  workItemsSourceName: "Polaris",
                  teamNodeRefs: [],
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
                    leadTime: 18.0,
                    cycleTime: 17.0
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
      renderWithProviders(<DimensionWipEffortWidget {...widgetPropsFixture} />, gqlMocks);
      await screen.findByTestId("loading-spinner");
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
      renderWithProviders(
        <DimensionWipEffortWidget {...widgetPropsFixture} />,
        mockNetworkError
      );

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/Total Wip Effort/i)).not.toBeInTheDocument();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(
        <DimensionWipEffortWidget {...widgetPropsFixture} />,
        mockGraphQlErrors
      );

      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/Total Wip Effort/i)).not.toBeInTheDocument();
    });
  });
});
