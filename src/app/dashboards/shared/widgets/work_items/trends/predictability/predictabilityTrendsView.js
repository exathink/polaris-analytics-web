import React from "react";
import {PredictabilityTrendsChart} from "./predictabilityTrendsChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {PredictabilityTrendsDetailDashboard} from "./predictabilityTrendsDetailDashboard";

export const PredictabilityTrendsView = ({
  dimension,
  instanceKey,
  flowMetricsTrends,
  targetPercentile,
  measurementPeriod,
  measurementWindow,
  cycleTimeTarget,
  leadTimeTarget,
  cycleTimeConfidenceTarget,
  leadTimeConfidenceTarget,
  samplingFrequency,
  latestWorkItemEvent,
  onSelectionChange,
  view,
  context,
  specsOnly,
  includeSubTasks
}) => {
  if (view === "detail") {
    const props = {
      dimension,
      instanceKey,
      targetPercentile,
      measurementPeriod,
      measurementWindow,
      cycleTimeTarget,
      leadTimeTarget,
      cycleTimeConfidenceTarget,
      leadTimeConfidenceTarget,
      samplingFrequency,
      latestWorkItemEvent,
      view,
      context,
      includeSubTasks
    };
    return <PredictabilityTrendsDetailDashboard {...props} />;
  }

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <PredictabilityTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          cycleTimeTarget={cycleTimeTarget}
          view={view}
          specsOnly={specsOnly}
          latestWorkItemEvent={latestWorkItemEvent}
          onSelectionChange={onSelectionChange}
        />
      </VizItem>
    </VizRow>
  );
};
