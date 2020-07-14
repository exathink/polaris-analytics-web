import React from 'react';
import {CycleMetricsTrendsChart} from "./cycleMetricsTrendsChart"
import {ThroughputTrendsChart} from "./throughputTrendsChart";
import {Flex} from 'reflexbox';
import {VizRow, VizItem} from "../../../shared/containers/layout";

export const ProjectFlowMetricsTrendsView = ({
    flowMetricsTrends,
    measurementPeriod,
    measurementWindow
  }) => (
    <VizRow h={1}>
      <VizItem w={0.5}>
        <ThroughputTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
      <VizItem w={0.5}>
        <CycleMetricsTrendsChart
          flowMetricsTrends={flowMetricsTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
    </VizRow>
)

