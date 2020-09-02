import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {ProjectPipelineDetailDashboard} from "./projectPipelineDetailDashboard"
import {useQueryProjectPipelineCycleMetrics} from "../hooks/useQueryProjectPipelineCycleMetrics";
import {ProjectPipelineSummaryView} from "./projectPipelineSummaryView";

export const ProjectPipelineWidget = (
  {
    instanceKey,
    specsOnly,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile,
    view,
    context,
    pollInterval
  }) => {
  if (view === 'primary') {
    const {loading, error, data} = useQueryProjectPipelineCycleMetrics(
      {
        instanceKey,
        targetPercentile,
        specsOnly: specsOnly,
        referenceString: latestWorkItemEvent
      }
    )
    if (loading || !stateMappingIndex || !stateMappingIndex.isValid()) return <Loading/>;
    if (error) return null;
    const pipelineCycleMetrics = data['project']['pipelineCycleMetrics'];
    return (
      <ProjectPipelineSummaryView
        pipelineCycleMetrics={pipelineCycleMetrics}
        targetPercentile={targetPercentile}
        specsOnly={specsOnly}
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
        specsOnly={specsOnly}
        context={context}
      />
    )
  }

}



