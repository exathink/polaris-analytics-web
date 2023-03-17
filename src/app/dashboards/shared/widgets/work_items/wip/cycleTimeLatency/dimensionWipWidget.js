import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import {useQueryDimensionPipelineCycleMetrics} from "../../hooks/useQueryDimensionPipelineCycleMetrics";
import {WorkInProgressBaseView} from "../flowMetrics/wipFlowMetricsSummaryView";

export function DimensionWipWidget({
  dimension,
  instanceKey,
  tags,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  includeSubTasks,
  view,
}) {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const {loading, error, data} = useQueryDimensionPipelineCycleMetrics({
    dimension,
    instanceKey,
    tags,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    specsOnly: limitToSpecsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionWipWidget.pipelineStateDetails", error);
    return null;
  }

  return <WorkInProgressBaseView data={data} dimension={dimension} />;
}
