import React from 'react';
import {TraceabilityTrendsChart} from "./traceabilityTrendsChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";

import {Traceability, TraceabilityTarget} from "../../../../shared/components/flowStatistics/flowStatistics";


const TraceabilityStatisticView = (
  {
    current,
    previous,
    target,
    primaryStatOnly
  }
) => (
  primaryStatOnly ?
    <VizRow h={"100%"}>
      <VizItem w={1}>
        <Traceability
          current={current}
          previous={previous}
          target={target}
        />
      </VizItem>
    </VizRow>
    :
    <VizRow h={"100%"}>
      <VizItem w={0.5}>
        <TraceabilityTarget
          target={target}
        />
      </VizItem>
      <VizItem w={0.5}>
        <Traceability
          title={'Actual'}
          current={current}
          previous={previous}
          target={target}
        />
      </VizItem>
    </VizRow>
);

const TraceabilityChartView = (
  {
    traceabilityTrends,
    measurementPeriod,
    measurementWindow,
    excludeMerges,
    target
  }
) => (
  <VizRow h={"100%"}>
    <VizItem w={1}>
      <TraceabilityTrendsChart
        traceabilityTrends={traceabilityTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        excludeMerges={excludeMerges}
        target={target}
      />
    </VizItem>
  </VizRow>
);


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
    asStatistic ?
      <TraceabilityStatisticView
        current={current}
        previous={previous}
        target={target}
        primaryStatOnly={primaryStatOnly}
      />
      :
      <TraceabilityChartView
        traceabilityTrends={traceabilityTrends}
        measurementPeriod={measurementPeriod}
        measurementWindow={measurementWindow}
        excludeMerges={excludeMerges}
        target={target}
        />
  )
}

