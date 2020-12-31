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
    pollInterval
  }) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;
  const {loading, error, data} = useQueryProjectPipelineCycleMetrics(
    {
      instanceKey,
      targetPercentile,
      leadTimeTargetPercentile,
      cycleTimeTargetPercentile,
      specsOnly: limitToSpecsOnly,
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
      />
    )
  }

}



