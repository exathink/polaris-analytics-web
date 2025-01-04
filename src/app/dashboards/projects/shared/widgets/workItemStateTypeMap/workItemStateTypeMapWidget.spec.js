import React from "react";
import {WorkItemStateTypeMapWidget} from "./workItemStateTypeMapWidget";
import {GET_STATE_MAPPING_QUERY} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import {renderWithProviders, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {screen, waitFor} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {gql} from "@apollo/client";
import {ViewerContext} from "../../../../../framework/viewer/viewerContext";

const VIEWER_INFO_QUERY = gql`
  query viewer_info {
    viewer {
      key
      ...ViewerInfoFields
    }
  }
  ${ViewerContext.fragments.viewerInfoFields}
`;

const viewerMock = {
  request: {
    query: VIEWER_INFO_QUERY,
  },
  result: {
    data: {
      viewer: {
        key: "54281e0f-c257-4c9c-aadb-bb3ac09574a6",
        userName: null,
        company: null,
        firstName: "Polaris",
        lastName: "Dev",
        email: "polaris-dev@exathink.com",
        systemRoles: [],
        accountRoles: [
          {
            key: "24347f28-0020-4025-8801-dbc627f9415d",
            name: "Polaris-Dev",
            scopeKey: "24347f28-0020-4025-8801-dbc627f9415d",
            role: "owner",
          },
        ],
        organizationRoles: [
          {
            key: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
            name: "Polaris-Dev",
            scopeKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
            role: "owner",
          },
        ],
        accountKey: "24347f28-0020-4025-8801-dbc627f9415d",
        account: {
          id: "QWNjb3VudDoyNDM0N2YyOC0wMDIwLTQwMjUtODgwMS1kYmM2MjdmOTQxNWQ=",
          key: "24347f28-0020-4025-8801-dbc627f9415d",
          name: "Polaris-Dev",
          featureFlags: {
            edges: [
              {
                node: {
                  name: "projects.alignment-trends-widgets",
                  key: "678bdab9-cd37-4493-956c-2d107e0d4ff9",
                  enabled: true,
                },
              },
              {
                node: {
                  name: "projects.flowboard-2",
                  key: "72b686e1-a8bd-4cf5-8218-fe9475841019",
                  enabled: true,
                },
              },
              {
                node: {
                  name: "dev.tutorials",
                  key: "0da2d815-901f-4a5b-8a70-a0f5672e5e0f",
                  enabled: true,
                },
              },
            ],
          },
          organizations: {
            count: 1,
          },
          projects: {
            count: 2,
          },
          repositories: {
            count: 31,
          },
        },
        featureFlags: {
          edges: [
            {
              node: {
                name: "projects.alignment-trends-widgets",
                key: "678bdab9-cd37-4493-956c-2d107e0d4ff9",
                enabled: null,
              },
            },
            {
              node: {
                name: "projects.flowboard-2",
                key: "72b686e1-a8bd-4cf5-8218-fe9475841019",
                enabled: null,
              },
            },
            {
              node: {
                name: "dev.tutorials",
                key: "0da2d815-901f-4a5b-8a70-a0f5672e5e0f",
                enabled: null,
              },
            },
          ],
        },
      },
    },
  },
};

const mocks = [
  {
    request: {
      query: GET_STATE_MAPPING_QUERY,
      variables: {
        projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
      },
    },
    result: {
      data: {
        project: {
          organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
          workItemsSources: {
            edges: [
              {
                node: {
                  key: "a92d9cc9-25ba-4337-899f-cba7797a6c12",
                  name: "Polaris Platform",
                  workItemStateMappings: [
                    {
                      state: "accepted",
                      stateType: "closed",
                    },
                    {
                      state: "planned",
                      stateType: "complete",
                    },
                    {
                      state: "unscheduled",
                      stateType: "backlog",
                    },
                    {
                      state: "unstarted",
                      stateType: "open",
                    },
                    {
                      state: "started",
                      stateType: "open",
                    },
                    {
                      state: "delivered",
                      stateType: "wip",
                    },
                    {
                      state: "created",
                      stateType: "backlog",
                    },
                    {
                      state: "finished",
                      stateType: "complete",
                    },
                  ],
                },
              },
              {
                node: {
                  key: "46694f4f-e003-4430-a7a7-e4f288f40d22",
                  name: "Polaris",
                  workItemStateMappings: [
                    {
                      state: "ACCEPTED",
                      stateType: "closed",
                    },
                    {
                      state: "Closed",
                      stateType: "open",
                    },
                    {
                      state: "Code-Review-Needed",
                      stateType: "wip",
                    },
                    {
                      state: "Done",
                      stateType: "closed",
                    },
                    {
                      state: "ABANDONED",
                      stateType: "backlog",
                    },
                    {
                      state: "Backlog",
                      stateType: "backlog",
                    },
                    {
                      state: "ROADMAP",
                      stateType: "backlog",
                    },
                    {
                      state: "DEV-DONE",
                      stateType: "complete",
                    },
                    {
                      state: "created",
                      stateType: "open",
                    },
                    {
                      state: "DEPLOYED-TO-STAGING",
                      stateType: "open",
                    },
                    {
                      state: "Selected for Development",
                      stateType: "open",
                    },
                    {
                      state: "RELEASED",
                      stateType: "complete",
                    },
                    {
                      state: "DESIGN",
                      stateType: "open",
                    },
                    {
                      state: "In Progress",
                      stateType: "wip",
                    },
                    {
                      state: "READY-FOR-DEVELOPMENT",
                      stateType: "backlog",
                    },
                  ],
                },
              },
            ],
          },
        },
      },
    },
  },
  viewerMock,
];

// TODO: Turning off this suite for now. It is dependent on https://urjuna.atlassian.net/browse/PO-451
//  to fix testability issues with viewer context. Will fix as part of that story
describe.skip("WorkItemStateTypeMapWidget", () => {
  describe("when there are no workItemSources", () => {
    const stateTypeWidgetPropsFixture = {
      instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
      context: {},
      latestWorkItemEvent: "2020-12-05T13:51:14.261000",
      latestCommit: "2020-12-05T03:32:50",
      days: 30,
      view: "detail",
    };

    const mocksWithEmptyWorkItemSources = [
      {
        request: {
          query: GET_STATE_MAPPING_QUERY,
          variables: {
            projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
          },
        },
        result: {
          data: {
            project: {
              organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
              workItemsSources: {
                edges: [],
              },
            },
          },
        },
      },
      viewerMock,
    ];

    test("it renders no data", async () => {
      renderWithProviders(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mocksWithEmptyWorkItemSources
      );

      await screen.findByTestId("loading-spinner");
      await screen.findByText(/There are no work streams in this value stream/i);
    });
  });

  describe("when there is one work item source", () => {
    const stateTypeWidgetPropsFixture = {
      instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
      context: {},
      latestWorkItemEvent: "2020-12-05T13:51:14.261000",
      latestCommit: "2020-12-05T03:32:50",
      days: 30,
      view: "detail",
    };

    const mockWithSingleWorkItemSource = [
      {
        request: {
          query: GET_STATE_MAPPING_QUERY,
          variables: {
            projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
          },
        },
        result: {
          data: {
            project: {
              organizationKey: "52e0eff5-7b32-4150-a1c4-0f55d974ee2a",
              workItemsSources: {
                edges: [
                  {
                    node: {
                      key: "a92d9cc9-25ba-4337-899f-cba7797a6c12",
                      name: "Polaris",
                      workItemStateMappings: [
                        {
                          state: "backlog",
                          stateType: "backlog",
                        },
                        {
                          state: "upnext",
                          stateType: "open",
                        },
                        {
                          state: "doing",
                          stateType: "wip",
                        },
                        {
                          state: "done",
                          stateType: "complete",
                        },
                        {
                          state: "released",
                          stateType: "closed",
                        },
                        {
                          state: "rejected",
                          stateType: null,
                        },
                        {
                          state: "blocked",
                          stateType: "unmapped",
                        },
                      ],
                    },
                  },
                ],
              },
            },
          },
        },
      },
      viewerMock,
    ];

    test("it shows a loading spinner", async () => {
      renderWithProviders(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mockWithSingleWorkItemSource
      );
      await screen.findByTestId("loading-spinner");
    });

    test("it does not shows a dropdown to select work item sources", async () => {
      renderWithProviders(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mockWithSingleWorkItemSource
      );
      // need to wait until the view has rendered to test that the combo box is NOT displayed. Otherwise
      // it will pass trivially.
      await screen.findByTestId("state-type-map-view");

      expect(screen.queryByRole("combobox")).toBeNull();
    });

    test("it shows the chart title", async () => {
      renderWithProviders(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mockWithSingleWorkItemSource
      );
      await screen.findByText(/Delivery Process Mapping/i);
    });

    test("it shows the chart sub title", async () => {
      renderWithProviders(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mockWithSingleWorkItemSource
      );
      await screen.findByText(/Drag/i);
    });

    test("it does not show the save/cancel button", async () => {
      renderWithProviders(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mockWithSingleWorkItemSource
      );
      await screen.findByTestId("state-type-map-view");
      expect(screen.queryByRole("button")).toBeNull();
    });
  });

  describe("when there are multiple work item sources", () => {
    const stateTypeWidgetPropsFixture = {
      instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
      context: {},
      latestWorkItemEvent: "2020-12-05T13:51:14.261000",
      latestCommit: "2020-12-05T03:32:50",
      days: 30,
      view: "detail",
    };

    test("it shows a loading spinner", async () => {
      renderWithProviders(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      await screen.findByTestId("loading-spinner");
    });

    test("it shows the name of the first work item source in the dropdown title", async () => {
      renderWithProviders(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      const dropDown = await screen.findByRole("combobox");
      expect(screen.getByText(/Polaris Platform/, dropDown)).toBeDefined();
    });

    test("it shows the chart title", async () => {
      renderWithProviders(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      await screen.findByText(/Delivery Process Mapping/i);
    });

    test("it shows the chart sub title", async () => {
      renderWithProviders(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      await screen.findByText(/Drag/i);
    });

    test("it does not show the save/cancel button", async () => {
      renderWithProviders(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      // need to wait for the view to render to check the button is NOT rendered. Otherwise it will pass trivially
      await screen.findByTestId("state-type-map-view");
      expect(screen.queryByRole("button")).toBeNull();
    });
  });

  describe("when there are errors", () => {
    // clear mocks after each test
    afterEach(() => {
      jest.clearAllMocks();
    });

    const stateTypeWidgetPropsFixture = {
      instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
      context: {},
      latestWorkItemEvent: "2020-12-05T13:51:14.261000",
      latestCommit: "2020-12-05T03:32:50",
      days: 30,
      view: "detail",
    };
    const mockNetworkError = [
      {
        request: {
          query: GET_STATE_MAPPING_QUERY,
          variables: {
            projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
          },
        },
        error: new Error("A network error Occurred"),
      },
      viewerMock,
    ];

    const mockGraphQlErrors = [
      {
        request: {
          query: GET_STATE_MAPPING_QUERY,
          variables: {
            projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
          },
        },
        result: {
          errors: [new GraphQLError("A GraphQL Error Occurred")],
        },
      },
      viewerMock,
    ];

    test("it renders nothing and logs the error when there is a network error", async () => {
      const logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError");

      renderWithProviders(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mockNetworkError
      );
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByTestId("state-type-map-view")).toBeNull();

      logGraphQlError.mockRestore();
    });

    test("it renders nothing and logs the error when there is a GraphQl error", async () => {
      const logGraphQlError = jest.spyOn(gqlUtils, "logGraphQlError");

      renderWithProviders(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mockGraphQlErrors
      );
      await screen.findByTestId("loading-spinner");
      await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
      expect(screen.queryByTestId("state-type-map-view")).toBeNull();

      logGraphQlError.mockRestore();
    });
  });
});
