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

    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    cycleTimeTarget,
    leadTimeTarget,
    stateMappingIndex,
    pollInterval
  }) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  if (view === 'primary') {
    const {loading, error, data} = useQueryProjectFlowMetricsTrends({
      instanceKey,
      leadTimeTargetPercentile,
      cycleTimeTargetPercentile,
      days:7,
      measurementWindow:measurementWindow,
      samplingFrequency: 7,
      specsOnly: limitToSpecsOnly,
      referenceString: latestWorkItemEvent
    });
    if (loading) return <Loading/>;
    if (error) return null;
    const {cycleMetricsTrends} = data['project'];
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
        currentCycleMetrics={cycleMetricsTrends[0]}
        previousCycleMetrics={cycleMetricsTrends[1]}
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
