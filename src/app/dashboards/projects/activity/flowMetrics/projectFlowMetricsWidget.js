import React from "react";
import {Loading} from "../../../../components/graphql/loading";
import {ProjectAggregateFlowMetricsView} from "./projectAggregateFlowMetricsView";
import {ProjectFlowMetricsDetailDashboard} from "./projectFlowMetricsDetailDashboard";
import {useQueryProjectFlowMetrics} from "./useQueryProjectFlowMetrics";

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
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    cycleTimeTarget,
    leadTimeTarget,
    stateMappingIndex,
    pollInterval
  }) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  if (view === 'primary') {
    const {loading, error, data} = useQueryProjectFlowMetrics({
      instanceKey,
      leadTimeTarget,
      cycleTimeTarget,
      leadTimeTargetPercentile: leadTimeTargetPercentile,
      cycleTimeTargetPercentile: cycleTimeTargetPercentile,
      days:7,
      measurementWindow:measurementWindow,
      samplingFrequency: 7,
      specsOnly: limitToSpecsOnly,
      referenceString: latestWorkItemEvent
    });
    if (loading) return <Loading/>;
    if (error) return null;
    const {cycleMetricsTrends, responseTimeConfidenceTrends} = data['project'];
    return (
      <ProjectAggregateFlowMetricsView
        instanceKey={instanceKey}
        showAll={showAll}
        specsOnly={limitToSpecsOnly}
        stateMappingIndex={stateMappingIndex}
        leadTimeTargetPercentile={leadTimeTargetPercentile}
        cycleTimeTargetPercentile={cycleTimeTargetPercentile}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeTarget={leadTimeTarget}
        cycleMetricsTrends={cycleMetricsTrends}
        responseTimeConfidenceTrends={responseTimeConfidenceTrends}
      />
    )
  } else {
    return (
      <ProjectFlowMetricsDetailDashboard
        instanceKey={instanceKey}
        specsOnly={limitToSpecsOnly}
        view={view}
        context={context}
        latestWorkItemEvent={latestWorkItemEvent}
        days={days}
        leadTimeTargetPercentile={leadTimeTargetPercentile}
        cycleTimeTargetPercentile={cycleTimeTargetPercentile}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeTarget={leadTimeTarget}
        stateMappingIndex={stateMappingIndex}
      />
    )
  }
}
