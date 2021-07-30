import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionFlowMetrics} from "../closed/flowMetrics/useQueryDimensionFlowMetrics";
import {getReferenceString} from "../../../../../helpers/utility";
import {DimensionThroughputDetailDashboard} from "./dimensionThroughputDetailDashboard";
import { ThroughputView } from "./throughputView";

export const DimensionThroughputWidget = ({
  dimension,
  instanceKey,
  specsOnly,
  view,
  context,
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
  includeSubTasks,
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
      <ThroughputView
        specsOnly={limitToSpecsOnly}
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
    return <DimensionThroughputDetailDashboard dimension={dimension} dimensionData={dimensionData} context={context} />;
  }
};
