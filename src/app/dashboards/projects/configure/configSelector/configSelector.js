import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import React from "react";
export const CONFIG_TABS = {
  VALUE_STREAM: "value-stream",
  RESPONSE_TIME_SLA: "response-time-sla",
  MEASUREMENT_SETTINGS: "measurement-settings"
};

export const ConfigSelector = (
  {
    configTab,
    setConfigTab
  }) => (
  <GroupingSelector
    label={' '}
    groupings={
      [

        {
          key: CONFIG_TABS.VALUE_STREAM,
          display: 'Delivery Process Mapping'
        },
        {
          key: CONFIG_TABS.RESPONSE_TIME_SLA,
          display: 'Service Level Objectives'
        },
        {
          key: CONFIG_TABS.MEASUREMENT_SETTINGS,
          display: 'Value Stream Settings'
        },
      ]
    }
    initialValue={configTab}
    onGroupingChanged={(selected) => setConfigTab(selected)}
  />
);