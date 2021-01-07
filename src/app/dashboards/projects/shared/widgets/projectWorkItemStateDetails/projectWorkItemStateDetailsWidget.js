import React from "react";
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../../hooks/useQueryProjectPipelineStateDetails";
import {ProjectWorkItemStateDetailsView} from "./projectWorkItemStateDetailsView";
import {useQueryProjectCycleMetrics} from "../../hooks/useQueryProjectCycleMetrics";
import {logGraphQlError} from "../../../../../components/graphql/utils";

export const ProjectWorkItemStateDetailsWidget = ({
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
  const {
    loading: cycleMetricsLoading,
    error: cycleMetricsError,
    data: projectCycleMetricsData,
  } = useQueryProjectCycleMetrics({
    instanceKey,
    days,
    targetPercentile,
    specsOnly,
    referenceString: latestWorkItemEvent,
  });

  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    specsOnly,
    activeOnly,
    funnelView,
    closedWithinDays,
    referenceString: latestWorkItemEvent,
  });

  if (cycleMetricsError) {
    logGraphQlError("ProjectWorkItemStateDetailsWidget.cycleMetrics", cycleMetricsError);
    return null;
  }

  if (cycleMetricsLoading || loading) return <Loading />;
  if (error) {
    logGraphQlError("ProjectWorkItemStateDetailsWidget.pipelineStateDetails", error);
    return null;
  }
  const workItems = data["project"]["workItems"]["edges"].map((edge) => edge.node);
  const targetMetrics = {leadTimeConfidenceTarget, cycleTimeConfidenceTarget, leadTimeTarget, cycleTimeTarget};
  const projectCycleMetrics = projectCycleMetricsData ? {...projectCycleMetricsData.project, ...targetMetrics} : {};
  return (
    <ProjectWorkItemStateDetailsView
      view={view}
      context={context}
      workItems={workItems}
      projectCycleMetrics={projectCycleMetrics}
    />
  );
};
