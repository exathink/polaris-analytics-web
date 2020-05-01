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
  const workItems = data['project']['workItems']['edges'].map(edge => {
    const workItemStateDetails = edge.node.workItemStateDetails;
    const latestTransitionDate = workItemStateDetails.currentStateTransition.eventDate;
    return {
      ...edge.node,
      timeInState: daysFromNow(toMoment(latestTransitionDate)),
      timeInStateDisplay: fromNow(latestTransitionDate),
      timeInPriorStates: workItemStateDetails.currentDeliveryCycleDurations.reduce(
        (total, duration) => total + duration.daysInState
        , 0
      )
    }
  });

  return (
    <ProjectPipelineStateDetailsView
      view={view}
      workItems={workItems}
      projectCycleMetrics={projectCycleMetricsData? projectCycleMetricsData.project : {}}
    />
  )
}