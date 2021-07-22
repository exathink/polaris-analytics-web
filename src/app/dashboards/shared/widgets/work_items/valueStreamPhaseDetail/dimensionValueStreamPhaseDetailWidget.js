import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPipelineStateDetails} from "../hooks/useQueryDimensionPipelineStateDetails";
import {ValueStreamPhaseDetailView} from "./valueStreamPhaseDetailView";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {useChildState} from "../../../../../helpers/hooksUtil";

export const DimensionValueStreamPhaseDetailWidget = ({
  dimension,
  instanceKey,
  specsOnly,
  latestWorkItemEvent,
  days,
  activeOnly,
  funnelView,
  closedWithinDays,
  targetPercentile,
  stateMappingIndex,
  view,
  context,
  leadTimeConfidenceTarget,
  cycleTimeConfidenceTarget,
  leadTimeTarget,
  cycleTimeTarget,
  includeSubTasks,
  workItemScope: parentWorkItemScope,
  setWorkItemScope: parentSetWorkItemScope,
}) => {
  const [workItemScope, setWorkItemScope] = useChildState(parentWorkItemScope, parentSetWorkItemScope, "all");

  const {loading, error, data} = useQueryDimensionPipelineStateDetails({
    dimension,
    instanceKey,
    activeOnly,
    funnelView,
    closedWithinDays,
    includeSubTasks,
    specsOnly: workItemScope === "specs",
    referenceString: latestWorkItemEvent,
  });
  const targetMetrics = React.useMemo(
    () => ({leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget}),
    [leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget]
  );

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionValueStreamPhaseDetailWidget.pipelineStateDetails", error);
    return null;
  }  

  return (
    <ValueStreamPhaseDetailView
      dimension={dimension}
      view={view}
      specsOnly={specsOnly}
      context={context}
      data={data}
      targetMetrics={targetMetrics}
      workItemScope={workItemScope}
      setWorkItemScope={setWorkItemScope}
      workItemScopeVisible={!parentWorkItemScope}
    />
  );
};

DimensionValueStreamPhaseDetailWidget.infoConfig = {
  title: "Phase Detail",
  content: () => (
    <>
      <p> short description </p>
    </>
  ),
  content1: () => (
    <><p>Detailed Description</p></>
  ),
};