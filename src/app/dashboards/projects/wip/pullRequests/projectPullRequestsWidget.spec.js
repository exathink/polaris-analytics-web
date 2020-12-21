import {screen} from "@testing-library/react";
import React from "react";
import {renderComponentWithMockedProvider} from "../../../../framework/viz/charts/chart-test-utils";
import {GET_PROJECT_PULL_REQUESTS} from "../../shared/hooks/useQueryProjectPullRequests";
import {ProjectPullRequestsWidget} from "./projectPullRequestsWidget";

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

const mocks = [
  {
    request: {
      query: GET_PROJECT_PULL_REQUESTS,
      variables: {
        projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
        activeOnly: true,
        referenceString: "160753326124416075332420001607529506745",
      },
    },
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
                  workItemsSummaries: [
                    {
                      displayId: "PO-397",
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
                  workItemsSummaries: [],
                },
              }
            ],
          },
        },
      },
    },
  },
];
const projectPullRequestsPropsFixture = {
  instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
  view: "primary",
  context: {},
  latestWorkItemEvent: "2020-12-09T22:31:01.244000",
  latestCommit: "2020-12-09T22:30:42",
  latestPullRequestEvent: "2020-12-09T21:28:26.745000",
};

const activeCodeReviews = mocks[0].result.data.project.pullRequests.edges;

describe("projectPullRequestsWidget", () => {
  describe("when there are no pull requests", () => {
    const emptyMock = [
      {
        request: mocks[0].request,
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
      renderComponentWithMockedProvider(<ProjectPullRequestsWidget {...projectPullRequestsPropsFixture} />, emptyMock);

      await screen.findByTestId("loading-spinner");
      await screen.findByText(/Pending/i);
      expect((await screen.findAllByText(/0/i)).length).toBeGreaterThan(0);
    });
  });

  describe("when there are multiple pull requests", () => {
    test("shows a loading spinner", async () => {
      renderComponentWithMockedProvider(<ProjectPullRequestsWidget {...projectPullRequestsPropsFixture} />, mocks);
      await screen.findByTestId("loading-spinner");
    });

    test("shows correct no of active pending reviews", async () => {
      renderComponentWithMockedProvider(<ProjectPullRequestsWidget {...projectPullRequestsPropsFixture} />, mocks);
      await screen.findByTestId("loading-spinner");
      await screen.findByText(/Pending/i);
      expect(await screen.findByText(activeCodeReviews.length)).toBeInTheDocument();
    });
  });
});
