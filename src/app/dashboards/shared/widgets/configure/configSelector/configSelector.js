import {GroupingSelector} from "../../../components/groupingSelector/groupingSelector";
import React from "react";
export const CONFIG_TABS = {
  DELIVERY_PROCESS_MAPPING: "delivery-process-mapping",
  VALUE_STREAMS: "value-streams",
  TIMEBOX_SETTINGS: "response-time-sla",
  MEASUREMENT_SETTINGS: "measurement-settings",
};

export const ConfigSelector = ({dimension, configTab, setConfigTab, settingsName="Measurement Settings"}) => {
  const valueStreamGrouping =
    dimension === "project"
      ? [
          {
            key: CONFIG_TABS.DELIVERY_PROCESS_MAPPING,
            display: "Delivery Process Mapping",
          },
          {
            key: CONFIG_TABS.VALUE_STREAMS,
            display: "Projects / Work Streams",
          },
        ]
      : [];

  const groupings = [
    ...valueStreamGrouping,

    {
      key: CONFIG_TABS.TIMEBOX_SETTINGS,
      display: "Stability Goal Settings",
    },
    {
      key: CONFIG_TABS.MEASUREMENT_SETTINGS,
      display: settingsName,
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
