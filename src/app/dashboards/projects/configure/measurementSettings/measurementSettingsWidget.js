import React from "react";
import {MeasurementSettingsView} from "./measurementSettingsView";

export const MeasurementSettingsWidget = ({instanceKey, includeSubTasksFlowMetrics, includeSubTasksWipInspector}) => {
  return (
    <MeasurementSettingsView
      instanceKey={instanceKey}
      includeSubTasksFlowMetrics={includeSubTasksFlowMetrics}
      includeSubTasksWipInspector={includeSubTasksWipInspector}
    />
  );
};
