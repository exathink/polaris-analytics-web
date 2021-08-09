import {actionTypes} from "./constants";

export function updateTeamsReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_LOCAL_RECORDS: {
      return {
        ...state,
        localRecords: action.payload,
      };
    }
    case actionTypes.UPDATE_CAPACITY_RECORDS: {
      return {
        ...state,
        capacityRecords: action.payload,
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
    case actionTypes.UPDATE_TARGET_TEAM: {
      return {
        ...state,
        targetTeam: action.payload,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
