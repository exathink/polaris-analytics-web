import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../hooks/useQueryProjectPipelineStateDetails";
import {ProjectPipelineStateDetailsView} from "./projectPipelineStateDetailsView";
import {useQueryProjectCycleMetrics} from "../hooks/useQueryProjectCycleMetrics";
import {logGraphQlError} from "../../../../components/graphql/utils";

export const ProjectPipelineStateDetailsWidget = (
  {
    instanceKey,
    specsOnly,
    latestWorkItemEvent,
    days,
    targetPercentile,
    stateMappingIndex,
    view,
    context
  }
) => {

  const {loading: cycleMetricsLoading, error: cycleMetricsError, data: projectCycleMetricsData} = useQueryProjectCycleMetrics(
    {instanceKey, days, targetPercentile, specsOnly, referenceString: latestWorkItemEvent}
  )
  if (cycleMetricsError) {
    logGraphQlError('ProjectPipelineStateDetailsWidget.cycleMetrics', cycleMetricsError);
    return null;
  }

  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    specsOnly,
    referenceString: latestWorkItemEvent
  })
  if (cycleMetricsLoading || loading || !stateMappingIndex || !stateMappingIndex.isValid()) return <Loading/>;
  if (error) {
    logGraphQlError('ProjectPipelineStateDetailsWidget.pipelineStateDetails', error);
    return null;
  }
  const workItems = data['project']['workItems']['edges'].map(edge => edge.node);

  return (
    workItems.length > 0 &&
    <ProjectPipelineStateDetailsView
      view={view}
      context={context}
      workItems={workItems}
      projectCycleMetrics={projectCycleMetricsData? projectCycleMetricsData.project : {}}
    />
  )
}