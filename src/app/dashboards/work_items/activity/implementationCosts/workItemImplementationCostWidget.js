import React from 'react';
import {Loading} from "../../../../components/graphql/loading";

import {useQueryWorkItemImplementationCost} from "../hooks/useQueryWorkItemImplementationCost";
import {WorkItemImplementationCostView} from "./workItemImplementationCostView";

export const WorkItemImplementationCostWidget = (
  {
    instanceKey,
    latestWorkItemEvent,
    view
  }
) => {
  const {loading, error, data} = useQueryWorkItemImplementationCost(
    {instanceKey, referenceString: latestWorkItemEvent}
  );

  if (loading) return <Loading/>;
  if (error) return null;
  const workItem = data['workItem'];

  return (
    <WorkItemImplementationCostView
      workItem={workItem}
      view={view}
    />
  )
}
