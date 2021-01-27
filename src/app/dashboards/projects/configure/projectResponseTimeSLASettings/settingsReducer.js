import {actionTypes, METRICS, mode} from "./constants";

export function settingsReducer(state, action) {
  switch (action.type) {
    case actionTypes.UPDATE_METRIC: {
      return {
        ...state,
        selectedMetric: action.payload,
      };
    }
    case actionTypes.UPDATE_TARGET: {
      const {selectedMetric} = state;
      let updatedRecord;
      if (selectedMetric === METRICS.LEAD_TIME) {
        updatedRecord = {
          leadTime: {
            ...state.leadTime,
            target: action.payload,
          },
          mode:
            state.leadTime.initialTarget !== action.payload ||
            state.leadTime.initialConfidence !== state.leadTime.confidence ||
            state.cycleTime.initialTarget !== state.cycleTime.target ||
            state.cycleTime.initialConfidence !== state.cycleTime.confidence
              ? mode.EDITING
              : mode.INIT,
        };
      } else {
        updatedRecord = {
          cycleTime: {
            ...state.cycleTime,
            target: action.payload,
          },
          mode:
            state.cycleTime.initialTarget !== action.payload ||
            state.cycleTime.initialConfidence !== state.cycleTime.confidence ||
            state.leadTime.initialTarget !== state.leadTime.target ||
            state.leadTime.initialConfidence !== state.leadTime.confidence
              ? mode.EDITING
              : mode.INIT,
        };
      }

      return {
        ...state,
        ...updatedRecord,
      };
    }
    case actionTypes.UPDATE_CONFIDENCE: {
      const {selectedMetric} = state;
      let updatedRecord;
      if (selectedMetric === METRICS.LEAD_TIME) {
        updatedRecord = {
          leadTime: {
            ...state.leadTime,
            confidence: action.payload,
          },
          mode:
            state.leadTime.initialConfidence !== action.payload ||
            state.leadTime.initialTarget !== state.leadTime.target ||
            state.cycleTime.initialConfidence !== state.cycleTime.confidence ||
            state.cycleTime.initialTarget !== state.cycleTime.target
              ? mode.EDITING
              : mode.INIT,
        };
      } else {
        updatedRecord = {
          cycleTime: {
            ...state.cycleTime,
            confidence: action.payload,
          },
          mode:
            state.cycleTime.initialConfidence !== action.payload ||
            state.cycleTime.initialTarget !== state.cycleTime.target ||
            state.leadTime.initialConfidence !== state.leadTime.confidence ||
            state.leadTime.initialTarget !== state.leadTime.target
              ? mode.EDITING
              : mode.INIT,
        };
      }

      return {
        ...state,
        ...updatedRecord,
      };
    }
    case actionTypes.RESET_SLIDERS: {
      const updatedRecord = {
        leadTime: {
          ...state.leadTime,
          target: state.leadTime.initialTarget,
          confidence: state.leadTime.initialConfidence,
        },
        cycleTime: {
          ...state.cycleTime,
          target: state.cycleTime.initialTarget,
          confidence: state.cycleTime.initialConfidence,
        },
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
        errorMessage: action.payload
      };
    }
    case actionTypes.UPDATE_DEFAULTS: {
      return {
        ...state,
        leadTime: {
          ...state.leadTime,
          target: action.payload.leadTimeTarget,
          confidence: action.payload.leadTimeConfidenceTarget,
          initialTarget: action.payload.leadTimeTarget,
          initialConfidence: action.payload.leadTimeConfidenceTarget,
        },
        cycleTime: {
          ...state.cycleTime,
          target: action.payload.cycleTimeTarget,
          confidence: action.payload.cycleTimeConfidenceTarget,
          initialTarget: action.payload.cycleTimeTarget,
          initialConfidence: action.payload.cycleTimeConfidenceTarget,
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
