import React from 'react';
import {CycleMetricsTrendsChart} from "./cycleMetricsTrendsChart"
import {VizItem, VizRow} from "../../../shared/containers/layout";

export const ProjectCycleTimeTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <CycleMetricsTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
    </VizRow>
)

