import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {AggregateFlowMetricsView} from "../closed/flowMetrics/aggregateFlowMetricsView";
import {useQueryDimensionFlowMetrics} from "../closed/flowMetrics/useQueryDimensionFlowMetrics";
import {getReferenceString} from "../../../../../helpers/utility";
import {ResponseTimeDetailDashboard} from "./responseTimeDetailDashboard";

export const ResponseTimeWidget = ({
  dimension,
  instanceKey,
  specsOnly,
  view,
  context,
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
  targetPercentile,
  stateMappingIndex,
  pollInterval,
  includeSubTasks,
  displayProps,
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
    measurementWindow: measurementWindow,
    samplingFrequency: samplingFrequency || 7,
    specsOnly: limitToSpecsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });
  if (loading) return <Loading />;
  if (error) return null;
  const {cycleMetricsTrends, contributorCount} = data[dimension];

  if (view === "primary") {
    return (
      <AggregateFlowMetricsView
        instanceKey={instanceKey}
        display={"responseTimeSummary"}
        displayProps={displayProps}
        twoRows={twoRows}
        specsOnly={limitToSpecsOnly}
        leadTimeTargetPercentile={leadTimeConfidenceTarget}
        cycleTimeTargetPercentile={cycleTimeConfidenceTarget}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeTarget={leadTimeTarget}
        latestCommit={latestCommit}
        contributorCount={contributorCount}
        cycleMetricsTrends={cycleMetricsTrends}
      />
    );
  } else {
    const settingsWithDefaults = {
      leadTimeTarget,
      cycleTimeTarget,
      leadTimeConfidenceTarget,
      cycleTimeConfidenceTarget,
      responseTimeConfidenceTarget: targetPercentile,
      wipAnalysisPeriod: days,
      includeSubTasksFlowMetrics: includeSubTasks,
    };

    const dimensionData = {key: instanceKey, latestWorkItemEvent, latestCommit, settingsWithDefaults};
    return <ResponseTimeDetailDashboard dimension={dimension} dimensionData={dimensionData} context={context} />;
  }
};
