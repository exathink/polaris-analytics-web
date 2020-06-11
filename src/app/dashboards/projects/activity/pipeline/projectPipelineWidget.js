import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {ProjectPipelineSummaryView} from "./projectPipelineSummaryView";
import {ProjectPipelineDetailDashboard} from "./projectPipelineDetailDashboard"

import {useQueryProjectPipelineSummary} from "../hooks/useQueryProjectPipelineSummary";

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
    const {loading, error, data} = useQueryProjectPipelineSummary({instanceKey, referenceString: latestWorkItemEvent})
    if (loading || !stateMappingIndex || !stateMappingIndex.isValid()) return <Loading/>;
    if (error) return null;
    const {...workItemStateTypeCounts} = data['project']['workItemStateTypeCounts'];
    return (
      <ProjectPipelineSummaryView
        model={
          {

            ...workItemStateTypeCounts

          }
        }
        stateMappingIndex={stateMappingIndex}
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
        context={context}
      />
    )
  }

}



