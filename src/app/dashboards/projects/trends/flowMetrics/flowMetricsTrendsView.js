import React from 'react';
import {CycleMetricsTrendsChart} from "./cycleMetricsTrendsChart"
import {CycleMetricsTrendsBoxPlotChart} from "./cycleMetricsTrendsBoxPlotChart"
import {VizItem, VizRow} from "../../../shared/containers/layout";

export const ProjectFlowMetricsTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow
  }) => (
    <VizRow h={1}>

      <VizItem w={0.5}>
        <CycleMetricsTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
      <VizItem w={0.5}>
        <CycleMetricsTrendsBoxPlotChart
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
    </VizRow>
)

