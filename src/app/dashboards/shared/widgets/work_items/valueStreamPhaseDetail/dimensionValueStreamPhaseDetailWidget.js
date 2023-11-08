import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionWorkItemDetails} from "../hooks/useQueryDimensionWorkItemDetails";
import {ValueStreamPhaseDetailView} from "./valueStreamPhaseDetailView";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {useChildState} from "../../../../../helpers/hooksUtil";
import { getReferenceString } from "../../../../../helpers/utility";

export const DimensionValueStreamPhaseDetailWidget = ({
  dimension,
  instanceKey,
  tags,
  release,
  specsOnly,
  latestWorkItemEvent,
  latestCommit,
  days,
  activeOnly,
  funnelView,
  defaultToHistogram = true,
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
  const [workItemScope, setWorkItemScope] = useChildState(parentWorkItemScope, parentSetWorkItemScope, "specs");

  const {loading, error, data} = useQueryDimensionWorkItemDetails({
    dimension,
    instanceKey,
    tags,
    release,
    activeOnly,
    funnelView,
    closedWithinDays,
    includeSubTasks,
    specsOnly: workItemScope === "specs",
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
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
      defaultToHistogram={defaultToHistogram}
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