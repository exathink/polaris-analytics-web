import {actionTypes, mode} from "./constants";

export function workItemReducer(state, action) {
  let {workItemSources, currentWorkItemSource, selectedIndex} = state;
  if (selectedIndex === null) {
    return state;
  }

  currentWorkItemSource = currentWorkItemSource || workItemSources[selectedIndex];
  // const latest = state.currentWorkItemSource.workItemStateMappings || currentWorkItemSource.workItemStateMappings;

  switch (action.type) {
    case actionTypes.REPLACE_WORKITEM_SOURCE: {
      const newWorkItemSource = workItemSources[action.payload.selectedIndex];
      return {
        ...state,
        currentWorkItemSource: {...newWorkItemSource},
        selectedIndex: action.payload.selectedIndex,
        mode: action.payload.mode,
      };
    }
    case actionTypes.CANCEL_EDIT_MODE: {
      return {
        ...state,
        mode: mode.INIT,
      };
    }
    case actionTypes.MUTATION_SUCCESS: {
      return {
        ...state,
        mode: mode.SUCCESS,
      };
    }
    case actionTypes.SHOW_UNMAPPED_ERROR: {
      return {
        ...state,
        mode: mode.UNMAPPED_ERROR,
      };
    }
    case actionTypes.UPDATE_WORKITEM_SOURCE: {
      const [[key, value]] = Object.entries(action.payload.keyValuePair);
      debugger;
      return {
        ...state,
        currentWorkItemSource: {
          ...currentWorkItemSource,
          workItemStateMappings: currentWorkItemSource.workItemStateMappings.map((item) => {
            if (item.state === key) {
              return {...item, stateType: value};
            }
            return item;
          }),
        },
        mode: mode.EDITING,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
