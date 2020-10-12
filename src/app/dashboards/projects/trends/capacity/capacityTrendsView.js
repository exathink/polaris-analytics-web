import React from 'react';
import {CommitDaysCarousel, FlowStatistic} from "../../../shared/components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {CapacityTrendsChart} from "./capacityTrendsChart";

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
      <VizItem w={0.5}>
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
      <VizItem w={0.5}>
        <CommitDaysCarousel
          current={current}
          previous={previous}
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
    measurementPeriod,
    measurementWindow,
    asStatistic,
    view,
    target,
  }) => (
  asStatistic ?
    <ProjectCapacityTrendsStatsView
      {...{capacityTrends, measurementPeriod, measurementWindow, target}}
    />
    :
    <CapacityTrendsChart
      {...{
        capacityTrends,
        contributorDetail,
        cycleMetricsTrends,
        showContributorDetail,
        measurementPeriod,
        measurementWindow,
        target
      }}
    />
)