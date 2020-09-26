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
    primaryStatOnly,
    target,
  }) => {
  // trends come back in descending order so this is canonical pattern to
  // extract the current and previous value.
  const [current, previous] = traceabilityTrends;

  return (
    <VizRow h={"100%"}>
      <VizItem w={1}>
        {
          asStatistic ?
            <TraceabilityCarousel
              {...asStatistic}
              disabled={primaryStatOnly}
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

