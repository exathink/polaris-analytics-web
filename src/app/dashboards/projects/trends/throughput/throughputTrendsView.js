import React from 'react';
import {ThroughputTrendsChart} from "./throughputTrendsChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";

export const ProjectThroughputTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow,
    view
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <ThroughputTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          view={view}
        />
      </VizItem>
    </VizRow>
)

