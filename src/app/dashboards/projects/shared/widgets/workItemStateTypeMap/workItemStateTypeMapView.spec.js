import React from "react";
import {renderWithMockedProvider, gqlUtils} from "../../../../../framework/viz/charts/chart-test-utils";
import {actionTypes} from "./constants";
import {WorkItemStateTypeMapView} from "./workItemStateTypeMapView";
import * as workItemUtils from "./workItemReducer";
import {waitFor, screen, fireEvent} from "@testing-library/react";
import {GraphQLError} from "graphql";
import {UPDATE_PROJECT_WORKITEM_SOURCE_STATE_MAPS} from "../../hooks/useQueryProjectWorkItemsSourceStateMappings";

beforeAll(() => {
  jest.spyOn(workItemUtils, "workItemReducer");
});

// clear mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});

/**
 *
 * @param {*} component
 * @param {*} dropCategoryIndex: category index where point is to be dropped.
 * @param {*} mapper : points => points
 */
async function renderedDragDropConfig(component, dropCategoryIndex, mapper = (point) => point, mocks = []) {
  const {
    chartConfig: {
      plotOptions: {
        series: {
          point: {
            events: {drop},
          },
        },
      },
    },
    chart: {series},
  } = await renderWithMockedProvider(component, mocks);

  // get the points from single point series, filter out last series(pedestal series).
  const points = series.filter((s, i, arr) => i !== arr.length - 1).map((s) => s.points[0]);
  // get the points after applying mapper
  const _points = mapper(points);

  let reducerArgs = [];
  // need to wrap this in waitFor, as this is calling drop function which in turn is updating component state.
  await waitFor(() => {
    // call the drop function only for the mapped points
    reducerArgs = _points.map((point, i) => {
      const eventWithNewPoint = {newPoint: {x: dropCategoryIndex}};
      // call the drop function in the context of point
      drop.bind(point)(eventWithNewPoint);

      if (workItemUtils.workItemReducer.mock.calls.length > 0) {
        // return argurments(state, action) of workItemReducer
        return [workItemUtils.workItemReducer.mock.calls[i][0], workItemUtils.workItemReducer.mock.calls[i][1]];
      } else {
        return [null, null];
      }
    });
  });

  return reducerArgs;
}

const workItemSourcesFixture = [
  {
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
        stateType: "open",
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
  {
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
];

const projectKey = "41af8b92-51f6-4e88-9765-cc3dbea35e1a";

describe("WorkItemStateTypeMapView", () => {
  describe("when there are no workItemSources", () => {
    test("renders only the base pedestal series", async () => {
      const {
        chartConfig: {series},
      } = await renderWithMockedProvider(
        <WorkItemStateTypeMapView instanceKey={projectKey} workItemSources={[]} view="detail" enableEdits={true} />
      );

      expect(series).toHaveLength(1);
    });

    test("renders appropriate message on ui to indicate the empty workItemSources", async () => {
      await renderWithMockedProvider(
        <WorkItemStateTypeMapView instanceKey={projectKey} workItemSources={[]} view="detail" enableEdits={true} />
      );

      expect(screen.getByText(/There are no work streams in this value stream/i)).toBeInTheDocument();
    });
  });

  describe("when there are no mappings available for workItemSource", () => {
    const workItemSourcesWithEmptyMappings = workItemSourcesFixture.map((w) => ({...w, workItemStateMappings: []}));

    test("it renders without an error", async () => {
      await renderWithMockedProvider(
        <WorkItemStateTypeMapView
          instanceKey={projectKey}
          workItemSources={workItemSourcesWithEmptyMappings}
          view="detail"
          enableEdits={true}
        />
      );
    });

    test("renders first workItemSource as initial selected value for dropdown on the component", async () => {
      await renderWithMockedProvider(
        <WorkItemStateTypeMapView instanceKey={projectKey} workItemSources={workItemSourcesWithEmptyMappings} />
      );

      expect(screen.getByText(/Polaris Platform/i)).toBeInTheDocument();
    });

    test("renders only the base pedestal series", async () => {
      const {
        chartConfig: {series},
      } = await renderWithMockedProvider(
        <WorkItemStateTypeMapView instanceKey={projectKey} workItemSources={workItemSourcesWithEmptyMappings} />
      );

      expect(series).toHaveLength(1);
    });
  });

  describe("should drag work item state to its desired phase", () => {
    const cases = ["unscheduled", "planned", "unstarted", "started", "delivered", "finished"]; // closed is the drop target
    cases.forEach((workItemState) => {
      test(`it drags point with name ${workItemState} to target category closed`, async () => {
        const [[_, action]] = await renderedDragDropConfig(
          <WorkItemStateTypeMapView
            instanceKey={projectKey}
            workItemSources={workItemSourcesFixture}
            enableEdits={true}
          />,
          5, // dropping to closed category
          (points) => [points.find((p) => p.name === workItemState)]
        );

        expect(action.type).toBe(actionTypes.UPDATE_WORKITEM_SOURCE);
        expect(action.payload).toHaveProperty("keyValuePair");
        expect(action.payload.keyValuePair).toMatchObject({[workItemState]: "closed"});
      });
    });

    test("when point is dragged and dropped to the same target as the source, no action should be dispatched", async () => {
      const [[_, action]] = await renderedDragDropConfig(
        <WorkItemStateTypeMapView
          instanceKey={projectKey}
          workItemSources={workItemSourcesFixture}
          enableEdits={true}
        />,
        5, // dropping to closed category
        (points) => [points.find((p) => p.x === 5)]
      );

      expect(action).toBe(null);
    });
  });

  describe("save/cancel", () => {
    const gqlMutationRequest = {
      query: UPDATE_PROJECT_WORKITEM_SOURCE_STATE_MAPS,
      variables: {
        projectKey: "41af8b92-51f6-4e88-9765-cc3dbea35e1a",
        workItemsSourceStateMaps: [
          {
            workItemsSourceKey: "a92d9cc9-25ba-4337-899f-cba7797a6c12",
            stateMaps: [
              {state: "accepted", stateType: "closed"},
              {state: "planned", stateType: "complete"},
              {state: "unscheduled", stateType: "open"},
              {state: "unstarted", stateType: "closed"},
              {state: "started", stateType: "open"},
              {state: "delivered", stateType: "wip"},
              {state: "created", stateType: "backlog"},
              {state: "finished", stateType: "complete"},
            ],
          },
        ],
      },
    };

    const updateWorkItemMappingMocks = [
      {
        request: gqlMutationRequest,
        result: {
          data: {
            updateProjectStateMaps: {
              success: true,
              errorMessage: null,
            },
          },
        },
      },
    ];

    test("when work item state is dragged to a desired phase, save/cancel buttons should appear on the screen", async () => {
      await renderedDragDropConfig(
        <WorkItemStateTypeMapView
          instanceKey={projectKey}
          workItemSources={workItemSourcesFixture}
          enableEdits={true}
        />,
        5, // dropping to closed category
        (points) => [points.find((p) => p.name === "unscheduled")]
      );

      const saveElement = screen.getByText(/save/i);
      const cancelElement = screen.getByText(/cancel/i);

      expect(saveElement).toBeInTheDocument();
      expect(cancelElement).toBeInTheDocument();
    });

    test("when cancel button is clicked, save/cancel buttons should disappear ", async () => {
      await renderedDragDropConfig(
        <WorkItemStateTypeMapView
          instanceKey={projectKey}
          workItemSources={workItemSourcesFixture}
          enableEdits={true}
        />,
        5, // dropping to closed category
        (points) => [points.find((p) => p.name === "unscheduled")]
      );

      const saveElement = screen.getByText(/save/i);
      const cancelElement = screen.getByText(/cancel/i);

      // Before Cancel Button Click
      expect(saveElement).toBeInTheDocument();
      expect(cancelElement).toBeInTheDocument();

      fireEvent.click(cancelElement);

      // After Cancel Button Click
      expect(saveElement).not.toBeInTheDocument();
      expect(cancelElement).not.toBeInTheDocument();
    });

    test("when save button is clicked, button loading state should appear during the time mutation is executing. after that there is success message.", async () => {
      await renderedDragDropConfig(
        <WorkItemStateTypeMapView
          instanceKey={projectKey}
          workItemSources={workItemSourcesFixture}
          enableEdits={true}
        />,
        5, // dropping to closed category
        (points) => [points.find((p) => p.name === "unstarted")],
        updateWorkItemMappingMocks
      );

      const saveElement = screen.getByText(/save/i);
      fireEvent.click(saveElement);

      const inProgressElement = screen.getByText(/Processing.../i);
      expect(inProgressElement).toBeInTheDocument();

      // after brief time, success message should appear.
      const successElement = await screen.findByText(/success/i);
      expect(successElement).toBeInTheDocument();
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
          request: gqlMutationRequest,
          error: new Error("A network error Occurred"),
        },
      ];

      const mockGraphQlErrors = [
        {
          request: gqlMutationRequest,
          result: {
            errors: [new GraphQLError("A GraphQL Error Occurred")],
          },
        },
      ];
      test("it renders nothing and logs the error when there is a network error", async () => {
        await renderedDragDropConfig(
          <WorkItemStateTypeMapView
            instanceKey={projectKey}
            workItemSources={workItemSourcesFixture}
            enableEdits={true}
          />,
          5, // dropping to closed category
          (points) => [points.find((p) => p.name === "unstarted")],
          mockNetworkError
        );
        expect(screen.queryByTestId("state-type-map-view")).toBeInTheDocument();
        const saveElement = screen.getByText(/save/i);
        fireEvent.click(saveElement);

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        expect(screen.queryByTestId("state-type-map-view")).toBeNull();
      });

      test("it renders nothing and logs the error when there is a GraphQl error", async () => {
        await renderedDragDropConfig(
          <WorkItemStateTypeMapView
            instanceKey={projectKey}
            workItemSources={workItemSourcesFixture}
            enableEdits={true}
          />,
          5, // dropping to closed category
          (points) => [points.find((p) => p.name === "unstarted")],
          mockGraphQlErrors
        );

        expect(screen.queryByTestId("state-type-map-view")).toBeInTheDocument();
        const saveElement = screen.getByText(/save/i);
        fireEvent.click(saveElement);

        const inProgressElement = screen.getByText(/Processing.../i);
        expect(inProgressElement).toBeInTheDocument();

        await waitFor(() => expect(logGraphQlError).toHaveBeenCalled());
        expect(screen.queryByTestId("state-type-map-view")).toBeNull();
      });
    });
  });
});
