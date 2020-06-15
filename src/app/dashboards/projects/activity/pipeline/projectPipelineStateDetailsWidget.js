import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../hooks/useQueryProjectPipelineStateDetails";
import {ProjectPipelineStateDetailsView} from "./projectPipelineStateDetailsView";
import {useQueryProjectCycleMetrics} from "../hooks/useQueryProjectCycleMetrics";

export const ProjectPipelineStateDetailsWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    days,
    targetPercentile,
    stateMappingIndex,
    view,
    context
  }
) => {

  const {loading: cycleMetricsLoading, data: projectCycleMetricsData} = useQueryProjectCycleMetrics(
    {instanceKey, days, targetPercentile, referenceString: latestWorkItemEvent}
  )

  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    referenceString: latestWorkItemEvent
  })
  if (cycleMetricsLoading || loading || !stateMappingIndex || !stateMappingIndex.isValid()) return <Loading/>;
  if (error) return null;
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