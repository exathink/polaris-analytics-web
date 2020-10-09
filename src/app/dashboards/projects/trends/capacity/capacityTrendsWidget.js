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
    showAll,
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
    }
  );
  if (loading) return <Loading/>;
  if (error) return null;
  const {capacityTrends} = data['project'];
  return (
    view !== 'detail' ?
      <ProjectCapacityTrendsView
        capacityTrends={capacityTrends}
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
