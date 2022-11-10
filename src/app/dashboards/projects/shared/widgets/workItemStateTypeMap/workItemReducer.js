import {actionTypes, mode} from "./constants";

const isEmpty = (obj) => Object.keys(obj).length === 0;
// state has
// 1. workItemSource properties (key, name, workItemStateMappings)
// 2. mode
export function workItemReducer(state, action) {
  const {mode: _, errorMessage: _error, ...workItemSource} = state;
  // handle empty workItemSource case.
  if (isEmpty(workItemSource)) {
    return state;
  }

  switch (action.type) {
    case actionTypes.REPLACE_WORKITEM_SOURCE: {
      return {
        ...state,
        ...action.payload,
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
    case actionTypes.MUTATION_FAILURE: {
      return {
        ...state,
        mode: mode.FAILURE,
        errorMessage: action.payload,
      };
    }
    case actionTypes.SHOW_UNMAPPED_ERROR: {
      return {
        ...state,
        mode: mode.UNMAPPED_ERROR,
      };
    }
    case actionTypes.UPDATE_FLOW_TYPE: {
      return {
        ...state,
        flowTypeRecords: {
          ...state.flowTypeRecords,
          ...action.payload.keyValuePair
        },
      }
    }
    case actionTypes.UPDATE_WORKITEM_SOURCE: {
      const [[key, value]] = Object.entries(action.payload.keyValuePair);
      return {
        ...state,
        workItemStateMappings: state.workItemStateMappings.map((item) => {
          if (item.state === key) {
            return {...item, stateType: value};
          }
          return item;
        }),
        mode: mode.EDITING,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
