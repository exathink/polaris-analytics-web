import { actionTypes, mode } from "./constants";

export function workItemReducer(state, action) {
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
    case actionTypes.SHOW_UNMAPPED_ERROR: {
      return {
        ...state,
        mode: mode.UNMAPPED_ERROR,
      };
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
