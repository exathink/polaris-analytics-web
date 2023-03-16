import React from "react";

import { useQueryImplementationCostTable } from "./useQueryProjectEpicEffort";
import { getReferenceString } from "../../../../../helpers/utility";
import { logGraphQlError } from "../../../../../components/graphql/utils";

import { ValueBookDetailView } from "./valueBookDetailView";
import { useQueryParamState } from "../../../../projects/shared/helper/hooks";

export const ValueBookDetailWidget = ({
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
  const {state: {workItemSelectors=[]}} = useQueryParamState();
  const {loading, error, data, previousData} = useQueryImplementationCostTable({
    instanceKey,
    tags: workItemSelectors,
    closedWithinDays: closedWithinDays,
    activeOnly: activeOnly,
    specsOnly: specsOnly,
    includeSubTasks: includeSubTasks,
    referenceString: getReferenceString(latestWorkItemEvent, latestCommit),
  });

  if (error) {
    logGraphQlError("ValueBookDetailWidget.useQueryImplementationCostTable", error);
    return null;
  }

  const queryData = data || previousData;

  return (
    <ValueBookDetailView
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
