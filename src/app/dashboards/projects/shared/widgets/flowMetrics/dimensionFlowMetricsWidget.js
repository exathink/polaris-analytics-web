import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {AggregateFlowMetricsView} from "./aggregateFlowMetricsView";
import {DimensionFlowMetricsDetailDashboard} from "./dimensionFlowMetricsDetailDashboard";
import {useQueryDimensionFlowMetrics} from "./useQueryDimensionFlowMetrics";

export const DimensionFlowMetricsWidget = (
  {
    dimension,
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
    pollInterval,
    includeSubTasks
  }) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const {loading, error, data} = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeTargetPercentile: leadTimeConfidenceTarget,
    cycleTimeTargetPercentile: cycleTimeConfidenceTarget,
    days: days,
    measurementWindow:measurementWindow,
    samplingFrequency: 7,
    specsOnly: limitToSpecsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: latestWorkItemEvent
  });
  if (loading) return <Loading/>;
  if (error) return null;
  const {cycleMetricsTrends, responseTimeConfidenceTrends} = data['project'];
  
  if (view === 'primary') {
    return (
      <AggregateFlowMetricsView
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
      <DimensionFlowMetricsDetailDashboard
        dimension={dimension}
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
        includeSubTasks={includeSubTasks}
      />
    )
  }
}
