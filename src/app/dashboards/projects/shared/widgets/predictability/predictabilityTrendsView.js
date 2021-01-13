import React from 'react';
import {PredictabilityTrendsChart} from "./predictabilityTrendsChart"
import {VizItem, VizRow} from "../../../../shared/containers/layout";

export const ProjectPredictabilityTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow,
    cycleTimeTarget,
    view,
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <PredictabilityTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          cycleTimeTarget={cycleTimeTarget}
          view={view}
        />
      </VizItem>
    </VizRow>
)

