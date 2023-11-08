import {useQueryProjectFunnelCounts} from "../../hooks/useQueryProjectFunnelCounts";
import {Loading} from "../../../../../components/graphql/loading";
import {ProjectPipelinePhaseSummaryView} from "./projectPipelinePhaseSummaryView";
import React from "react";

export const ProjectPipelinePhaseSummaryWidget = (
  {
    instanceKey,
    specsOnly,
    latestWorkItemEvent,
    stateMappingIndex,
    includeSubTasks,
    view
  }
) => {
  const {loading, error, data} = useQueryProjectFunnelCounts({
    instanceKey,
    includeSubTasks: {includeSubTasksInNonClosedState: includeSubTasks},
    specsOnly: specsOnly,
    referenceString: latestWorkItemEvent
  })
    if (loading ) return <Loading/>;
    if (error) return null;
    const  {workItemStateTypeCounts} = data['project'];
    return (
      <ProjectPipelinePhaseSummaryView
        model={workItemStateTypeCounts}
        stateMappingIndex={stateMappingIndex}
      />
    )
}