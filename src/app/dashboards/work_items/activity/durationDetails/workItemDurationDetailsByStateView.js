import React from "react";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemsAggregateDurationsByStateChart} from "../../../shared/charts/workItemCharts/workItemsAggregateDurationsByStateChart";
import {useFlowEfficiency} from "../../../projects/shared/helper/hooks";

export const WorkItemDurationDetailsByStateView = ({workItem, view}) => {
  const flowEfficiencyPercentage = useFlowEfficiency([workItem]);

  return <VizRow h={160}>
    <VizItem w={1}>
      <WorkItemsAggregateDurationsByStateChart
        workItems={[workItem]}
        title={`Flow Efficiency ${flowEfficiencyPercentage}`}
      />
    </VizItem>
  </VizRow>
}
