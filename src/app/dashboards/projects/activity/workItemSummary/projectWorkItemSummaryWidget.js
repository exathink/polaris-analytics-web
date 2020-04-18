import React from 'react';
import {Loading} from "../../../../components/graphql/loading";
import {WorkItemSummaryPanel} from "./workItemSummaryPanelView";

import {useQueryProjectWorkItemSummaries} from "../hooks/useQueryProjectWorkItemSummaries";

export const ProjectWorkItemSummaryWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    stateMappingIndex,
    pollInterval
  }) => {
  const {loading, error, data} = useQueryProjectWorkItemSummaries({instanceKey, referenceString: latestWorkItemEvent})
  if (loading || !stateMappingIndex || !stateMappingIndex.isValid()) return <Loading/>;
  if (error) return null;
  const {...workItemStateTypeCounts} = data['project']['workItemStateTypeCounts'];
  return (
    <WorkItemSummaryPanel
      model={
        {

          ...workItemStateTypeCounts

        }
      }
      stateMappingIndex={stateMappingIndex}
    />
  )

}



