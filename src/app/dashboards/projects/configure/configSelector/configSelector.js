import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import React from "react";
export const CONFIG_TABS = {
  VALUE_STREAM: "value-stream",
  RESPONSE_TIME_SLA: "response-time-sla",
  ANALYSIS_PERIODS: "analysis-periods",
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
          display: 'Value Stream Mapping'
        },
        {
          key: CONFIG_TABS.RESPONSE_TIME_SLA,
          display: 'Response Time SLA'
        },
        {
          key: CONFIG_TABS.ANALYSIS_PERIODS,
          display: 'Analysis Periods'
        },
        {
          key: CONFIG_TABS.MEASUREMENT_SETTINGS,
          display: 'Measurement Settings'
        },
      ]
    }
    initialValue={configTab}
    onGroupingChanged={(selected) => setConfigTab(selected)}
  />
);