import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {ProjectPipelineDetailDashboard} from "./projectPipelineDetailDashboard"
import {useQueryProjectPipelineCycleMetrics} from "../hooks/useQueryProjectPipelineCycleMetrics";
import {ProjectPipelineSummaryView} from "./projectPipelineSummaryView";
import {getReferenceString} from "../../../../helpers/utility";

export const ProjectPipelineWidget = (
  {
    instanceKey,
    specsOnly,
    latestCommit,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile,
    leadTimeTargetPercentile,
    cycleTimeTargetPercentile,
    cycleTimeTarget,
    view,
    context,
    pollInterval
  }) => {
  const limitToSpecsOnly = specsOnly != null ? specsOnly : true;

  if (view === 'primary') {
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
    return (
      <ProjectPipelineSummaryView
        pipelineCycleMetrics={pipelineCycleMetrics}
        targetPercentile={targetPercentile}
        leadTimeTargetPercentile={leadTimeTargetPercentile}
        cycleTimeTargetPercentile={cycleTimeTargetPercentile}
        cycleTimeTarget={cycleTimeTarget}
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



