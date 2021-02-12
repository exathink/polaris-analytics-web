import {actionTypes} from "./constants";

export function contributorsReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_DAYS: {
      return {
        ...state,
        commitWithinDays: action.payload,
        selectedRecords: [] // anytime we update slider, selected records should clear
      };
    }
    case actionTypes.UPDATE_CURRENT_STEP: {
      return {
        ...state,
        current: action.payload,
      };
    }
    case actionTypes.UPDATE_SELECTED_RECORDS: {
      return {
        ...state,
        selectedRecords: action.payload
      };
    }
    case actionTypes.UPDATE_PARENT_CONTRIBUTOR_KEY: {
      return {
        ...state,
        parentContributorKey: action.payload
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
