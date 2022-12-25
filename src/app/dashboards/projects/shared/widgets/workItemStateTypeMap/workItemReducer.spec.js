import {actionTypes, mode} from "./constants";
import {workItemReducer} from "./workItemReducer";
import {getInitialMapping} from "./workItemStateTypeMapView";

const workItemSourceFixture = {
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
};

describe("workItemReducer", () => {
  test("if UPDATE_WORKITEM_SOURCE action is dispatched, mode is changed to EDITING from INIT", () => {
    const actionType = actionTypes.UPDATE_WORKITEM_SOURCE;
    const keyValuePair = {unscheduled: "closed"};

    const input = {
      state: {...workItemSourceFixture, mode: mode.INIT, workItemSources: [workItemSourceFixture]},
      action: {type: actionType, payload: {keyValuePair}},
    };

    const [[key, value]] = Object.entries(keyValuePair);
    const actual = {
      ...input.state,
      workItemStateMappings: input.state.workItemStateMappings.map((item) => {
        if (item.state === key) {
          return {...item, stateType: value};
        }
        return item;
      }),
      mode: mode.EDITING,
    };

    expect(workItemReducer(input.state, input.action)).toEqual(actual);
  });

  test("if CANCEL_EDIT_MODE action is dispatched, mode is changed to INIT from EDITING", () => {
    const actionType = actionTypes.CANCEL_EDIT_MODE;

    const input = {
      state: {...workItemSourceFixture, mode: mode.EDITING, flowTypeRecords: getInitialMapping(workItemSourceFixture, "flowType"), releaseStatusRecords: getInitialMapping(workItemSourceFixture, "releaseStatus"), workItemSources: [workItemSourceFixture]},
      action: {type: actionType},
    };

    const actual = {
      ...input.state,
      mode: mode.INIT,
    };

    expect(workItemReducer(input.state, input.action)).toEqual(actual);
  });

  test("if MUTATION_SUCCESS action is dispatched, mode is changed to SUCCESS from EDITING", () => {
    const actionType = actionTypes.MUTATION_SUCCESS;

    const input = {
      state: {...workItemSourceFixture, mode: mode.EDITING, workItemSources: [workItemSourceFixture]},
      action: {type: actionType},
    };

    const actual = {
      ...input.state,
      mode: mode.SUCCESS,
    };

    expect(workItemReducer(input.state, input.action)).toEqual(actual);
  });

  test("if SHOW_UNMAPPED_ERROR action is dispatched, mode is changed to UNMAPPED_ERROR from EDITING", () => {
    const actionType = actionTypes.SHOW_UNMAPPED_ERROR;

    const input = {
      state: {...workItemSourceFixture, mode: mode.EDITING, workItemSources: [workItemSourceFixture]},
      action: {type: actionType},
    };

    const actual = {
      ...input.state,
      mode: mode.UNMAPPED_ERROR,
    };

    expect(workItemReducer(input.state, input.action)).toEqual(actual);
  });

  test("if REPLACE_WORKITEM_SOURCE action is dispatched, mode changes as per payload", () => {
    const actionType = actionTypes.REPLACE_WORKITEM_SOURCE;

    const input = {
      state: {...workItemSourceFixture, mode: mode.INIT, workItemSources: [workItemSourceFixture]},
      action: {type: actionType},
    };

    const actual = {
      ...input.state,
      mode: mode.INIT,
    };

    expect(workItemReducer(input.state, input.action)).toEqual(actual);
  });

});
