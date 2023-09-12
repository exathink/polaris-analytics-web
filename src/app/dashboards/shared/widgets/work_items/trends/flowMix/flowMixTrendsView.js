import React from "react";
import { FlowStatistic } from "../../../../components/flowStatistics/flowStatistics";
import { percentage } from "../../../../../../helpers/utility";

import { FlowMixTrendsChart } from "./flowMixTrendsChart";
import styles from "./flowMix.module.css";
import { TrendIndicator } from "../../../../../../components/misc/statistic/statistic";

export const reduceFlowMix = (result, item) => {
  result[item.category] = item;
  if (result["total"] != null) {
    result["total"] = result["total"] + item[result.metric];
  } else {
    result["total"] = item[result.metric];
  }
  return result;
};


export const ProjectFlowMixTrendsStatsView = ({
                                                flowMixTrends,
                                                measurementPeriod,
                                                measurementWindow,
                                                specsOnly,
                                                showCounts,
                                                asStatistic,
                                                asCard = true,
                                                target
                                              }) => {
  const [current, previous] = flowMixTrends;
  const metric = specsOnly ? "totalEffort" : "workItemCount";
  const currentMix = current.flowMix.reduce(reduceFlowMix, { metric: metric });
  const previousMix = previous.flowMix.reduce(reduceFlowMix, { metric: metric });

  return (
    <div className={styles.flowMixWrapper}>
      <div className={styles.features}>
        <FlowStatistic
          title={"New Development"}
          currentValue={currentMix.feature ? percentage(currentMix.feature[metric], currentMix.total) : 0}
          previousValue={previousMix.feature ? percentage(previousMix.feature[metric], previousMix.total) : 0}
          valueRender={value => `${value?.toFixed?.(2)}%`}
          precision={2}
          target={target}
          displayType={asCard ? "card" : "statistic"}
          displayProps={{ info: { headline: "", content: "" }, size: "small" }}
          currentMeasurement={{ ...current, measurementWindow: measurementWindow }}
          previousMeasurement={previous}
        />
      </div>
      <div className={styles.defects}>
        <FlowStatistic
          title={"Defects"}
          currentValue={currentMix.defect ? percentage(currentMix.defect[metric], currentMix.total) : 0}
          previousValue={previousMix.defect ? percentage(previousMix.defect[metric], previousMix.total) : 0}
          valueRender={value => `${value?.toFixed?.(2)}%`}
          precision={2}
          target={target}
          displayType={asCard ? "card" : "statistic"}
          displayProps={{ info: { headline: "", content: "" }, size: "small" }}
          currentMeasurement={{ ...current, measurementWindow: measurementWindow }}
          previousMeasurement={previous}
          good={TrendIndicator.isNegative}
        />
      </div>
      <div className={styles.tasks}>
        <FlowStatistic
          title={"Platform/Maintenance"}
          currentValue={currentMix.task ? percentage(currentMix.task[metric], currentMix.total) : 0}
          previousValue={previousMix.task ? percentage(previousMix.task[metric], previousMix.total) : 0}
          valueRender={value => `${value?.toFixed?.(2)}%`}
          precision={2}
          displayType={asCard ? "card" : "statistic"}
          displayProps={{ info: { headline: "", content: "" }, size: "small" }}
          currentMeasurement={{ ...current, measurementWindow: measurementWindow }}
          previousMeasurement={previous}
        />
      </div>
    </div>
  );
};

export const ProjectFlowMixTrendsView = (
  {
    data,
    dimension,
    measurementPeriod,
    measurementWindow,
    specsOnly,
    asStatistic,
    asCard,
    chartOptions,
    view,
    title,
    subTitle,
    showCounts,
    target,
    onPointClick
  }) => {
  const { flowMixTrends } = React.useMemo(() => data[dimension], [data, dimension]);
  return asStatistic ?
    <ProjectFlowMixTrendsStatsView
      {...{ flowMixTrends, measurementPeriod, measurementWindow, specsOnly, asCard, target }}
    />
    :
    <FlowMixTrendsChart
      title={title}
      subTitle={subTitle}
      flowMixTrends={flowMixTrends}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}
      specsOnly={specsOnly}
      target={target}
      showCounts={showCounts}
      chartOptions={chartOptions}
      view={view}
      onPointClick={onPointClick}
    />;
};