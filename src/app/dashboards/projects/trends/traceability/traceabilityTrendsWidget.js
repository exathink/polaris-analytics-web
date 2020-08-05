import React from "react";
import {Loading} from "../../../../components/graphql/loading";

import {useQueryProjectTraceabilityTrends} from "./useQueryProjectTraceabilityTrends";
import {ProjectTraceabilityTrendsView} from "./traceabilityTrendsView"

export const ProjectTraceabilityTrendsWidget = (
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
    const {loading, error, data} = useQueryProjectTraceabilityTrends(
      {
        instanceKey: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        samplingFrequency: samplingFrequency,
      }
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {traceabilityTrends} = data['project'];
    return (
      <ProjectTraceabilityTrendsView
        traceabilityTrends={traceabilityTrends}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
      />
    )
}
