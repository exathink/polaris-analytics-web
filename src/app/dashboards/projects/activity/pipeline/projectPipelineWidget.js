import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {ProjectPipelineSummaryView} from "./projectPipelineSummaryView";
import {ProjectPipelineDetailDashboard} from "./projectPipelineDetailDashboard"

import {useQueryProjectWorkItemSummaries} from "../hooks/useQueryProjectWorkItemSummaries";

export const ProjectPipelineWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,
    view,
    pollInterval
  }) => {
  if (view === 'primary') {
    const {loading, error, data} = useQueryProjectWorkItemSummaries({instanceKey, referenceString: latestWorkItemEvent})
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
      />
    )
  }

}



