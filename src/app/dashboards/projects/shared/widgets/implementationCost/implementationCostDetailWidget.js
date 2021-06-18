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

  return (
    <ImplementationCostDetailView
      instanceKey={instanceKey}
      data={queryData}
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
