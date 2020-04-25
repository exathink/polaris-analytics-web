import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../hooks/useQueryProjectPipelineStateDetails";
import {ProjectPipelineStateDetailsView} from "./projectPipelineStateDetailsView";
import {toMoment, daysFromNow, fromNow} from "../../../../helpers/utility";
import {useQueryProjectCycleMetrics} from "../hooks/useQueryProjectCycleMetrics";

export const ProjectPipelineStateDetailsWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    days,
    targetPercentile,
    stateMappingIndex
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
  const workItems = data['project']['workItems']['edges'].map(edge => {
    const latestTransitionDate = edge.node.workItemStateDetails.currentStateTransition.eventDate;
    return {
      ...edge.node,
      timeInState: daysFromNow(toMoment(latestTransitionDate)),
      timeInStateDisplay: fromNow(latestTransitionDate)
    }
  });

  return (
    <ProjectPipelineStateDetailsView
      workItems={workItems}
      projectCycleMetrics={projectCycleMetricsData? projectCycleMetricsData.project : {}}
    />
  )
}