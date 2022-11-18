import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemsAggregateDurationsByStateChart} from "../../../shared/charts/workItemCharts/workItemsAggregateDurationsByStateChart";

export const WorkItemDurationDetailsByStateView = ({workItem, view}) => {

  return <VizRow h={160}>
    <VizItem w={1}>
      <WorkItemsAggregateDurationsByStateChart
        workItems={[workItem]}
        title={workItem.stateType !== "closed" ? "Time spent by state" : "Lead time by state"}
      />
    </VizItem>
  </VizRow>
}
