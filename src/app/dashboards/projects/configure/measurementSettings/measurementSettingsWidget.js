import React from "react";
import {MeasurementSettingsView} from "./measurementSettingsView";

export const MeasurementSettingsWidget = ({instanceKey, includeInFlowMetrics, includeInWipInspector}) => {
  return (
    <MeasurementSettingsView
      instanceKey={instanceKey}
      includeInFlowMetrics={includeInFlowMetrics}
      includeInWipInspector={includeInWipInspector}
    />
  );
};
