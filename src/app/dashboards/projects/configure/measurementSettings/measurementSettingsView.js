import {Checkbox, Alert} from "antd";
import React from "react";
import {logGraphQlError} from "../../../../components/graphql/utils";
import {useProjectUpdateSettings} from "../../shared/hooks/useQueryProjectUpdateSettings";
import {actionTypes, mode} from "./constants";
import {measurementSettingsReducer} from "./measurementSettingsReducer";
import styles from "./measurementSettings.module.css";
import Button from "../../../../../components/uielements/button";
import {InfoCard} from "../../../../components/misc/info";

const settingsInfo = [
  {
    id: "includeInFlowMetrics",
    title: "Include in Flow Metrics",
    info: (
      <>
        <p>
          If this checkbox is checked, then lead and cycle time for subtasks are included when calculating aggregate
          lead and cycle time for the value stream or team.
        </p>
        <p>
          We normally recommend that leave this box unchecked since subtasks tend to skew the metrics significantly
          since they are typically of much shorter duration that stories, tasks or bugs which represent more meaningful
          increments of customer value.
        </p>
      </>
    ),
  },
  {
    id: "showInWipInspector",
    title: "Show in Wip Inspector",
    info: (
      <>
        <p>
          Some teams find it useful to see subtasks level tracking for work in progress. Checking this box means that
          subtasks will show up on the Wip Dashboard in the Age vs Latency chart, even if they are not included in
          aggregate flow metrics.
        </p>
        <p>
          We recommend this box also remain unchecked in most cases since it adds to the noise and visual clutter on
          these dashboards.
        </p>
        <p>
          Note that regardless of the setting of this checkbox, if you map commits to a subtask, those commits will
          always show up on the commit timeline charts. We normally recommend that you not map commits to subtasks, but
          rather only to their parent tasks.
        </p>
        <p>
          It is more meaningful to track overall effort and costs at the level of the parent tasks rather than at the
          subtask level.
        </p>
      </>
    ),
  },
];

export function MeasurementSettingsView({instanceKey, includeSubTasksFlowMetrics, includeSubTasksWipInspector}) {
  const initialState = {
    flowMetricsFlag: includeSubTasksFlowMetrics,
    wipInspectorFlag: includeSubTasksWipInspector,
    initialMeasurementSettings: {includeSubTasksFlowMetrics, includeSubTasksWipInspector},
    mode: mode.INIT,
    errorMessage: "",
  };

  const [state, dispatch] = React.useReducer(measurementSettingsReducer, initialState);

  // mutation to update project analysis periods
  const [mutate, {loading, client}] = useProjectUpdateSettings({
    onCompleted: ({updateProjectSettings: {success, errorMessage}}) => {
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
        projectKey: instanceKey,
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

  function getInfoDrawer() {
    return (
      <div className={styles.infoDrawer} id="measurement-settings-info">
        <InfoCard
          drawerOptions={{
            getContainer: () => document.getElementById("measurement-settings-info"),
            placement: "left",
            width: "40vw",
          }}
          title={
            <p className={styles.settingsInfoTitle}>
              Specify how to treat subtasks in metrics and the application UI. This only applies to Value Streams that
              track work in Jira.
            </p>
          }
          drawerContent={
            <div className={styles.settingInfoItems}>
              {settingsInfo.map((item) => {
                return (
                  <div className={styles.itemWrapper} key={item.id}>
                    <div className={styles.title}>{item.title}</div>
                    <div className={styles["setting-info"]}>{item.info}</div>
                  </div>
                );
              })}
            </div>
          }
          className={""}
        />
      </div>
    );
  }

  return (
    <div className={styles.settingsViewWrapper}>
      <div className={styles.subtasks}>
        <div className={styles.buttonElements}>{getButtonElements()}</div>
      </div>
      <div className={styles.subtasksTitle}>
        <div>Subtasks</div>
        {getInfoDrawer()}
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
