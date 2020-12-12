import React from "react";
import {WorkItemStateTypeMapWidget} from "./workItemStateTypeMapWidget";
import {GET_STATE_MAPPING_QUERY} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import "@testing-library/jest-dom/extend-expect";
import {renderComponentWithMockedProvider} from "../../../../../framework/viz/charts/chart-test-utils";
import {screen} from "@testing-library/react";

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
];

describe("WorkItemStateTypeMapWidget", () => {
  describe("when there are no workItemSources", async () => {
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
              workItemsSources: {
                edges: [],
              },
            },
          },
        },
      },
    ];

    test('it renders no data', async () => {
      renderComponentWithMockedProvider(
        <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
        mocksWithEmptyWorkItemSources
      );

      await screen.findByTestId("loading-spinner");
      await screen.findByTestId("no-data");
    })
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
      renderComponentWithMockedProvider(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      await screen.findByTestId("loading-spinner");
    });

    test("it shows the name of the first work item source in the dropdown title", async () => {
      renderComponentWithMockedProvider(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      const dropDown = await screen.findByRole("combobox");
      expect(screen.getByText(/Polaris Platform/, dropDown)).toBeDefined();
    });

    test("it shows the chart title", async () => {
      renderComponentWithMockedProvider(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      await screen.findByText(/Value Stream Mapping/i);
    });

    test("it shows the chart sub title", async () => {
      renderComponentWithMockedProvider(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      await screen.findByText(/Drag/i);
    });

    test("it does not show the save/cancel button", async () => {
      renderComponentWithMockedProvider(<WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />, mocks);
      const dropDown = await screen.findByRole("combobox");
      expect(screen.queryByRole("button")).toBeNull();
    });
  });
});
