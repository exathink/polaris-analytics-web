import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {ProjectAggregateFlowMetricsView} from "./projectAggregateFlowMetricsView";
import {ProjectFlowMetricsDetailDashboard} from "./projectFlowMetricsDetailDashboard";
import {useQueryProjectFlowMetrics} from "./useQueryProjectFlowMetrics";

export const ProjectFlowMetricsWidget = (
  {
    instanceKey,
    specsOnly,
    view,
    context,
    display,
    twoRows,
    latestWorkItemEvent,
    days,
    measurementWindow,
    samplingFrequency,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    stateMappingIndex,
    pollInterval
  }) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const {loading, error, data} = useQueryProjectFlowMetrics({
    instanceKey,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeTargetPercentile: leadTimeConfidenceTarget,
    cycleTimeTargetPercentile: cycleTimeConfidenceTarget,
    days: days,
    measurementWindow:measurementWindow,
    samplingFrequency: 7,
    specsOnly: limitToSpecsOnly,
    referenceString: latestWorkItemEvent
  });
  if (loading) return <Loading/>;
  if (error) return null;
  const {cycleMetricsTrends, responseTimeConfidenceTrends} = data['project'];
  
  if (view === 'primary') {
    return (
      <ProjectAggregateFlowMetricsView
        instanceKey={instanceKey}
        display={display}
        twoRows={twoRows}
        specsOnly={limitToSpecsOnly}
        leadTimeTargetPercentile={leadTimeConfidenceTarget}
        cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
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
        leadTimeTarget={leadTimeTarget}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeConfidenceTarget={leadTimeConfidenceTarget}
        cycleTimeConfidenceTarget={cycleTimeConfidenceTarget}
        stateMappingIndex={stateMappingIndex}
      />
    )
  }
}
