import {GroupingSelector} from "../../../shared/components/groupingSelector/groupingSelector";
import React from "react";

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
          key: 'value-stream',
          display: 'Value Stream Mapping'
        },
        {
          key: 'flow-metrics',
          display: 'Flow Metrics Settings'
        },
      ]
    }
    initialValue={configTab}
    onGroupingChanged={(selected) => setConfigTab(selected)}
  />
);