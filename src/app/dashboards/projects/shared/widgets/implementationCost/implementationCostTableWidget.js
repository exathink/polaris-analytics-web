import React from "react";

import {useQueryImplementationCostTable} from "./useQueryProjectImplementationCost";
import {getReferenceString} from "../../../../../helpers/utility";
import {Loading} from "../../../../../components/graphql/loading";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {ImplementationCostTableView} from "./implementationCostTableView";

export const ImplementationCostTableWidget = (
  {
    instanceKey,
    days,
    latestCommit,
    latestWorkItemEvent,
    view,
    intl
  }
) => {
  const {loading, error, data} = useQueryImplementationCostTable({
    instanceKey,
    days: days,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit)
  })
  if (loading) return <Loading/>;
  if (error) {
    logGraphQlError('ImplementationCostTableWidget.useQueryImplementationCostTable', error);
    return null;
  }

  const workItems = data.project.workItems.edges.map(edge => edge.node);

  return (
    <ImplementationCostTableView
      loading={loading}
      workItems={workItems}
      days={days}
      view={view}
      intl={intl}
      />
  )
}

