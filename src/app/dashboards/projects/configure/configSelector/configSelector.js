import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import React from "react";
export const CONFIG_TABS = {
  VALUE_STREAM: "value-stream",
  RESPONSE_TIME_SLA: "response-time-sla",
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
      ]
    }
    initialValue={configTab}
    onGroupingChanged={(selected) => setConfigTab(selected)}
  />
);