import React from 'react';
import {TraceabilityTrendsChart} from "./traceabilityTrendsChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";

export const ProjectTraceabilityTrendsView = (
  {
    traceabilityTrends,
    measurementPeriod,
    measurementWindow,
    excludeMerges,
  }) => {

  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <TraceabilityTrendsChart
          traceabilityTrends={traceabilityTrends}
          measurementPeriod={measurementPeriod}
          measurementWindow={measurementWindow}
          excludeMerges={excludeMerges}
        />
      </VizItem>
    </VizRow>

  )
}

