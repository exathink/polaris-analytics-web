import React from "react";
import {Loading} from "../../../../components/graphql/loading";
import {WorkItemDetailView} from "./workItemDetailView";

import {useQueryWorkItemDetail} from "../hooks/useQueryWorkItemDetail";

export const WorkItemDetailsWidget = (
  {
    instanceKey,
    view,
    latestWorkItemEvent,
    pollInterval
  }) => {

    const {loading, error, data} = useQueryWorkItemDetail(
      {instanceKey, referenceString: latestWorkItemEvent}
    );
    if (loading) return <Loading/>;
    if (error) return null;
    const workItem = data['workItem'];
    return (
      <WorkItemDetailView
        instanceKey={instanceKey}
        workItem={workItem}
      />
    )
}
