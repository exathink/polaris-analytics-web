import React from "react";

import {useQueryImplementationCostTable} from "./useQueryProjectImplementationCost";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {ImplementationCostTableView} from "./implementationCostTableView";

export const ImplementationCostTableWidget = (
  {
    instanceKey,
    closedWithinDays,
    activeOnly,
    latestCommit,
    latestWorkItemEvent,
    view,
    specsOnly,
    includeSubTasks
  }
) => {

  const {loading, error, data, previousData} = useQueryImplementationCostTable({
    instanceKey,
    closedWithinDays: closedWithinDays,
    activeOnly: activeOnly,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })

  if (error) {
    logGraphQlError('ImplementationCostTableWidget.useQueryImplementationCostTable', error);
    return null;
  }

  const queryData =  (data || previousData);
  const workItems = queryData ? queryData.project.workItems.edges.map(edge => edge.node) : [];

  return (
    <ImplementationCostTableView
      instanceKey={instanceKey}
      workItems={workItems}
      loading={loading}
      />
  )
}

