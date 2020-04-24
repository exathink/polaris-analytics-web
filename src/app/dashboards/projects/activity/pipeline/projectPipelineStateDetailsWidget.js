import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../hooks/useQueryProjectPipelineStateDetails";
import {ProjectPipelineStateDetailsView} from "./projectPipelineStateDetailsView"
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
  const workItems = data['project']['workItems']['edges'].map(edge => edge.node);
  return (
    <ProjectPipelineStateDetailsView
      workItems={workItems}
    />
  )
}