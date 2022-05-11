import React from "react";
import {
  AvgCycleTime,
  AvgDuration,
  AvgLatency,
  AvgLeadTime,
  FlowEfficiency
} from "../../../components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../containers/layout";

export const ResponseTimeView = ({cycleMetricsTrends, cycleTimeTarget, leadTimeTarget, display}) => {
  const [current, previous] = cycleMetricsTrends;
  if (current == null || previous == null) {
    return null;
  }

  switch (display) {
    case "responseTimeSummary": {
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
    }
    case "leadAndCycleTimeSummary": {
      return (
        <VizRow>
          <VizItem w={1 / 3}>
            <AvgLeadTime currentMeasurement={current} previousMeasurement={previous} target={leadTimeTarget} />
          </VizItem>
          <VizItem w={1 / 2}>
            <AvgCycleTime currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          </VizItem>
        </VizRow>
      );
    }
    case "leadCycleTimeFlowEfficiencySummary": {
      return (
        <VizRow>
          <VizItem w={1 / 3}>
            <AvgLeadTime currentMeasurement={current} previousMeasurement={previous} target={leadTimeTarget} />
          </VizItem>
          <VizItem w={1 / 2}>
            <AvgCycleTime currentMeasurement={current} previousMeasurement={previous} target={cycleTimeTarget} />
          </VizItem>
          <VizItem w={1 / 2}>
            <FlowEfficiency currentMeasurement={current} previousMeasurement={previous} target={70} />
          </VizItem>
        </VizRow>
      );
    }
    default: {
      return "Error: A valid value for required prop 'display' was not provided";
    }
  }
};
