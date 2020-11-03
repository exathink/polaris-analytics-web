import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectFlowMetricsTrends} from "../../hooks/useQueryProjectFlowMetricsTrends"
import {ProjectVolumeTrendsView} from "./throughputTrendsView"
import {ProjectVolumeTrendsDetailDashboard} from "./throughputTrendsDetailDashboard";

export const ProjectVolumeTrendsWidget = (
  {
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    pollInterval
  }) => {
    const {loading, error, data} = useQueryProjectFlowMetricsTrends(
      {
        instanceKey: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
        targetPercentile: targetPercentile

      }
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {cycleMetricsTrends: flowMetricsTrends} = data['project'];
    return (
      view === 'primary' ?
        <ProjectVolumeTrendsView
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementWindow={measurementWindow}
          measurementPeriod={days}
          view={view}
        />
        :
        <ProjectVolumeTrendsDetailDashboard
          instanceKey={instanceKey}
          flowMetricsTrends={flowMetricsTrends}
          targetPercentile={targetPercentile}
          measurementWindow={measurementWindow}
          days={days}
          samplingFrequency={samplingFrequency}

          view={view}
        />
    )
}
