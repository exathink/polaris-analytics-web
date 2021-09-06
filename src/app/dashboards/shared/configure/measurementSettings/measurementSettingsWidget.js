import React from "react";
import {MeasurementSettingsView} from "./measurementSettingsView";

export const MeasurementSettingsWidget = ({dimension, instanceKey, includeSubTasksFlowMetrics, includeSubTasksWipInspector}) => {
  return (
    <MeasurementSettingsView
      dimension={dimension}
      instanceKey={instanceKey}
      includeSubTasksFlowMetrics={includeSubTasksFlowMetrics}
      includeSubTasksWipInspector={includeSubTasksWipInspector}
    />
  );
};
