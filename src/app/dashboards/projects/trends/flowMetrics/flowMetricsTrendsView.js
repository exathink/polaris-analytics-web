import React from 'react';
import {CycleMetricsTrendsChart} from "./cycleMetricsTrendsChart"
import {ThroughputTrendsChart} from "./throughputTrendsChart";
import {CycleMetricsTrendsBoxPlotChart} from "./cycleMetricsTrendsBoxPlotChart"
import {Flex} from 'reflexbox';
import {VizRow, VizItem} from "../../../shared/containers/layout";

export const ProjectFlowMetricsTrendsView = ({
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow
  }) => (
    <VizRow h={1}>
      <VizItem w={0.3}>
        <ThroughputTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
      <VizItem w={0.3}>
        <CycleMetricsTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
      <VizItem w={0.3}>
        <CycleMetricsTrendsBoxPlotChart
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
    </VizRow>
)

