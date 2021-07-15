import React from 'react';
import {FlowStatistic} from "../../../../components/flowStatistics/flowStatistics";
import {percentage} from "../../../../../../helpers/utility";

import {FlowMixTrendsChart} from "./flowMixTrendsChart";
import styles from "./flowMix.module.css";

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
    selectedMetricState
  }) => {
  const [current, previous] = flowMixTrends;
  const metric = specsOnly ? 'totalEffort' : 'workItemCount';
  const currentMix = current.flowMix.reduce(reduceFlowMix, {metric: metric});
  const previousMix = previous.flowMix.reduce(reduceFlowMix, {metric: metric});

  let [selectedMetricFeatureProps, selectedMetricDefectsProps, selectedMetricTasksProps] = [{}, {}, {}];
  if (selectedMetricState) {
    selectedMetricFeatureProps = {selectedMetric: selectedMetricState[0], setSelectedMetric: () => selectedMetricState[1]("features")};
    selectedMetricDefectsProps = {selectedMetric: selectedMetricState[0], setSelectedMetric: () => selectedMetricState[1]("defects")};
    selectedMetricTasksProps = {selectedMetric: selectedMetricState[0], setSelectedMetric: () => selectedMetricState[1]("tasks")};
  }
  return (
    <div className={styles.flowMixWrapper}>
      <div className={styles.features}>
        <FlowStatistic
          title={'Features'}
          currentValue={currentMix.feature ? percentage(currentMix.feature[metric], currentMix.total) : 0}
          previousValue={previousMix.feature ? percentage(previousMix.feature[metric], previousMix.total) : 0}
          uom={'%'}
          precision={2}
          target={target}
          metric="features"
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          {...selectedMetricFeatureProps}
          info={{headline: "", content: ""}}
        />
      </div>
      <div className={styles.defects}>
        <FlowStatistic
          title={'Defects'}
          currentValue={currentMix.defect ? percentage(currentMix.defect[metric], currentMix.total) : 0}
          previousValue={previousMix.defect ? percentage(previousMix.defect[metric], previousMix.total) : 0}
          uom={'%'}
          precision={2}
          target={target}
          metric="defects"
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          {...selectedMetricDefectsProps}
          info={{headline: "", content: ""}}
        />
      </div>
      <div className={styles.tasks}>
        <FlowStatistic
          title={'Tasks'}
          currentValue={currentMix.task ? percentage(currentMix.task[metric], currentMix.total) : 0}
          previousValue={previousMix.task ? percentage(previousMix.task[metric], previousMix.total) : 0}
          uom={'%'}
          precision={2}
          metric="tasks"
          asCard={true}
          currentMeasurement={current}
          previousMeasurement={previous}
          {...selectedMetricTasksProps}
          info={{headline: "", content: ""}}
        />
      </div>
    </div>

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
    selectedMetricState
  }) => (
    asStatistic ?
      <ProjectFlowMixTrendsStatsView
        {...{flowMixTrends, measurementPeriod, measurementWindow, specsOnly, target, selectedMetricState}  }
      />
      :
      <FlowMixTrendsChart
        {...{flowMixTrends, measurementPeriod, measurementWindow, specsOnly, target, showCounts, chartOptions, view}  }
      />
)