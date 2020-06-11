import React from 'react';
import {Loading} from "../../../../components/graphql/loading";

import {useQueryWorkItemDurationDetail} from "../hooks/useQueryWorkItemDurationDetail";
import {WorkItemFlowMetricsView} from "./workItemFlowMetricsView";

export const WorkItemFlowMetricsWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    view
  }
) => {
  const {loading, error, data} = useQueryWorkItemDurationDetail(
    {instanceKey, referenceString: latestWorkItemEvent}
  );

  if (loading) return <Loading/>;
  if (error) return null;
  const workItem = data['workItem'];

  return (
    <WorkItemFlowMetricsView
      workItem={workItem}
      view={view}
    />
  )
}
