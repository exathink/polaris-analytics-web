import isEqual from "lodash/isEqual";

export const actionTypes = {
  UPDATE_BUDGET_RECORDS: "UPDATE_BUDGET_RECORDS",
  MUTATION_SUCCESS: "MUTATION_SUCCESS",
  MUTATION_FAILURE: "MUTATION_FAILURE",
  RESET: "RESET",
  CLOSE_SUCCESS_MODAL: "CLOSE_SUCCESS_MODAL",
  CLOSE_ERROR_MODAL: "CLOSE_ERROR_MODAL",
  UPDATE_DEFAULTS: "UPDATE_DEFAULTS"
};

export const mode = {
  INIT: "INIT",
  EDITING: "EDITING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

export function implementationCostReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_BUDGET_RECORDS: {
      const isEditingMode = !isEqual(action.payload, state.initialBudgetRecords);
      return {
        ...state,
        budgetRecords: action.payload,
        mode: isEditingMode ? mode.EDITING : mode.INIT,
      };
    }
    case actionTypes.MUTATION_SUCCESS: {
      return {
        ...state,
        mode: mode.SUCCESS,
        successMessage: action.payload,
      };
    }
    case actionTypes.MUTATION_FAILURE: {
      return {
        ...state,
        mode: mode.ERROR,
        errorMessage: action.payload,
      };
    }
    case actionTypes.RESET: {
      return {
        ...state,
        budgetRecords: state.initialBudgetRecords,
        mode: mode.INIT,
        errorMessage: "",
      };
    }
    case actionTypes.UPDATE_DEFAULTS: {
      return {
        ...state,
        budgetRecords: action.payload,
        initialBudgetRecords: action.payload,
        mode: mode.INIT
      };
    }
    case actionTypes.CLOSE_SUCCESS_MODAL: {
      return {
        ...state,
        successMessage: "",
        mode: mode.INIT,
      };
    }
    case actionTypes.CLOSE_ERROR_MODAL: {
      return {
        ...state,
        errorMessage: "",
        mode: mode.INIT,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
