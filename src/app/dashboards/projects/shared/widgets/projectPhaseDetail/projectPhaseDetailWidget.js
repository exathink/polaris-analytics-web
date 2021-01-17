import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../../hooks/useQueryProjectPipelineStateDetails";
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
}) => {
  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    specsOnly,
    activeOnly,
    funnelView,
    closedWithinDays,
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
