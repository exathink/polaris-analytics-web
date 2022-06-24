import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionFlowMetrics} from "../closed/flowMetrics/useQueryDimensionFlowMetrics";
import {getReferenceString} from "../../../../../helpers/utility";
import {DimensionResponseTimeDetailDashboard} from "./dimensionResponseTimeDetailDashboard";
import {ResponseTimeView} from "./responseTimeView";

export const DimensionResponseTimeWidget = ({
  dimension,
  instanceKey,
  display,
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
  const {cycleMetricsTrends} = data[dimension];

  if (view === "primary") {
    return (
      <ResponseTimeView
        display={display}
        cycleTimeTarget={cycleTimeTarget}
        leadTimeTarget={leadTimeTarget}
        cycleMetricsTrends={cycleMetricsTrends}
        specsOnly={limitToSpecsOnly}
        days={measurementWindow}
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
    return <DimensionResponseTimeDetailDashboard dimension={dimension} dimensionData={dimensionData} context={context} />;
  }
};
