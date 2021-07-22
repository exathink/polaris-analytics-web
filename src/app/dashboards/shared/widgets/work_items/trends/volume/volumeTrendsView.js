import React from 'react';
import {VolumeTrendsChart} from "./volumeTrendsChart";
import {VizItem, VizRow} from "../../../../containers/layout";

export const VolumeTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow,
    chartConfig,
    onSelectionChange,
    view
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <VolumeTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          chartConfig={chartConfig}
          view={view}
          onSelectionChange={onSelectionChange}
        />
      </VizItem>
    </VizRow>
)

