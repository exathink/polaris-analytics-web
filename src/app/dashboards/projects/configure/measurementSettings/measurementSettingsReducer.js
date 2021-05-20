import {actionTypes, mode} from "./constants";

export function measurementSettingsReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_FLOW_METRICS: {
      return {
        ...state,
        flowMetricsFlag: action.payload,
        mode:
          state.initialMeasurementSettings.includeSubTasksFlowMetrics !== action.payload ||
          state.initialMeasurementSettings.includeSubTasksWipInspector !== state.wipInspectorFlag
            ? mode.EDITING
            : mode.INIT,
      };
    }
    case actionTypes.UPDATE_WIP_INSPECTOR: {
      return {
        ...state,
        wipInspectorFlag: action.payload,
        mode:
          state.initialMeasurementSettings.includeSubTasksWipInspector !== action.payload ||
          state.initialMeasurementSettings.includeSubTasksFlowMetrics !== state.flowMetricsFlag
            ? mode.EDITING
            : mode.INIT,
      };
    }
    case actionTypes.RESET_MEASUREMENT_SETTINGS: {
      const updatedRecord = {
        flowMetricsFlag: state.initialMeasurementSettings.includeSubTasksFlowMetrics,
        wipInspectorFlag: state.initialMeasurementSettings.includeSubTasksWipInspector,
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
    case actionTypes.MUTATION_FAILURE: {
      return {
        ...state,
        mode: mode.ERROR,
        errorMessage: action.payload,
      };
    }
    case actionTypes.UPDATE_DEFAULTS: {
      return {
        ...state,
        flowMetricsFlag: action.payload.includeSubTasksFlowMetrics,
        wipInspectorFlag: action.payload.includeSubTasksWipInspector,
        initialMeasurementSettings: {
            includeSubTasksFlowMetrics: action.payload.includeSubTasksFlowMetrics,
            includeSubTasksWipInspector: action.payload.includeSubTasksWipInspector,
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
