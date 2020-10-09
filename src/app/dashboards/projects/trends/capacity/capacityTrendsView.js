import React from 'react';
import {FlowStatistic} from "../../../shared/components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {percentage} from "../../../../helpers/utility";

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
        <FlowStatistic
          title={'Commit Days'}
          currentMeasurement={current}
          previousMeasurement={previous}
          metric={'avgCommitDays'}
          uom={' '}
          precision={1}
          target={target}
        />
      </VizItem>
    </VizRow>

  )
}

export const ProjectCapacityTrendsView = (
  {
    capacityTrends,
    measurementPeriod,
    measurementWindow,
    asStatistic,
    view,
    showCounts,
    target,
  }) => (
    asStatistic ?
      <ProjectCapacityTrendsStatsView
        {...{capacityTrends, measurementPeriod, measurementWindow, target}  }
      />
      :
      null
)