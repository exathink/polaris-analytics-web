import React from 'react';
import {Loading} from "../../../../components/graphql/loading";


import {useQueryProjectCapacityTrends} from "./useQueryProjectCapacityTrends";
import {ProjectCapacityTrendsView} from "./capacityTrendsView";
import {ProjectCapacityTrendsDetailDashboard} from "./capacityTrendsDetailDashboard";

export const ProjectCapacityTrendsWidget = (
  {
    instanceKey,
    view,
    context,
    showContributorDetail,
    latestWorkItemEvent,
    latestCommit,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    target,
    asStatistic,
    pollInterval
  }) => {

  const {loading, error, data} = useQueryProjectCapacityTrends(
    {
      instanceKey: instanceKey,
      days: days,
      measurementWindow: measurementWindow,
      samplingFrequency: samplingFrequency,
      showContributorDetail: showContributorDetail,
    }
  );
  if (loading) return <Loading/>;
  if (error) return null;
  const {capacityTrends, contributorDetail} = data['project'];
  return (
    view !== 'detail' ?
      <ProjectCapacityTrendsView
        capacityTrends={capacityTrends}
        contributorDetail={contributorDetail}
        showContributorDetail={showContributorDetail}

        measurementWindow={measurementWindow}
        measurementPeriod={days}
        asStatistic={asStatistic}
        target={target}

        view={view}

      />
      :
      <ProjectCapacityTrendsDetailDashboard
        {...{instanceKey, days, measurementWindow, samplingFrequency, target}}
      />
  )
}
