import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import {useQueryDimensionPipelineCycleMetrics} from "../../hooks/useQueryDimensionPipelineCycleMetrics";
import {DimensionWipMetricsView} from "./dimensionWipMetricsView";

export function DimensionWipMetricsWidget({
  dimension,
  instanceKey,

  displayBag,

  targetPercentile,
  leadTimeTargetPercentile,
  cycleTimeTargetPercentile,
  cycleTimeTarget,

  specsOnly,
  latestCommit,
  latestWorkItemEvent,

  includeSubTasks,
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

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionWipMetricsWidget.useQueryDimensionPipelineCycleMetrics", error);
    return null;
  }

  return (
    <DimensionWipMetricsView
      data={data}
      dimension={dimension}
      instanceKey={instanceKey}
      displayBag={displayBag}
      cycleTimeTarget={cycleTimeTarget}
    />
  );
}
