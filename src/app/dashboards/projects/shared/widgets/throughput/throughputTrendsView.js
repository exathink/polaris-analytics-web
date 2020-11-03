import React from 'react';
import {VolumeTrendsChart} from "./throughputTrendsChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";

export const ProjectVolumeTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow,
    view
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <VolumeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          view={view}
        />
      </VizItem>
    </VizRow>
)

