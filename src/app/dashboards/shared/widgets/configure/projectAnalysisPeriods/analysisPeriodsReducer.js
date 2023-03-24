import {actionTypes, mode} from "./constants";

export function analysisPeriodsReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_WIP_PERIOD: {
      if (action.payload > state.flowPeriod) {
        return {
          ...state,
          mode: mode.ALERT,
          errorMessage: "wip analysis period can not be greater than flow analysis period."
        }
      }

      return {
        ...state,
        wipPeriod: action.payload,
        mode:
          state.initialAnalysisPeriods.wipAnalysisPeriod !== action.payload ||
          state.initialAnalysisPeriods.flowAnalysisPeriod !== state.flowPeriod ||
          state.initialAnalysisPeriods.trendsAnalysisPeriod !== state.trendsPeriod
            ? mode.EDITING
            : mode.INIT,
      };
    }
    case actionTypes.UPDATE_FLOW_PERIOD: {
      if (action.payload < state.wipPeriod) {
        return {
          ...state,
          mode: mode.ALERT,
          errorMessage: "flow analysis period can not be smaller than wip analysis period."
        }
      }
      if (action.payload > state.trendsPeriod) {
        return {
          ...state,
          mode: mode.ALERT,
          errorMessage: "flow analysis period can not be greater than trends analysis period."
        }
      }
      return {
        ...state,
        flowPeriod: action.payload,
        mode:
          state.initialAnalysisPeriods.flowAnalysisPeriod !== action.payload ||
          state.initialAnalysisPeriods.wipAnalysisPeriod !== state.wipPeriod ||
          state.initialAnalysisPeriods.trendsAnalysisPeriod !== state.trendsPeriod
            ? mode.EDITING
            : mode.INIT,
      };
    }
    case actionTypes.UPDATE_TRENDS_PERIOD: {
      if (action.payload < state.flowPeriod) {
        return {
          ...state,
          mode: mode.ALERT,
          errorMessage: "trends analysis period can not be smaller than flow analysis period."
        }
      }
      return {
        ...state,
        trendsPeriod: action.payload,
        mode:
          state.initialAnalysisPeriods.trendsAnalysisPeriod !== action.payload ||
          state.initialAnalysisPeriods.wipAnalysisPeriod !== state.wipPeriod ||
          state.initialAnalysisPeriods.flowAnalysisPeriod !== state.flowPeriod
            ? mode.EDITING
            : mode.INIT,
      };
    }
    case actionTypes.RESET_SLIDERS: {
      const updatedRecord = {
        wipPeriod: state.initialAnalysisPeriods.wipAnalysisPeriod,
        flowPeriod: state.initialAnalysisPeriods.flowAnalysisPeriod,
        trendsPeriod: state.initialAnalysisPeriods.trendsAnalysisPeriod,
        name: state.initialName,
        mode: mode.INIT,
      };

      return {
        ...state,
        ...updatedRecord,
      };
    }
    case actionTypes.UPDATE_NAME: {
      const updatedRecord = {
        name: action.payload,
        mode: state.initialName !== action.payload ? mode.EDITING : mode.INIT,
      };

      return {
        ...state,
        ...updatedRecord
      }
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
        mode: mode.ERROR,
        errorMessage: action.payload
      };
    }
    case actionTypes.UPDATE_DEFAULTS: {
      return {
        ...state,
        wipPeriod: action.payload.wipAnalysisPeriod,
        flowPeriod: action.payload.flowAnalysisPeriod,
        trendsPeriod: action.payload.trendsAnalysisPeriod,
        initialName: action.payload.name,
        name: action.payload.name,
        initialAnalysisPeriods: {
          wipAnalysisPeriod: action.payload.wipAnalysisPeriod,
          flowAnalysisPeriod: action.payload.flowAnalysisPeriod,
          trendsAnalysisPeriod: action.payload.trendsAnalysisPeriod,
        },
      };
    }
    case actionTypes.CLOSE_SUCCESS_MODAL: {
      return {
        ...state,
        mode: mode.INIT,
      };
    }
    case actionTypes.CLOSE_ALERT_MODAL: {
      return {
        ...state,
        errorMessage: "",
        mode:
        state.initialAnalysisPeriods.wipAnalysisPeriod !== state.wipPeriod ||
        state.initialAnalysisPeriods.flowAnalysisPeriod !== state.flowPeriod ||
        state.initialAnalysisPeriods.trendsAnalysisPeriod !== state.trendsPeriod
            ? mode.EDITING
            : mode.INIT,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
