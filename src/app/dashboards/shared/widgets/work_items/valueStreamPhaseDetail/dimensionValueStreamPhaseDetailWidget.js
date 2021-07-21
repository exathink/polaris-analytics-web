import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPipelineStateDetails} from "../hooks/useQueryDimensionPipelineStateDetails";
import {ValueStreamPhaseDetailView} from "./valueStreamPhaseDetailView";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {useChildState} from "../../../../../helpers/hooksUtil";
import { INFO_ICON_PLACEMENTS } from "../../../../../framework/viz/dashboard/dashboardWidget";

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

  if (loading) return <Loading />;
  if (error) {
    logGraphQlError("DimensionValueStreamPhaseDetailWidget.pipelineStateDetails", error);
    return null;
  }
  const workItems = data[dimension]["workItems"]["edges"].map((edge) => edge.node);
  const targetMetrics = {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget};

  return (
    <ValueStreamPhaseDetailView
      view={view}
      specsOnly={specsOnly}
      context={context}
      workItems={workItems}
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
  placementInPrimaryView: INFO_ICON_PLACEMENTS.Right,
  placementInDetailView: INFO_ICON_PLACEMENTS.Right,
};