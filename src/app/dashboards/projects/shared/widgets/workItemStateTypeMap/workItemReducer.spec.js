import {actionTypes, mode} from "./constants";
import {workItemReducer} from "./workItemReducer";

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

describe("workItemReducer", () => {
  const currentWorkItemSource = workItemSourcesFixture[0];
  test("if UPDATE_WORKITEM_SOURCE action is dispatched, mode is changed to EDITING from INIT", () => {
    const actionType = actionTypes.UPDATE_WORKITEM_SOURCE;
    const keyValuePair = {unscheduled: "closed"};

    const input = {
      state: {
        workItemSources: [...workItemSourcesFixture],
        currentWorkItemSource: currentWorkItemSource,
        selectedIndex: 0,
        mode: mode.INIT,
      },
      action: {type: actionType, payload: {keyValuePair}},
    };

    const [[key, value]] = Object.entries(keyValuePair);
    const actual = {
      ...input.state,
      currentWorkItemSource: {
        ...currentWorkItemSource,
        workItemStateMappings: input.state.currentWorkItemSource.workItemStateMappings.map((item) => {
          if (item.state === key) {
            return {...item, stateType: value};
          }
          return item;
        }),
      },
      mode: mode.EDITING,
    };

    expect(workItemReducer(input.state, input.action)).toEqual(actual);
  });

  test("if CANCEL_EDIT_MODE action is dispatched, mode is changed to INIT from EDITING", () => {
    const actionType = actionTypes.CANCEL_EDIT_MODE;

    const input = {
      state: {
        workItemSources: [...workItemSourcesFixture],
        currentWorkItemSource: currentWorkItemSource,
        selectedIndex: 0,
        mode: mode.EDITING,
      },
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
      state: {
        workItemSources: [...workItemSourcesFixture],
        currentWorkItemSource: currentWorkItemSource,
        selectedIndex: 0,
        mode: mode.EDITING,
      },
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
      state: {
        workItemSources: [...workItemSourcesFixture],
        currentWorkItemSource: currentWorkItemSource,
        selectedIndex: 0,
        mode: mode.EDITING,
      },
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
      state: {
        workItemSources: [...workItemSourcesFixture],
        currentWorkItemSource: currentWorkItemSource,
        selectedIndex: 0,
        mode: mode.INIT,
      },
      action: {type: actionType, payload: {selectedIndex: 1, mode: "INIT"}},
    };

    const actual = {
      ...input.state,
      currentWorkItemSource: workItemSourcesFixture[1],
      selectedIndex: 1,
      mode: mode.INIT,
    };

    expect(workItemReducer(input.state, input.action)).toEqual(actual);
  });
});
