import React from "react";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {getWorkItemDurations} from "../../../../shared/charts/workItemCharts/shared";

export const CycleTimeLatencyTableView = ({workItems}) => {
  const workItemsWithAggregateDurations = getWorkItemDurations(workItems);
  return <CycleTimeLatencyTable tableData={workItemsWithAggregateDurations} />;
};
