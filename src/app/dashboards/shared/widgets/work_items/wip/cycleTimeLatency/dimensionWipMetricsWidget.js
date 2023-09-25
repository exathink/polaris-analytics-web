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
  context,
  specsOnly,
  latestCommit,
  latestWorkItemEvent,

  flowAnalysisPeriod = 30,
  includeSubTasks,
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

  const {loading, error, data} = useQueryDimensionPipelineStateDetails({...queryVars})
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

  const {loading: loading2, error: error2, data: dataForSpecs} = useQueryDimensionPipelineStateDetails({...queryVars, specsOnly: true});

  if (loading || loading1 || loading2) return <Loading />;
  if (error) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionPipelineCycleMetrics", error);
    return null;
  }
  if (error1) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionFlowMetrics", error1);
    return null;
  }
  if (error2) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionPipelineCycleMetrics", error2);
    return null;
  }

  return (
    <DimensionWipMetricsView
      data={data}
      dataForSpecs={dataForSpecs}
      flowMetricsData={flowMetricsData}
      specsOnly={specsOnly}
      dimension={dimension}
      instanceKey={instanceKey}
      displayBag={displayBag}
      excludeAbandoned={excludeAbandoned}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      days={flowAnalysisPeriod}
      queryVars={{latestWorkItemEvent, latestCommit}}
      context={context}
    />
  );
}
