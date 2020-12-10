import {useQueryProjectPipelineSummary} from "../../hooks/useQueryProjectPipelineSummary";
import {Loading} from "../../../../../components/graphql/loading";
import {ProjectPipelinePhaseSummaryView} from "./projectPipelinePhaseSummaryView";
import React from "react";

export const ProjectPhaseSummaryWidget = (
  {
    instanceKey,
    specsOnly,
    latestWorkItemEvent,
    stateMappingIndex,
    view
  }
) => {
  const {loading, error, data} = useQueryProjectPipelineSummary({
    instanceKey,
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