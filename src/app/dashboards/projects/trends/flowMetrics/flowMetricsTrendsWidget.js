import React from "react";
import {Loading} from "../../../../components/graphql/loading";

import {useQueryProjectFlowMetricsTrends} from "../hooks/useQueryProjectFlowMetricsTrends"
import {ProjectFlowMetricsTrendsView} from "./flowMetricsTrendsView"

export const ProjectFlowMetricsTrendsWidget = (
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
      <ProjectFlowMetricsTrendsView
        flowMetricsTrends={flowMetricsTrends}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
      />
    )
}
