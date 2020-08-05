import React from 'react';
import {TraceabilityTrendsChart} from "./traceabilityTrendsChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";

export const ProjectTraceabilityTrendsView = ({
    traceabilityTrends,
    measurementPeriod,
    measurementWindow
  }) => (
    <VizRow h={1}>
      <VizItem w={1}>
        <TraceabilityTrendsChart
          traceabilityTrends={traceabilityTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
        />
      </VizItem>
    </VizRow>
)

