import {Loading} from "../../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../../components/graphql/utils";
import {getReferenceString} from "../../../../../../helpers/utility";
import {useQueryDimensionPipelineStateDetails} from "../../hooks/useQueryDimensionPipelineStateDetails";

// this will have wip query
export function DimensionWipWidget({
  dimension,
  instanceKey,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  includeSubTasks,
  view,
}) {
  const {loading, error, data} = useQueryDimensionPipelineStateDetails({
    dimension,
    instanceKey,
    specsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });
  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionWipWidget.pipelineStateDetails", error);
    return null;
  }

//   default view
  return <div></div>;
}
