import React from "react";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {getWorkItemDurations} from "../../../../shared/charts/workItemCharts/shared";

export const CycleTimeLatencyTableView = ({workItems, callBacks, appliedFilters}) => {
  const workItemsWithAggregateDurations = getWorkItemDurations(workItems);
  return (
    <CycleTimeLatencyTable
      tableData={workItemsWithAggregateDurations}
      callBacks={callBacks}
      appliedFilters={appliedFilters}
    />
  );
};
