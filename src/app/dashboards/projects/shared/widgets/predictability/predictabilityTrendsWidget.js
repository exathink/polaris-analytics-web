import React from "react";
import {Loading} from "../../../../../components/graphql/loading";

import {useQueryProjectFlowMetricsTrends} from "../../hooks/useQueryProjectFlowMetricsTrends"
import {ProjectPredictabilityTrendsView} from "./predictabilityTrendsView"

export const ProjectPredictabilityTrendsWidget = (
  {
    instanceKey,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    cycleTimeTarget,
    targetPercentile,
    pollInterval
  }) => {
    const {loading, error, data} = useQueryProjectFlowMetricsTrends(
      {
        instanceKey: instanceKey,
        days: days,
        measurementWindow: measurementWindow,
        specsOnly: true,
        samplingFrequency: samplingFrequency,
        targetPercentile: targetPercentile,
        referenceString: latestWorkItemEvent,

      }
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const {cycleMetricsTrends: flowMetricsTrends} = data['project'];
    return (
      <ProjectPredictabilityTrendsView
        flowMetricsTrends={flowMetricsTrends}
        targetPercentile={targetPercentile}
        measurementWindow={measurementWindow}
        measurementPeriod={days}
        cycleTimeTarget={cycleTimeTarget}
        view={view}
      />
    )
}
