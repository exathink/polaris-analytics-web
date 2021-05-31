import React from 'react';
import {Loading} from "../../../../components/graphql/loading";

import {useQueryWorkItemDurationDetail} from "../hooks/useQueryWorkItemDurationDetail";
import {WorkItemDurationDetailsByPhaseView} from "./workItemDurationDetailsByPhaseView";

export const WorkItemDurationDetailsByPhaseWidget = (
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
    <WorkItemDurationDetailsByPhaseView
      workItem={workItem}
      view={view}
    />
  )
}
