import React from 'react';
import {FlowStatistic, TotalActiveDays} from "../../../../shared/components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {EffortTrendsChart} from "./effortTrendsChart";

export const ProjectCapacityTrendsStatsView = (
  {
    capacityTrends,
    measurementPeriod,
    measurementWindow,
    asStatistic,
    target,
  }) => {
  const [current, previous] = capacityTrends;


  return (
    <VizRow h={"100%"}>
      <VizItem w={0.40}>
        <FlowStatistic
          title={'Contributors'}
          currentMeasurement={current}
          previousMeasurement={previous}
          metric={'contributorCount'}
          uom={' '}
          precision={0}
          target={target}
        />
      </VizItem>
      <VizItem w={0.60}>
        <TotalActiveDays
          currentMeasurement={current}
          previousMeasurement={previous}
          target={target}
        />
      </VizItem>
    </VizRow>

  )
}

export const ProjectCapacityTrendsView = (
  {
    capacityTrends,
    contributorDetail,
    cycleMetricsTrends,
    showContributorDetail,
    showEffort,
    measurementPeriod,
    measurementWindow,
    asStatistic,
    view,
    chartConfig,
    target,
  }) => (
  asStatistic ?
    <ProjectCapacityTrendsStatsView
      {...{capacityTrends, measurementPeriod, measurementWindow, target}}
    />
    :
    <VizRow h={1}>
      <VizItem w={1}>
        <EffortTrendsChart
          {...{
            capacityTrends,
            contributorDetail,
            cycleMetricsTrends,
            showContributorDetail,
            showEffort,
            measurementPeriod,
            measurementWindow,
            target,
            view,
            chartConfig
          }}
        />
      </VizItem>
    </VizRow>
)