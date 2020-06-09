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
    view
  }
) => {

  const {data: projectCycleMetricsData} = useQueryProjectCycleMetrics(
    {instanceKey, days, targetPercentile, referenceString: latestWorkItemEvent}
  )

  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    referenceString: latestWorkItemEvent
  })
  if (loading || !stateMappingIndex || !stateMappingIndex.isValid()) return <Loading/>;
  if (error) return null;
  const workItems = data['project']['workItems']['edges'].map(edge => edge.node);

  return (
    workItems.length > 0 &&
    <ProjectPipelineStateDetailsView
      view={view}
      workItems={workItems}
      projectCycleMetrics={projectCycleMetricsData? projectCycleMetricsData.project : {}}
    />
  )
}