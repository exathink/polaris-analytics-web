import React from "react";
import {PredictabilityTrendsChart} from "./predictabilityTrendsChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {PredictabilityTrendsDetailDashboard} from "./predictabilityTrendsDetailDashboard";

export const ProjectPredictabilityTrendsView = ({
  instanceKey,
  flowMetricsTrends,
  targetPercentile,
  measurementPeriod,
  measurementWindow,
  cycleTimeTarget,
  samplingFrequency,
  latestWorkItemEvent,
  onSelectionChange,
  view,
  context,
}) => {
  if (view === "detail") {
    const props = {
      instanceKey,
      targetPercentile,
      measurementPeriod,
      measurementWindow,
      cycleTimeTarget,
      samplingFrequency,
      latestWorkItemEvent,
      view,
      context,
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
          latestWorkItemEvent={latestWorkItemEvent}
          onSelectionChange={onSelectionChange}
        />
      </VizItem>
    </VizRow>
  );
};
