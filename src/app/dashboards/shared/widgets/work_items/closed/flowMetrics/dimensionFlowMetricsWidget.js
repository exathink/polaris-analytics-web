import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {AggregateFlowMetricsView} from "./aggregateFlowMetricsView";
import {DimensionFlowMetricsDetailDashboard} from "./dimensionFlowMetricsDetailDashboard";
import {useQueryDimensionFlowMetrics} from "./useQueryDimensionFlowMetrics";
import { getReferenceString } from "../../../../../../helpers/utility";
import { useQueryDimensionPullRequestMetricsTrends } from "../../../../../projects/shared/hooks/useQueryDimensionPullRequestMetricsTrends";

export const DimensionFlowMetricsWidget = (
  {
    dimension,
    instanceKey,
    tags,
    specsOnly,
    view,
    context,
    display,
    twoRows,
    latestWorkItemEvent,
    latestCommit,
    days,
    measurementWindow,
    samplingFrequency,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeConfidenceTarget,
    cycleTimeConfidenceTarget,
    stateMappingIndex,
    pollInterval,
    includeSubTasks,
    displayProps
  }) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const {loading, error, data} = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    tags,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeTargetPercentile: leadTimeConfidenceTarget,
    cycleTimeTargetPercentile: cycleTimeConfidenceTarget,
    days: days,
    measurementWindow:measurementWindow,
    samplingFrequency: samplingFrequency || 7,
    specsOnly: limitToSpecsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  });
  const {loading: loading1, error: error1, data: data1} = useQueryDimensionPullRequestMetricsTrends({
    dimension,
    instanceKey,
    days,
    measurementWindow,
    samplingFrequency,
    referenceString: latestCommit,
  });
  if (loading || loading1) return <Loading/>;
  if (error || error1) return null;
  const {pullRequestMetricsTrends} = data1[dimension];
  const {cycleMetricsTrends, contributorCount} = data[dimension];
  const [currentPullRequestTrend, previousPullRequestTrend] = pullRequestMetricsTrends;
  
  const finalCycleMetricTrends = [
    {...cycleMetricsTrends[0], pullRequestAvgAge: currentPullRequestTrend.avgAge},
    {...cycleMetricsTrends[1], pullRequestAvgAge: previousPullRequestTrend.avgAge},
  ];
  
  if (view === 'primary') {
    return (
      <AggregateFlowMetricsView
        instanceKey={instanceKey}
        display={display}
        displayProps={displayProps}
        twoRows={twoRows}
        specsOnly={limitToSpecsOnly}
        leadTimeTargetPercentile={leadTimeConfidenceTarget}
        cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeTarget={leadTimeTarget}
        latestCommit={latestCommit}
        contributorCount={contributorCount}
        cycleMetricsTrends={finalCycleMetricTrends}
      />
    )
  } else {
    return (
      <DimensionFlowMetricsDetailDashboard
        dimension={dimension}
        instanceKey={instanceKey}
        tags={tags}
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
        latestCommit={latestCommit}
      />
    )
  }
}
