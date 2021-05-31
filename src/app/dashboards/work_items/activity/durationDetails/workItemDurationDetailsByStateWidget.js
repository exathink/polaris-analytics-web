import React from 'react';
import {Loading} from "../../../../components/graphql/loading";

import {useQueryWorkItemDurationDetail} from "../hooks/useQueryWorkItemDurationDetail";
import {WorkItemDurationDetailsByStateView} from "./workItemDurationDetailsByStateView";

export const WorkItemDurationDetailsByStateWidget = (
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
    <WorkItemDurationDetailsByStateView
      workItem={workItem}
      view={view}
    />
  )
}
