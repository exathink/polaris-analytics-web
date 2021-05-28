import React from 'react';
import {Loading} from "../../../../../components/graphql/loading";
import {ProjectPipelineDetailDashboard} from "./projectPipelineDetailDashboard"
import {useQueryProjectPipelineCycleMetrics} from "../../hooks/useQueryProjectPipelineCycleMetrics";
import {ProjectPipelineSummaryView} from "./projectPipelineSummaryView";
import {getReferenceString} from "../../../../../helpers/utility";

export const ProjectPipelineWidget = (
  {
    instanceKey,
    display,
    specsOnly,
    latestCommit,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    cycleTimeTarget,
    wipLimit,
    view,
    context,
    includeSubTasks: {includeSubTasksInNonClosedState},
    pollInterval
  }) => {
  const includeSubTasks = {includeSubTasksInNonClosedState}
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const {loading, error, data} = useQueryProjectPipelineCycleMetrics(
    {
      instanceKey,
      targetPercentile,
      leadTimeTargetPercentile,
      cycleTimeTargetPercentile,
      specsOnly: limitToSpecsOnly,
      includeSubTasks: includeSubTasksInNonClosedState,
      referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
    }
  )
  if (loading) return <Loading/>;
  if (error) return null;
  const pipelineCycleMetrics = data['project']['pipelineCycleMetrics'];

  if (view === 'primary') {
    return (
      <ProjectPipelineSummaryView
        pipelineCycleMetrics={pipelineCycleMetrics}
        display={display}
        latestCommit={latestCommit}
        targetPercentile={targetPercentile}
        leadTimeTargetPercentile={leadTimeTargetPercentile}
        cycleTimeTargetPercentile={cycleTimeTargetPercentile}
        cycleTimeTarget={cycleTimeTarget}
        wipLimit={wipLimit}
        specsOnly={limitToSpecsOnly}
      />
    )
  } else {
    return (
      <ProjectPipelineDetailDashboard
        instanceKey={instanceKey}
        latestWorkItemEvent={latestWorkItemEvent}
        stateMappingIndex={stateMappingIndex}
        days={days}
        targetPercentile={targetPercentile}
        leadTimeTargetPercentile={leadTimeTargetPercentile}
        cycleTimeTargetPercentile={cycleTimeTargetPercentile}
        specsOnly={limitToSpecsOnly}
        context={context}
        includeSubTasks={includeSubTasks}
      />
    )
  }

}

ProjectPipelineWidget.videoConfig = {
  url: "https://vimeo.com/501974487/080d487fcf",
  title: "WIP",
  VideoDescription: () => (
    <>
      <h2>Work In Progress</h2>
      <p> lorem ipsum </p>
    </>
  ),
};

