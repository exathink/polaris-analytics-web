import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import {useQueryDimensionFlowMetrics} from "../../closed/flowMetrics/useQueryDimensionFlowMetrics";
import {useQueryDimensionPipelineStateDetails} from "../../hooks/useQueryDimensionPipelineStateDetails";
import {DimensionWipMetricsView} from "./dimensionWipMetricsView";

export function DimensionWipMetricsWidget({
  dimension,
  instanceKey,
  tags,
  release,
  displayBag,
  excludeAbandoned,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  cycleTimeTarget,
  latencyTarget,
  leadTimeTarget,

  specsOnly,
  latestCommit,
  latestWorkItemEvent,

  flowAnalysisPeriod = 30,
  includeSubTasks,
}) {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;

  const {loading, error, data} = useQueryDimensionPipelineStateDetails({
    dimension,
    instanceKey,
    tags,
    release,
    specsOnly: limitToSpecsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })

  const {
    loading: loading1,
    error: error1,
    data: flowMetricsData,
  } = useQueryDimensionFlowMetrics({
    dimension,
    instanceKey,
    tags,
    leadTimeTarget,
    cycleTimeTarget,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    days: flowAnalysisPeriod,
    measurementWindow: flowAnalysisPeriod,
    samplingFrequency: flowAnalysisPeriod,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  if (loading || loading1) return <Loading />;
  if (error || error1) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionPipelineCycleMetrics", error);
    return null;
  }

  return (
    <DimensionWipMetricsView
      data={data}
      flowMetricsData={flowMetricsData}
      specsOnly={specsOnly}
      dimension={dimension}
      instanceKey={instanceKey}
      displayBag={displayBag}
      excludeAbandoned={excludeAbandoned}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      days={flowAnalysisPeriod}
    />
  );
}
