import React from "react";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {getWorkItemDurations} from "../../../../shared/charts/workItemCharts/shared";

export const CycleTimeLatencyTableView = ({workItems, drawerCallBacks}) => {
  const workItemsWithAggregateDurations = getWorkItemDurations(workItems);
  return (
    <CycleTimeLatencyTable
      tableData={workItemsWithAggregateDurations}
      drawerCallBacks={drawerCallBacks}
    />
  );
};
