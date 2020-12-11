import React from "react";
import {renderWithMockedProvider} from "../../../../../framework/viz/charts/chart-test-utils";
import {actionTypes} from "./constants";
import {WorkItemStateTypeMapView} from "./workItemStateTypeMapView";
import {workItemReducer as workItemReducerMock} from "./workItemReducer";
import {waitFor} from "@testing-library/react";

jest.mock("./workItemReducer", () => {
  return {
    workItemReducer: jest.fn((state, action) => state),
  };
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
async function renderedDropPointConfig(component, dropCategoryIndex, mapper = (point) => point) {
  const {
    chart: {series},
  } = await renderWithMockedProvider(component);
  // get the points from single point series, filter out last series(pedestal series).
  const points = series.filter((s, i, arr) => i !== arr.length - 1).map((s) => s.points[0]);

  const {
    plotOptions: {
      series: {
        point: {
          events: {drop},
        },
      },
    },
  } = (await renderWithMockedProvider(component)).chartConfig;

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
      // return argurments(state, action) of workItemReducer
      return [workItemReducerMock.mock.calls[i][0], workItemReducerMock.mock.calls[i][1]];
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

describe.only("WorkItemStateTypeMapView", () => {
  // empty workItemSources case has been handled at the widget level,
  // here we can assume we will always have workItemSources.
  describe("when there are no mappings available for workItemSource", () => {
    const workItemSourcesWithEmptyMappings = workItemSourcesFixture.map((w) => ({...w, workItemStateMappings: []}));

    test("it renders without an error", async () => {
      await renderWithMockedProvider(
        <WorkItemStateTypeMapView
          instanceKey={projectKey}
          workItemSources={workItemSourcesWithEmptyMappings}
          view="detail"
        />
      );
    });

    it("renders first workItemSource as initial selected value for dropdown on the component", async () => {
      const {getByText} = await renderWithMockedProvider(
        <WorkItemStateTypeMapView instanceKey={projectKey} workItemSources={workItemSourcesWithEmptyMappings} />
      );

      expect(getByText(/Polaris Platform/i)).toBeInTheDocument();
    });
  });

  describe("should drag work item state to its desired phase", () => {
    const cases = ["unscheduled", "planned", "unstarted", "started", "delivered", "created", "finished"]; // closed is the drop target
    cases.forEach((workItemState) => {
      test(`it drags point with name ${workItemState} to target category closed`, async () => {
        const [[_, action]] = await renderedDropPointConfig(
          <WorkItemStateTypeMapView instanceKey={projectKey} workItemSources={workItemSourcesFixture} />,
          5, // dropping to closed category
          (points) => [points.find((p) => p.name === workItemState)] // point to be dragged should belong to different category.
        );

        expect(action.type).toBe(actionTypes.UPDATE_WORKITEM_SOURCE);
        expect(action.payload).toHaveProperty("keyValuePair");
        expect(action.payload.keyValuePair).toMatchObject({[workItemState]: "closed"});
      });
    });
  });
});
