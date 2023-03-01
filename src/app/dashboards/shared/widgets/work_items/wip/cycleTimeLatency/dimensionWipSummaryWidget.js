import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import { useQueryDimensionFlowMetrics } from "../../closed/flowMetrics/useQueryDimensionFlowMetrics";
import {useQueryDimensionPipelineCycleMetrics} from "../../hooks/useQueryDimensionPipelineCycleMetrics";
import {WorkInProgressSummaryView} from "../flowMetrics/wipFlowMetricsSummaryView";

export function DimensionWipSummaryWidget({
  dimension,
  instanceKey,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  targetPercentile,
  leadTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTargetPercentile,
  cycleTimeTarget,
  includeSubTasks,
  days,
  view,
  displayProps
}) {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const {loading, error, data} = useQueryDimensionPipelineCycleMetrics({
    dimension,
    instanceKey,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    specsOnly: limitToSpecsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  const {loading: loading1, error: error1, data: flowMetricsData} = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    days: days,
    measurementWindow: days,
    samplingFrequency: days,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  if (loading || loading1) return <Loading />;
  if (error || error1) {
    logGraphQlError("DimensionWipSummaryWidget.useQueryDimensionFlowMetrics", error);
    return null;
  }

  return (
    <WorkInProgressSummaryView
      data={data}
      flowMetricsData={flowMetricsData}
      dimension={dimension}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      days={days}
      displayProps={displayProps}
    />
  );
}
