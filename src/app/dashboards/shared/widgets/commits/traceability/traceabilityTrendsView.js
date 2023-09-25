import React from 'react';
import {TraceabilityTrendsChart} from "./traceabilityTrendsChart";
import {VizItem, VizRow} from "../../../containers/layout";

import {Traceability, TraceabilityTarget} from "../../../components/flowStatistics/flowStatistics";


const TraceabilityStatisticView = (
  {
    title,
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
          title={title}
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
    title,
    target,
    displayBag={}
  }) => {
  // trends come back in descending order so this is canonical pattern to
  // extract the current and previous value.
  const [current, previous] = traceabilityTrends;

  if (displayBag.displayType === "trendsCompareCard") {
    return (
      <Traceability
        title={title}
        current={current}
        previous={previous}
        target={target}
        displayType={displayBag.displayType}
        displayProps={{measurementWindow: measurementWindow}}
      />
    );
  }

  return (
    asStatistic ?
      <TraceabilityStatisticView
        title={asStatistic.title}
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

