import {actionTypes} from "./constants";

export function updateContributorReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_EXCLUDE_FROM_ANALYSIS: {
      return {
        ...state,
        excludeFromAnalysis: action.payload,
      };
    }
    case actionTypes.UPDATE_PARENT_CONTRIBUTOR_NAME: {
      return {
        ...state,
        parentContributorName: action.payload,
      };
    }
    case actionTypes.UPDATE_LOCAL_RECORDS: {
      return {
        ...state,
        localRecords: action.payload,
      };
    }
    case actionTypes.UPDATE_ERROR_MESSAGE: {
      return {
        ...state,
        errorMessage: action.payload,
      };
    }
    case actionTypes.UPDATE_SUCCESS_MESSAGE: {
      return {
        ...state,
        successMessage: action.payload,
      };
    }
    case actionTypes.UPDATE_TIMEOUT_EXECUTING: {
      return {
        ...state,
        timeOutExecuting: action.payload,
      };
    }
    case actionTypes.UPDATE_UNLINK_ALIASES: {
      return {
        ...state,
        unlinkAliases: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
