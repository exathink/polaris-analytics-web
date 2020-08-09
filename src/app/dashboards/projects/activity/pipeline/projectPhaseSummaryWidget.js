import {useQueryProjectPipelineSummary} from "../hooks/useQueryProjectPipelineSummary";
import {Loading} from "../../../../components/graphql/loading";
import {ProjectPipelineSummaryView} from "./projectPipelineSummaryView";
import React from "react";

export const ProjectPhaseSummaryWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,
    view
  }
) => {
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
}