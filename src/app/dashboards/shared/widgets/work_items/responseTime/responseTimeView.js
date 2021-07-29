import React from "react";
import {AvgCycleTime, AvgDuration, AvgLatency} from "../../../components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../containers/layout";

export const ResponseTimeView = ({cycleMetricsTrends, cycleTimeTarget}) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }
  return (
    <VizRow>
      <VizItem w={1 / 3}>
        <AvgCycleTime currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
      </VizItem>
      <VizItem w={1 / 3}>
        <AvgDuration currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
      </VizItem>
      <VizItem w={1 / 3}>
        <AvgLatency currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
      </VizItem>
    </VizRow>
  );
};
