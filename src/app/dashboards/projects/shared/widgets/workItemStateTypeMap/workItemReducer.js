import {actionTypes, mode} from "./constants";

export function workItemReducer(state, action) {
  const {workItemSources} = state;
  if (workItemSources.length  > 0 ) {
    switch (action.type) {
      case actionTypes.REPLACE_WORKITEM_SOURCE: {
        const {selectedIndex} = action.payload;
        return {
          ...state,
          currentWorkItemSource: {...workItemSources[selectedIndex]},
          selectedIndex: selectedIndex,
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
        const currentWorkItemSource = state.workItemSources[state.selectedIndex];
        const [[key, value]] = Object.entries(action.payload.keyValuePair);

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

  return state;
}
