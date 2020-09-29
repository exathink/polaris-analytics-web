import React from 'react';
import {ResponseTimeTrendsChart} from "./responseTimeTrendsChart"
import {VizItem, VizRow} from "../../../shared/containers/layout";

export const ProjectResponseTimeTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow,
    view
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <ResponseTimeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          view={view}
        />
      </VizItem>
    </VizRow>
)

