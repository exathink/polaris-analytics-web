import React from 'react';
import {FlowStatistic, TotalActiveDays} from "../../../components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../containers/layout";
import {WorkBalanceTrendsChart} from "./workBalanceTrendsChart";

export const WorkBalanceTrendsStatsView = (
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

export const WorkBalanceTrendsView = (
  {
    context,
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
    onPointClick
  }) => (
  asStatistic ?
    <WorkBalanceTrendsStatsView
      {...{capacityTrends, measurementPeriod, measurementWindow, target}}
    />
    :
    <VizRow h={1}>
      <VizItem w={1}>
        <WorkBalanceTrendsChart
          {...{
            context,
            capacityTrends,
            contributorDetail,
            cycleMetricsTrends,
            showContributorDetail,
            showEffort,
            measurementPeriod,
            measurementWindow,
            target,
            view,
            chartConfig,
            onPointClick
          }}
        />
      </VizItem>
    </VizRow>
)