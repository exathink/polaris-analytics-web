import React from "react";
import {WorkItemStateTypeMapWidget} from "./workItemStateTypeMapWidget";
import {GET_STATE_MAPPING_QUERY} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";
import '@testing-library/jest-dom/extend-expect'
import {renderedWidget} from "../../../../../framework/viz/charts/chart-test-utils";

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
  test("renders widget without error", async () => {
    const stateTypeWidgetPropsFixture = {
      instanceKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
      context: {},
      latestWorkItemEvent: "2020-12-05T13:51:14.261000",
      latestCommit: "2020-12-05T03:32:50",
      days: 30,
      view: "primary",
    };

    const {getByText, chartConfig} = await renderedWidget(
      <WorkItemStateTypeMapWidget {...stateTypeWidgetPropsFixture} />,
      mocks
    );
    expect(getByText(/Value Stream Mapping/)).toBeInTheDocument();
  });
});
