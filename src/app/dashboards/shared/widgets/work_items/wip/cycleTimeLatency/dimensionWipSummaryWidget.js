import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import { useQueryDimensionFlowMetrics } from "../../closed/flowMetrics/useQueryDimensionFlowMetrics";
import { useQueryDimensionPipelineStateDetails } from "../../hooks/useQueryDimensionPipelineStateDetails";
import {WorkInProgressSummaryView} from "../flowMetrics/wipFlowMetricsSummaryView";

export function DimensionWipSummaryWidget({
  dimension,
  instanceKey,
  tags,
  release,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  targetPercentile,
  leadTimeTargetPercentile,
  leadTimeTarget,
  cycleTimeTargetPercentile,
  cycleTimeTarget,
  latencyTarget,
  includeSubTasks,
  days,
  view,
  displayBag,
  displayProps
}) {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const queryVars = {
    dimension,
    instanceKey,
    tags,
    release,
    specsOnly: limitToSpecsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  };
  const {loading, error, data} = useQueryDimensionPipelineStateDetails(queryVars)

  const {loading: loading1, error: error1, data: flowMetricsData} = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    leadTimeTarget,
    tags,
    release,
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

  const {loading: loading2, error: error2, data: dataForSpecs} = useQueryDimensionPipelineStateDetails({...queryVars, specsOnly: true});

  if (loading || loading1 || loading2) return <Loading />;
  if (error) {
    logGraphQlError("DimensionWipSummaryWidget.useQueryDimensionPipelineStateDetails", error);
    return null;
  }
  if (error1) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionFlowMetrics", error1);
    return null;
  }
  if (error2) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionPipelineStateDetails", error2);
    return null;
  }

  return (
    <WorkInProgressSummaryView
      data={data}
      dataForSpecs={dataForSpecs}
      flowMetricsData={flowMetricsData}
      dimension={dimension}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      days={days}
      displayBag={displayBag}
    />
  );
}
