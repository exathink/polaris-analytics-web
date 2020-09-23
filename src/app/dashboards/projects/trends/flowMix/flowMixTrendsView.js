import React from 'react';
import {FlowStatistic} from "../../../shared/components/flowStatistics/flowStatistics";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {TrendIndicator} from "../../../../components/misc/statistic/statistic";

export const reduceFlowMix = (result, item) => {
  result[item.category] = item;
  if (result['total'] != null) {
    result['total'] = result['total'] + item[result.metric]
  } else {
    result['total'] = item[result.metric]
  }
  return result
}

export const ProjectFlowMixTrendsView = (
  {
    flowMixTrends,
    measurementPeriod,
    measurementWindow,
    specsOnly,
    asStatistic,
    target,
  }) => {
  const current = flowMixTrends.length > 0 ? flowMixTrends[0] : []
  const previous = flowMixTrends.length > 1 ? flowMixTrends[1] : [];
  const metric = specsOnly ? 'totalEffort' : 'workItemCount';
  const currentMix = current.flowMix.reduce(reduceFlowMix, {metric: metric});
  const previousMix = previous.flowMix.reduce(reduceFlowMix, {metric: metric});



  return (
    <VizRow h={"100%"}>
      <VizItem w={0.25}>
        <FlowStatistic
          title={'Features'}
          currentCycleMetrics={currentMix.feature}
          previousCycleMetrics={previousMix.feature}
          metric={metric}
          display={value => (value/(1.0*currentMix.total))*100}
          uom={'%'}
          precision={2}
          target={target}
      />
      </VizItem>
      <VizItem w={0.25}>
        <FlowStatistic
          title={'Defects'}
          currentCycleMetrics={currentMix.defect}
          previousCycleMetrics={previousMix.defect}
          metric={metric}
          display={value => (value/(1.0*currentMix.total))*100}
          uom={'%'}
          precision={2}
          target={target}
      />
      </VizItem>
      <VizItem w={0.25}>
        <FlowStatistic
          title={'Tasks'}
          currentCycleMetrics={currentMix.task}
          previousCycleMetrics={previousMix.task}
          metric={metric}
          display={value => (value/(1.0*currentMix.total))*100}
          uom={'%'}
          precision={2}


      />
      </VizItem>
    </VizRow>

  )
}

