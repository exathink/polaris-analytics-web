import React from 'react';
import {ResponseTimeTrendsChart} from "./responseTimeTrendsChart"
import {VizItem, VizRow} from "../../../../shared/containers/layout";

export const ProjectResponseTimeTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    measurementPeriod,
    measurementWindow,
    onSelectionChange,
    view
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <ResponseTimeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          leadTimeTarget={leadTimeTarget}
          cycleTimeTarget={cycleTimeTarget}
          targetPercentile={targetPercentile}
          onSelectionChange={onSelectionChange}
          view={view}
        />
      </VizItem>
    </VizRow>
)

