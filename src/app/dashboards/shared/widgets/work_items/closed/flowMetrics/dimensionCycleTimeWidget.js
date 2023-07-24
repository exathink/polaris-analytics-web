import React from "react";
import {Loading} from "../../../../../../components/graphql/loading";
import {CycleTimeDetailView} from "./aggregateFlowMetricsView";
import {useQueryDimensionFlowMetrics} from "./useQueryDimensionFlowMetrics";
import {getReferenceString} from "../../../../../../helpers/utility";
import {useQueryDimensionPullRequestMetricsTrends} from "../../../../../projects/shared/hooks/useQueryDimensionPullRequestMetricsTrends";

export const DimensionCycleTimeWidget = ({
  dimension,
  instanceKey,
  tags,
  specsOnly,
  view,
  latestWorkItemEvent,
  latestCommit,
  days,
  measurementWindow,
  samplingFrequency,
  leadTimeTarget,
  cycleTimeTarget,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  includeSubTasks,
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
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency || 7,
    specsOnly: limitToSpecsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });
  const {
    loading: loading1,
    error: error1,
    data: data1,
  } = useQueryDimensionPullRequestMetricsTrends({
    dimension,
    instanceKey,
    days,
    measurementWindow,
    samplingFrequency,
    referenceString: latestCommit,
  });
  if (loading || loading1) return <Loading />;
  if (error || error1) return null;
  const {pullRequestMetricsTrends} = data1[dimension];
  const {cycleMetricsTrends} = data[dimension];
  const [currentPullRequestTrend, previousPullRequestTrend] = pullRequestMetricsTrends;

  const finalCycleMetricTrends = [
    {...cycleMetricsTrends[0], pullRequestAvgAge: currentPullRequestTrend.avgAge},
    {...cycleMetricsTrends[1], pullRequestAvgAge: previousPullRequestTrend.avgAge},
  ];

  if (view === "primary") {
    return (
      <CycleTimeDetailView
        specsOnly={limitToSpecsOnly}
        leadTimeTargetPercentile={leadTimeConfidenceTarget}
        cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeTarget={leadTimeTarget}
        cycleMetricsTrends={finalCycleMetricTrends}
        measurementWindow={measurementWindow}
      />
    );
  } else {
    return null
  }
};
