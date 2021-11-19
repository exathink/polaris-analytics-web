import {Alert, Checkbox} from "antd";
import React from "react";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {useDimensionUpdateSettings} from "../../../hooks/useQueryProjectUpdateSettings";
import {actionTypes, mode} from "./constants";
import {measurementSettingsReducer} from "./measurementSettingsReducer";
import styles from "./measurementSettings.module.css";
import Button from "../../../../../../components/uielements/button";
import {capitalizeFirstLetter} from "../../../../../helpers/utility";



export function MeasurementSettingsView({dimension, instanceKey, includeSubTasksFlowMetrics, includeSubTasksWipInspector}) {
  const initialState = {
    flowMetricsFlag: includeSubTasksFlowMetrics,
    wipInspectorFlag: includeSubTasksWipInspector,
    initialMeasurementSettings: {includeSubTasksFlowMetrics, includeSubTasksWipInspector},
    mode: mode.INIT,
    errorMessage: "",
  };

  const [state, dispatch] = React.useReducer(measurementSettingsReducer, initialState);

  // mutation to update project analysis periods
  const [mutate, {loading, client}] = useDimensionUpdateSettings({
    dimension: dimension,
    onCompleted: ({[`update${capitalizeFirstLetter(dimension)}Settings`]: {success, errorMessage}}) => {
      if (success) {
        dispatch({type: actionTypes.MUTATION_SUCCESS});
        client.resetStore();
      } else {
        logGraphQlError("MeasurementSettingsView.useProjectUpdateSettings", errorMessage);
        dispatch({type: actionTypes.MUTATION_FAILURE, payload: errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("MeasurementSettingsView.useProjectUpdateSettings", error);
      dispatch({type: actionTypes.MUTATION_FAILURE, payload: error.message});
    },
  });

    // after mutation is successful,we are invalidating active quries.
  // we need to update default settings from api response, this useEffect will serve the purpose.
  React.useEffect(() => {
    dispatch({
      type: actionTypes.UPDATE_DEFAULTS,
      payload: {includeSubTasksFlowMetrics, includeSubTasksWipInspector},
    });
  }, [includeSubTasksFlowMetrics, includeSubTasksWipInspector]);

  function handleFlowMetricsChange(e) {
    dispatch({type: actionTypes.UPDATE_FLOW_METRICS, payload: e.target.checked});
  }

  function handleWipInspectorChange(e) {
    dispatch({type: actionTypes.UPDATE_WIP_INSPECTOR, payload: e.target.checked});
  }

  function handleSaveClick() {
    // add mutation related logic here
    mutate({
      variables: {
        instanceKey: instanceKey,
        flowMetricsSettings: {
          includeSubTasks: state.flowMetricsFlag,
        },
        wipInspectorSettings: {
          includeSubTasks: state.wipInspectorFlag,
        },
      },
    });
  }

  function handleCancelClick() {
    dispatch({type: actionTypes.RESET_MEASUREMENT_SETTINGS});
  }

  function getButtonElements() {
    // when mutation is executing
    if (loading) {
      return (
        <Button className={styles.shiftRight} type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.mode === mode.EDITING) {
      return (
        <>
          <Button
            onClick={handleSaveClick}
            className={styles.measurementSave}
            type="primary"
            size="small"
            shape="round"
          >
            Save
          </Button>
          <Button onClick={handleCancelClick} type="default" size="small" shape="round">
            Cancel
          </Button>
        </>
      );
    }

    if (state.mode === mode.SUCCESS) {
      return (
        <Alert
          message="Measurement settings updated successfully."
          type="success"
          showIcon
          closable
          className={styles.shiftRight}
          onClose={() => dispatch({type: actionTypes.CLOSE_SUCCESS_MODAL})}
        />
      );
    }

    if (state.mode === mode.ERROR) {
      return (
        <Alert
          message={state.errorMessage}
          type="error"
          showIcon
          closable
          className={styles.shiftRight}
          onClose={() => dispatch({type: actionTypes.RESET_MEASUREMENT_SETTINGS})}
        />
      );
    }
  }



  return (
    <div className={styles.settingsViewWrapper}>
      <div className={styles.subtasks}>
        <div className={styles.buttonElements}>{getButtonElements()}</div>
      </div>
      <div className={styles.subtasksTitle}>
        <div>Subtasks</div>

      </div>
      
      <div className={styles.settings}>
        <div className={styles.includeInFlowMetrics}>
          <Checkbox onChange={handleFlowMetricsChange} name="includeFlowMetrics" checked={state.flowMetricsFlag}>
            Include in Flow Metrics
          </Checkbox>
        </div>
        <div className={styles.includeInWipInspector}>
          <Checkbox onChange={handleWipInspectorChange} name="includeWipInspector" checked={state.wipInspectorFlag}>
            Show in Wip Inspector
          </Checkbox>
        </div>
      </div>
    </div>
  );
}
