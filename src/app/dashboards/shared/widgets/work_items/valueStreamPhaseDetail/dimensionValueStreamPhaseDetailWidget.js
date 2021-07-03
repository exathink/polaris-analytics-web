import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPipelineStateDetails} from "../hooks/useQueryDimensionPipelineStateDetails";
import {ValueStreamPhaseDetailView} from "./valueStreamPhaseDetailView";
import {logGraphQlError} from "../../../../../components/graphql/utils";

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
  includeSubTasks
}) => {
  const {loading, error, data} = useQueryDimensionPipelineStateDetails({
    dimension,
    instanceKey,
    specsOnly,
    activeOnly,
    funnelView,
    closedWithinDays,
    includeSubTasks,
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
      context={context}
      workItems={workItems}
      targetMetrics={targetMetrics}
    />
  );
};
