import React from 'react';
import {FlowStatistic} from "../../../../components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../../containers/layout";
import {percentage} from "../../../../../../helpers/utility";

import {FlowMixTrendsChart} from "./flowMixTrendsChart";

export const reduceFlowMix = (result, item) => {
  result[item.category] = item;
  if (result['total'] != null) {
    result['total'] = result['total'] + item[result.metric]
  } else {
    result['total'] = item[result.metric]
  }
  return result
}


export const ProjectFlowMixTrendsStatsView = (
  {
    flowMixTrends,
    measurementPeriod,
    measurementWindow,
    specsOnly,
    showCounts,
    asStatistic,
    target,
  }) => {
  const [current, previous] = flowMixTrends;
  const metric = specsOnly ? 'totalEffort' : 'workItemCount';
  const currentMix = current.flowMix.reduce(reduceFlowMix, {metric: metric});
  const previousMix = previous.flowMix.reduce(reduceFlowMix, {metric: metric});


  return (
    <VizRow h={"100%"}>
      <VizItem w={0.25}>
        <FlowStatistic
          title={'Features'}
          currentValue={currentMix.feature ? percentage(currentMix.feature[metric], currentMix.total) : 0}
          previousValue={previousMix.feature ? percentage(previousMix.feature[metric], previousMix.total) : 0}

          uom={'%'}
          precision={2}
          target={target}
        />
      </VizItem>
      <VizItem w={0.25}>
        <FlowStatistic
          title={'Defects'}
          currentValue={currentMix.defect ? percentage(currentMix.defect[metric], currentMix.total) : 0}
          previousValue={previousMix.defect ? percentage(previousMix.defect[metric], previousMix.total) : 0}
          uom={'%'}
          precision={2}
          target={target}
        />
      </VizItem>
      <VizItem w={0.25}>
        <FlowStatistic
          title={'Tasks'}
          currentValue={currentMix.task ? percentage(currentMix.task[metric], currentMix.total) : 0}
          previousValue={previousMix.task ? percentage(previousMix.task[metric], previousMix.total) : 0}
          uom={'%'}
          precision={2}
        />
      </VizItem>
    </VizRow>

  )
}

export const ProjectFlowMixTrendsView = (
  {
    flowMixTrends,
    measurementPeriod,
    measurementWindow,
    specsOnly,
    asStatistic,
    chartOptions,
    view,
    showCounts,
    target,
  }) => (
    asStatistic ?
      <ProjectFlowMixTrendsStatsView
        {...{flowMixTrends, measurementPeriod, measurementWindow, specsOnly, target}  }
      />
      :
      <FlowMixTrendsChart
        {...{flowMixTrends, measurementPeriod, measurementWindow, specsOnly, target, showCounts, chartOptions, view}  }
      />
)