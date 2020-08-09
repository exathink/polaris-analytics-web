import React from 'react';
import {ProjectPipelineDetailDashboard} from "./projectPipelineDetailDashboard"

export const ProjectPipelineWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,
    days,
    targetPercentile,
    view,
    context,
    pollInterval
  }) => {
  if (view === 'primary') {
    return null;
  } else {
    return (
      <ProjectPipelineDetailDashboard
        instanceKey={instanceKey}
        latestWorkItemEvent={latestWorkItemEvent}
        stateMappingIndex={stateMappingIndex}
        days={days}
        targetPercentile={targetPercentile}
        context={context}
      />
    )
  }

}



