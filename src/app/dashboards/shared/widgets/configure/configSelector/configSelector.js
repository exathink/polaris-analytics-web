import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import React from "react";
export const CONFIG_TABS = {
  VALUE_STREAM: "value-stream",
  RESPONSE_TIME_SLA: "response-time-sla",
  MEASUREMENT_SETTINGS: "measurement-settings",
};

export const ConfigSelector = ({dimension, configTab, setConfigTab, settingsName="Measurement Settings"}) => {
  const valueStreamGrouping =
    dimension === "project"
      ? [
          {
            key: CONFIG_TABS.VALUE_STREAM,
            display: "Delivery Process Mapping",
          },
        ]
      : [];

  const groupings = [
    ...valueStreamGrouping,

    {
      key: CONFIG_TABS.MEASUREMENT_SETTINGS,
      display: settingsName,
    },
    {
      key: CONFIG_TABS.RESPONSE_TIME_SLA,
      display: "Response Time Targets",
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
