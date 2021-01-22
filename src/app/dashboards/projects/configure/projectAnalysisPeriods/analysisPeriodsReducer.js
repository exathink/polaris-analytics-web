import {actionTypes, mode} from "./constants";

export function analysisPeriodsReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_WIP_PERIOD: {
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
        mode: mode.INIT,
      };

      return {
        ...state,
        ...updatedRecord,
      };
    }
    case actionTypes.MUTATION_SUCCESS: {
      return {
        ...state,
        mode: mode.SUCCESS,
      };
    }
    case actionTypes.UPDATE_DEFAULTS: {
      return {
        ...state,
        wipPeriod: action.payload.wipAnalysisPeriod,
        flowPeriod: action.payload.flowAnalysisPeriod,
        trendsPeriod: action.payload.trendsAnalysisPeriod,
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
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
