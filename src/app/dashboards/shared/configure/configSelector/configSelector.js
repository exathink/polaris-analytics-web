import {GroupingSelector} from "../../components/groupingSelector/groupingSelector";
import React from "react";
export const CONFIG_TABS = {
  VALUE_STREAM: "value-stream",
  RESPONSE_TIME_SLA: "response-time-sla",
  MEASUREMENT_SETTINGS: "measurement-settings",
};

export const ConfigSelector = ({dimension, configTab, setConfigTab}) => {
  const valueStreamGrouping =
    dimension === "project"
      ? [
          {
            key: CONFIG_TABS.VALUE_STREAM,
            display: "Value Stream Mapping",
          },
        ]
      : [];

  const groupings = [
    ...valueStreamGrouping,
    {
      key: CONFIG_TABS.RESPONSE_TIME_SLA,
      display: "Response Time SLA",
    },
    {
      key: CONFIG_TABS.MEASUREMENT_SETTINGS,
      display: "Measurement Settings",
    },
  ];

  return (
    <GroupingSelector
      label={" "}
      groupings={groupings}
      initialValue={configTab}
      onGroupingChanged={(selected) => setConfigTab(selected)}
    />
  );
};
