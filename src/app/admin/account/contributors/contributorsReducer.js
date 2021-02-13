import {actionTypes} from "./constants";

export function contributorsReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_DAYS: {
      return {
        ...state,
        commitWithinDays: action.payload,
        selectedRecords: [], // anytime we update slider, selected records should clear
        parentContributorKey: "" // when selectedRecords are cleared, better to clear parentContributorKey as well
      };
    }
    case actionTypes.UPDATE_CURRENT_STEP: {
      return {
        ...state,
        current: action.payload,
      };
    }
    case actionTypes.NAVIGATE_AFTER_SUCCESS: {
      return {
        ...state,
        current: 0,
        selectedRecords: [], // after mutation success, selected records should clear
        parentContributorKey: "" // when selectedRecords are cleared, better to clear parentContributorKey as well
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
