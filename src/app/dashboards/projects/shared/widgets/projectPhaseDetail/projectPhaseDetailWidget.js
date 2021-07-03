import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryDimensionPipelineStateDetails} from "../../../../shared/widgets/work_items/hooks/useQueryDimensionPipelineStateDetails";
import {ProjectPhaseDetailView} from "./projectPhaseDetailView";
import {logGraphQlError} from "../../../../../components/graphql/utils";

export const ProjectPhaseDetailWidget = ({
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
    logGraphQlError("ProjectPhaseDetailWidget.pipelineStateDetails", error);
    return null;
  }
  const workItems = data["project"]["workItems"]["edges"].map((edge) => edge.node);
  const targetMetrics = {leadTimeTarget, cycleTimeTarget, leadTimeConfidenceTarget, cycleTimeConfidenceTarget};

  return (
    <ProjectPhaseDetailView
      view={view}
      context={context}
      workItems={workItems}
      targetMetrics={targetMetrics}
    />
  );
};
