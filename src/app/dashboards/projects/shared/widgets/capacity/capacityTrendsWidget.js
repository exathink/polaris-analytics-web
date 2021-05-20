import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";


import {useQueryProjectCapacityTrends} from "./useQueryProjectCapacityTrends";
import {ProjectCapacityTrendsView} from "./capacityTrendsView";
import {ProjectCapacityTrendsDetailDashboard} from "./capacityTrendsDetailDashboard";

export const ProjectEffortTrendsWidget = (
  {
    instanceKey,
    view,
    context,
    showContributorDetail,
    showEffort,
    latestWorkItemEvent,
    latestCommit,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    pollInterval,
    chartConfig,
    includeSubTasks
  }) => {

  const {loading, error, data} = useQueryProjectCapacityTrends(
    {
      instanceKey: instanceKey,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      showContributorDetail: showContributorDetail,
      includeSubTasks: includeSubTasks
    }
  );
  if (loading) return <Loading/>;
  if (error) return null;
  const {capacityTrends, contributorDetail, cycleMetricsTrends} = data['project'];
  return (
    view !== 'detail' ?
      <ProjectCapacityTrendsView
        capacityTrends={capacityTrends}
        contributorDetail={contributorDetail}
        cycleMetricsTrends={cycleMetricsTrends}
        showContributorDetail={showContributorDetail}
        showEffort={showEffort}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
        asStatistic={asStatistic}
        target={target}
        chartConfig={chartConfig}
        view={view}
      />
      :
      <ProjectCapacityTrendsDetailDashboard
        {...{instanceKey, days, measurementWindow, samplingFrequency, target, view}}
      />
  )
}
