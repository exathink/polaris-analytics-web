import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";
import {useQueryProjectPipelineStateDetails} from "../../hooks/useQueryProjectPipelineStateDetails";
import {ProjectPipelineCycleTimeLatencyView} from "./projectPipelineCycleTimeLatencyView";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";
import {ProjectPipelineCycleTimeLatencyDetailDashboard} from "./projectPipelineCycleTimeLatencyDetailDashboard";


export const ProjectPipelineCycleTimeLatencyWidget = (
  {
    instanceKey,
    specsOnly,
    workItemScope,
    setWorkItemScope,
    stateTypes,
    latestWorkItemEvent,
    latestCommit,
    days,
    cycleTimeTarget,
    targetPercentile,
    latencyTarget,
    stageName,
    groupByState,
    includeSubTasks,
    tooltipType,
    view,
    context,
    drawerCallBacks
  }
) => {



  const {loading, error, data} = useQueryProjectPipelineStateDetails({
    instanceKey,
    specsOnly,
    activeOnly: true,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('ProjectPipelineCycleTimeLatencyWidget.pipelineStateDetails', error);
    return null;
  }
  const workItems = data['project']['workItems']['edges'].map(edge => edge.node);

  if (view === "detail") {
    return (
      <ProjectPipelineCycleTimeLatencyDetailDashboard
        instanceKey={instanceKey}
        latestWorkItemEvent={latestWorkItemEvent}
        latestCommit={latestCommit}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
        specsOnly={specsOnly}
        days={days}
        cycleTimeTarget={cycleTimeTarget}
        targetPercentile={targetPercentile}
        includeSubTasks={includeSubTasks}
        view={view}
        context={context}
      />
    );
  } else {
    return (
      <ProjectPipelineCycleTimeLatencyView
        stageName={stageName}
        specsOnly={specsOnly}
        workItemScope={workItemScope}
        setWorkItemScope={setWorkItemScope}
        workItems={workItems}
        stateTypes={stateTypes}
        groupByState={groupByState}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        tooltipType={tooltipType}
        view={view}
        context={context}
        drawerCallBacks={drawerCallBacks}
      />
    );
  }
}

ProjectPipelineCycleTimeLatencyWidget.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "Engineering",
  VideoDescription: () => (
    <>
      <h2>Engineering</h2>
      <p> lorem ipsum </p>
    </>
  ),
};