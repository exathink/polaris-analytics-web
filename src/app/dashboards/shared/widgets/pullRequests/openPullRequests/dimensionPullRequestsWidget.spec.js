import {screen, waitFor} from "@testing-library/react";
import React from "react";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {getDimensionPullRequests} from "../hooks/useQueryDimensionPullRequests";
import {DimensionPullRequestsWidget} from "./dimensionPullRequestsWidget";
import {GraphQLError} from "graphql";
import {getReferenceString} from "../../../../../helpers/utility";
import {getNDaysAgo} from "../../../../../../test/test-utils";

const referenceDates = {
  latestWorkItemEvent: "2020-12-09T22:31:01.244000",
  latestCommit: "2020-12-09T22:30:42",
  latestPullRequestEvent: "2020-12-09T21:28:26.745000"

}

const gqlRequest = {
  query: getDimensionPullRequests('project'),
  variables: {
    projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
    activeOnly: true,
    closedWithinDays: undefined,
    referenceString: getReferenceString(referenceDates.latestCommit, referenceDates.latestWorkItemEvent, referenceDates.latestPullRequestEvent),
  },
};


const mocks = [
  {
    request: gqlRequest,
    result: {
      data: {
        project: {
          id: "UHJvamVjdDo0MWFmOGI5Mi01MWY2LTRlODgtOTc2NS1jYzNkYmVhMzVlMWE=",
          pullRequests: {
            edges: [
              {
                node: {
                  id: "UHVsbFJlcXVlc3Q6NWExZDFjODAtY2I1Zi00ZGQzLThhYjYtOTI4NzZjZGU3YmZh",
                  name: 'PO-397 "Testing"',
                  key: "5a1d1c80-cb5f-4dd3-8ab6-92876cde7bfa",
                  displayId: "118",
                  state: "open",
                  repositoryKey: "a4cb90a1-dcf5-4768-b140-295c97be9ee0",
                  repositoryName: "polaris-analytics-web",
                  age: 11.865918751713,
                  webUrl: "https://gitlab.com/polaris-apps/polaris-analytics-web/-/merge_requests/118",
                  createdAt: getNDaysAgo(11.86),
                  endDate: getNDaysAgo(4.86),
                  workItemsSummaries: [
                    {
                      displayId: "PO-397",
                      name: "test",
                      key: "13f98361-9dd6-45ea-a832-8dec0d9ace55",
                      state: "Code-Review-Needed",
                      stateType: "wip",
                    },
                  ],
                },
              },
              {
                node: {
                  id: "UHVsbFJlcXVlc3Q6NWEabcFjODAtY2I1Zi00ZGQzLThhYjYtOTI4NzZjZGU3YmZh",
                  name: 'PO-398 "Testing"',
                  key: "5a1d1c80-xyzf-4dd3-8ab6-92876cde7bfa",
                  displayId: "119",
                  state: "open",
                  repositoryKey: "a4cb90a1-dcf5-4768-b140-295c97be9ee0",
                  repositoryName: "polaris-analytics-web",
                  age: 11.865918751713,
                  webUrl: "https://gitlab.com/polaris-apps/polaris-analytics-web/-/merge_requests/119",
                  createdAt: getNDaysAgo(11.86),
                  endDate: getNDaysAgo(4.86),
                  workItemsSummaries: [],
                },
              },
            ],
          },
        },
      },
    },
  },
];

const projectPullRequestsPropsFixture = {
  dimension: 'project',
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  view: "primary",
  asStatistic: true,
  activeOnly: true,
  context: {},
  ...referenceDates
};

const activeCodeReviews = mocks[0].result.data.project.pullRequests.edges;

describe("projectPullRequestsWidget", () => {
  describe("when there are no pull requests", () => {
    const emptyMock = [
      {
        request: gqlRequest,
        result: {
          data: {
            project: {
              id: "UHJvamVjdDo0MWFmOGI5Mi01MWY2LTRlODgtOTc2NS1jYzNkYmVhMzVlMWE=",
              pullRequests: {
                edges: [],
              },
            },
          },
        },
      },
    ];

    test("it renders no data", async () => {
      renderWithProviders(<DimensionPullRequestsWidget {...projectPullRequestsPropsFixture} />, emptyMock);

      await screen.findByTestId("loading-spinner");
      await screen.findByText(/open/i);
    });

    test("renders stats chart in primary view without any error", async () => {
      renderWithProviders(<DimensionPullRequestsWidget {...projectPullRequestsPropsFixture} />, emptyMock);
      await screen.findByTestId("loading-spinner");
      await screen.findByText(/open/i);
    });

    test("renders pull request chart in primary view without any error", async () => {
      const charViewProps = {
        ...projectPullRequestsPropsFixture,
        display: "histogram",
        asStatistic: false,
      };

      renderWithProviders(<DimensionPullRequestsWidget {...charViewProps} />, emptyMock);
      await screen.findByTestId("loading-spinner");
      await screen.findByText(/open pull requests/i);
    });
  });

  describe("when there are multiple pull requests", () => {
    test("shows a loading spinner", async () => {
      renderWithProviders(<DimensionPullRequestsWidget {...projectPullRequestsPropsFixture} />, mocks);
      await screen.findByTestId("loading-spinner");
    });

    test("shows correct no of active pending reviews", async () => {
      renderWithProviders(<DimensionPullRequestsWidget {...projectPullRequestsPropsFixture} />, mocks);
      await screen.findByTestId("loading-spinner");
      await screen.findByText(/open/i);
      expect(await screen.findByText(activeCodeReviews.length)).toBeInTheDocument();
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
      renderWithProviders(
        <DimensionPullRequestsWidget {...projectPullRequestsPropsFixture} />,
        mockNetworkError
      );
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/pending/i)).toBeNull();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      renderWithProviders(
        <DimensionPullRequestsWidget {...projectPullRequestsPropsFixture} />,
        mockGraphQlErrors
      );
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByText(/pending/i)).toBeNull();
    });
  });
});
