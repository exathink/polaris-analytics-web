import {Checkbox, Button, Alert} from "antd";
import React from "react";
import {logGraphQlError} from "../../../../components/graphql/utils";
import {useProjectUpdateSettings} from "../../shared/hooks/useQueryProjectUpdateSettings";
import styles from "./measurementSettings.module.css";

const STATUS = {
  IDLE: "IDLE",
  SUCCESS: "SUCCESS",
  FAILURE: "FAILURE",
};

export function MeasurementSettingsView({instanceKey, includeSubTasksFlowMetrics, includeSubTasksWipInspector}) {
  const [flowMetricsFlag, setFlowMetricsFlag] = React.useState(includeSubTasksFlowMetrics);
  const [wipInspectorFlag, setWipInspectorFlag] = React.useState(includeSubTasksWipInspector);

  const [state, setStatus] = React.useState({status: STATUS.IDLE, message: ""});

  // mutation to update project analysis periods
  const [mutate, {loading, client}] = useProjectUpdateSettings({
    onCompleted: ({updateProjectSettings: {success, errorMessage}}) => {
      if (success) {
        setStatus({status: STATUS.SUCCESS, message: "Updated Settings Successfully"});
        client.resetStore();
      } else {
        logGraphQlError("MeasurementSettingsView.useProjectUpdateSettings", errorMessage);
        setStatus({status: STATUS.FAILURE, message: errorMessage});
      }
    },
    onError: (error) => {
      logGraphQlError("MeasurementSettingsView.useProjectUpdateSettings", error);
      setStatus({status: STATUS.FAILURE, message: error});
    },
  });

  function handleFlowMetricsChange(e) {
    setFlowMetricsFlag(e.target.checked);
  }

  function handleWipInspectorChange(e) {
    setWipInspectorFlag(e.target.checked);
  }

  function handleUpdateSettingsClick() {
    // add mutation related logic here
    mutate({
      variables: {
        projectKey: instanceKey,
        flowMetricsSettings: {
          includeSubTasks: flowMetricsFlag,
        },
        wipInspectorSettings: {
          includeSubTasks: wipInspectorFlag,
        },
      },
    });
  }

  function getButtonElements() {
    // when mutation is executing
    if (loading) {
      return (
        <Button className={"shiftRight"} type="primary" loading>
          Processing...
        </Button>
      );
    }

    if (state.status === STATUS.SUCCESS) {
      return (
        <Alert
          message="Measurement settings updated successfully."
          type="success"
          showIcon
          closable
          className={styles["shiftRight"]}
          onClose={() => {}}
        />
      );
    }

    if (state.status === STATUS.FAILURE) {
      return (
        <Alert
          message={state.message}
          type="error"
          showIcon
          closable
          className={styles["shiftRight"]}
          onClose={() => {}}
        />
      );
    }
  }

  return (
    <div className={styles.settingsViewWrapper}>
      <div className={styles.subtasks}>
        <div className={styles.subtasksTitle}>Subtasks</div>
        <div className={styles.buttonElements}>{getButtonElements()}</div>
      </div>
      <div className={styles.includeInFlowMetrics}>
        <Checkbox onChange={handleFlowMetricsChange} name="includeFlowMetrics" checked={flowMetricsFlag}>
          Include in Flow Metrics
        </Checkbox>
      </div>
      <div className={styles.includeInWipInspector}>
        <Checkbox onChange={handleWipInspectorChange} name="includeWipInspector" checked={wipInspectorFlag}>
          Show in Wip Inspector
        </Checkbox>
      </div>
      <Button
        type="primary"
        className={styles.updateSettingsButton}
        onClick={handleUpdateSettingsClick}
        disabled={loading}
      >
        Update Settings
      </Button>
    </div>
  );
}
