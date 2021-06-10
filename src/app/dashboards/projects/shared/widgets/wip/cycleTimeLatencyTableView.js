import React from "react";
import {CycleTimeLatencyTable} from "./cycleTimeLatencyTable";
import {getWorkItemDurations} from "../../../../shared/charts/workItemCharts/shared";

export const CycleTimeLatencyTableView = ({data, callBacks, appliedFilters, cycleTimeTarget, latencyTarget}) => {

  const workItems = React.useMemo(() => {
    const edges = data?.["project"]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data]);
  
  const workItemsWithAggregateDurations = getWorkItemDurations(workItems);
  return (
    <CycleTimeLatencyTable
      tableData={workItemsWithAggregateDurations}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      callBacks={callBacks}
      appliedFilters={appliedFilters}
    />
  );
};
