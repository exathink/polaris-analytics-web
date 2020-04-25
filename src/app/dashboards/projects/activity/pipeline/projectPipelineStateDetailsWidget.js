import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../hooks/useQueryProjectPipelineStateDetails";
import {ProjectPipelineStateDetailsView} from "./projectPipelineStateDetailsView";
import {toMoment, daysFromNow} from "../../../../helpers/utility";

export const ProjectPipelineStateDetailsWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex
  }
) => {
  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    referenceString: latestWorkItemEvent
  })
  if (loading || !stateMappingIndex || !stateMappingIndex.isValid()) return <Loading/>;
  if (error) return null;
  const workItems = data['project']['workItems']['edges'].map(edge => ({
    ...edge.node,
    timeInState: daysFromNow(toMoment(edge.node.workItemStateDetails.currentStateTransition.eventDate))
  }));
  return (
    <ProjectPipelineStateDetailsView
      workItems={workItems}
    />
  )
}