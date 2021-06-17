import React from "react";

import {useQueryImplementationCostTable} from "./useQueryProjectImplementationCost";
import {getReferenceString} from "../../../../../helpers/utility";
import {logGraphQlError} from "../../../../../components/graphql/utils";

import {ImplementationCostDetailView} from "./implementationCostDetailView";

export const ImplementationCostDetailWidget = ({
  instanceKey,
  closedWithinDays,
  activeOnly,
  latestCommit,
  latestWorkItemEvent,
  view,
  specsOnly,
  includeSubTasks,
  epicChartData,
  context,
  workItemScope,
  setWorkItemScope,
  setClosedWithinDays,
}) => {
  const {loading, error, data, previousData} = useQueryImplementationCostTable({
    instanceKey,
    closedWithinDays: closedWithinDays,
    activeOnly: activeOnly,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  if (error) {
    logGraphQlError("ImplementationCostDetailWidget.useQueryImplementationCostTable", error);
    return null;
  }

  const queryData = data || previousData;
  const workItems = queryData ? queryData.project.workItems.edges.map((edge) => edge.node) : [];

  return (
    <ImplementationCostDetailView
      instanceKey={instanceKey}
      workItems={workItems}
      loading={loading}
      epicChartData={epicChartData}
      activeOnly={activeOnly}
      specsOnly={specsOnly}
      days={closedWithinDays}
      context={context}
      workItemScope={workItemScope}
      setWorkItemScope={setWorkItemScope}
      setClosedWithinDays={setClosedWithinDays}
    />
  );
};
