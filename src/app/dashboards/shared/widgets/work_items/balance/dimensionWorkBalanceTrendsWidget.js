import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";


import {useQueryDimensionWorkBalanceTrends} from "./useQueryDimensionWorkBalanceTrends";
import {WorkBalanceTrendsView} from "./workBalanceTrendsView";
import {DimensionWorkBalanceTrendsDetailDashboard} from "./workBalanceTrendsDetailDashboard";

export const DimensionWorkBalanceTrendsWidget = (
  {
    dimension,
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

  const {loading, error, data} = useQueryDimensionWorkBalanceTrends(
    {
      dimension: dimension,
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
  const {capacityTrends, contributorDetail, cycleMetricsTrends} = data[dimension];
  return (
    view !== 'detail' ?

      <WorkBalanceTrendsView
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
      <DimensionWorkBalanceTrendsDetailDashboard
        {...{dimension, instanceKey, days, measurementWindow, samplingFrequency, target, view, includeSubTasks}}
      />
  )
}
