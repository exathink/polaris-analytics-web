import {actionTypes} from "./constants";
import {withChildren} from "./utils";

function getParentContributorKey(selectedRecords) {
  const recordWithChildren = selectedRecords.find(withChildren);
  if (recordWithChildren == null) {
    // inside this block only records with no children would be possible
    if (selectedRecords.length === 1) {
      return selectedRecords[0].key;
    } else {
      return "";
    }
  }
  return recordWithChildren.key;
}

export function contributorsReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_DAYS: {
      return {
        ...state,
        commitWithinDays: action.payload,
        selectedRecords: [], // anytime we update slider, selected records should clear
        parentContributorKey: "", // when selectedRecords are cleared, better to clear parentContributorKey as well
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
        parentContributorKey: "", // when selectedRecords are cleared, better to clear parentContributorKey as well
      };
    }
    case actionTypes.UPDATE_SELECTED_RECORDS: {
      const parentContributorKey = getParentContributorKey(action.payload);

      return {
        ...state,
        selectedRecords: action.payload,
        parentContributorKey: parentContributorKey,
      };
    }
    case actionTypes.UPDATE_PARENT_CONTRIBUTOR_KEY: {
      return {
        ...state,
        parentContributorKey: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
