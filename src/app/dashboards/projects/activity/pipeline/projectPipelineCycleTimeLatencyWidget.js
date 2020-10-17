import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../hooks/useQueryProjectPipelineStateDetails";
import {ProjectPipelineCycleTimeLatencyView} from "./projectPipelineCycleTimeLatencyView";


export const ProjectPipelineCycleTimeLatencyWidget = (
  {
    instanceKey,
    specsOnly,
    stateTypes,
    latestWorkItemEvent,
    latestCommit,
    days,
    cycleTimeTarget,
    latencyTarget,
    stageName,
    groupByState,

    view,
    context
  }
) => {



  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    specsOnly,
    referenceString: latestWorkItemEvent
  })
  if (loading || error) return <Loading/>;
  const workItems = data['project']['workItems']['edges'].map(edge => edge.node);

  return (
    workItems.length > 0 &&
      <ProjectPipelineCycleTimeLatencyView
        stageName={stageName}
        specsOnly={specsOnly}
        workItems={workItems}
        stateTypes={stateTypes}
        groupByState={groupByState}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        view={view}
        context={context}
      />
  )
}