import {releaseActionTypes, mode} from "./constants";

export function releaseSettingReducer(state, action) {
  switch (action.type) {
    case releaseActionTypes.UPDATE_RELEASE_SETTING: {
      return {
        ...state,
        releaseSetting: action.payload,
        mode: state.initialReleaseSetting !== action.payload ? mode.EDITING : mode.INIT,
      };
    }
    case releaseActionTypes.RESET_RELEASE_SETTING: {
      const updatedRecord = {
        releaseSetting: state.initialReleaseSetting,
        mode: mode.INIT,
      };

      return {
        ...state,
        ...updatedRecord,
      };
    }
    case releaseActionTypes.MUTATION_SUCCESS: {
      return {
        ...state,
        mode: mode.SUCCESS,
      };
    }
    case releaseActionTypes.MUTATION_FAILURE: {
      return {
        ...state,
        mode: mode.ERROR,
        errorMessage: action.payload,
      };
    }
    case releaseActionTypes.UPDATE_DEFAULTS: {
      return {
        ...state,
        releaseSetting: action.payload,
        initialReleaseSetting: action.payload,
      };
    }
    case releaseActionTypes.CLOSE_SUCCESS_MODAL: {
      return {
        ...state,
        mode: mode.INIT,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
