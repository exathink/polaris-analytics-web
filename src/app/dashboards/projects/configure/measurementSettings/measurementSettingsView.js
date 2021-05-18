import {Checkbox, Button} from "antd";
import React from "react";
import styles from "./measurementSettings.module.css";

export function MeasurementSettingsView({instanceKey, includeInFlowMetrics, includeInWipInspector}) {
  const [flowMetricsFlag, setFlowMetricsFlag] = React.useState(includeInFlowMetrics);
  const [wipInspectorFlag, setWipInspectorFlag] = React.useState(includeInWipInspector);

  function handleFlowMetricsChange(e) {
    setFlowMetricsFlag(e.target.checked);
  }

  function handleWipInspectorChange(e) {
    setWipInspectorFlag(e.target.checked);
  }

  function handleUpdateSettingsClick() {
    // add mutation related logic here
  }

  return (
    <div className={styles.settingsViewWrapper}>
      <div className={styles.subtasks}>Subtasks</div>
      <div className={styles.includeInFlowMetrics}>
        <Checkbox onChange={handleFlowMetricsChange} name="includeFlowMetrics" value={flowMetricsFlag}>
          Include in Flow Metrics
        </Checkbox>
      </div>
      <div className={styles.includeInWipInspector}>
        <Checkbox onChange={handleWipInspectorChange} name="includeWipInspector" value={wipInspectorFlag}>
          Show in Wip Inspector
        </Checkbox>
      </div>
      <Button type="primary" className={styles.updateSettingsButton} onClick={handleUpdateSettingsClick}>
        Update Settings
      </Button>
    </div>
  );
}
