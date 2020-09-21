import React from 'react';
import {TraceabilityTrendsChart} from "./traceabilityTrendsChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";

import {TraceabilityCarousel} from "../../../shared/components/flowStatistics/flowStatistics";

export const ProjectTraceabilityTrendsView = (
  {
    traceabilityTrends,
    measurementPeriod,
    measurementWindow,
    excludeMerges,
    asStatistic,
    target,
  }) => {
  const current = traceabilityTrends.length > 0 ? traceabilityTrends[traceabilityTrends.length - 1] : null
  const previous = traceabilityTrends.length > 1 ? traceabilityTrends[traceabilityTrends.length - 2] : null;
  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        {
          asStatistic ?
            <TraceabilityCarousel
              {...asStatistic}
              current={current}
              previous={previous}
              target={target}
            />
            :
          <TraceabilityTrendsChart
            traceabilityTrends={traceabilityTrends}
            measurementPeriod={measurementPeriod}
            measurementWindow={measurementWindow}
            excludeMerges={excludeMerges}
          />
        }
      </VizItem>
    </VizRow>

  )
}

