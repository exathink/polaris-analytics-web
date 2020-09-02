import React from "react";
import {Loading} from "../../../../components/graphql/loading";
import {ProjectAggregateFlowMetricsView} from "./projectAggregateFlowMetricsView";
import {ProjectFlowMetricsDetailDashboard} from "./projectFlowMetricsDetailDashboard";
import {useQueryProjectFlowMetricsTrends} from "../../shared/hooks/useQueryProjectFlowMetricsTrends";

export const ProjectFlowMetricsWidget = (
  {
    instanceKey,
    specsOnly,
    view,
    context,
    showAll,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    targetPercentile,
    stateMappingIndex,
    pollInterval
  }) => {
  if (view === 'primary') {
    const {loading, error, data} = useQueryProjectFlowMetricsTrends({
      instanceKey,
      days:7,
      targetPercentile,
      measurementWindow:measurementWindow,
      samplingFrequency: 7,
      specsOnly: specsOnly,
      referenceString: latestWorkItemEvent
    });
    if (loading) return <Loading/>;
    if (error) return null;
    const {cycleMetricsTrends} = data['project'];
    return (
      <ProjectAggregateFlowMetricsView
        instanceKey={instanceKey}
        showAll={showAll}
        specsOnly={specsOnly}
        stateMappingIndex={stateMappingIndex}
        targetPercentile={targetPercentile}
        currentCycleMetrics={cycleMetricsTrends[0]}
        previousCycleMetrics={cycleMetricsTrends[1]}
      />
    )
  } else {
    return (
      <ProjectFlowMetricsDetailDashboard
        instanceKey={instanceKey}
        view={view}
        context={context}
        latestWorkItemEvent={latestWorkItemEvent}
        days={days}
        targetPercentile={targetPercentile}
        stateMappingIndex={stateMappingIndex}
      />
    )
  }
}
