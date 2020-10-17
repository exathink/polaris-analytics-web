import React from 'react';
import WorkItems from "../../../work_items/context";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../shared/charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";

export const ProjectPipelineCycleTimeLatencyView = (
  {
    stageName,
    workItems,
    stateTypes,
    groupByState,

    targetPercentile,
    cycleTimeTarget,
    view,
    context
  }
) => {

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <WorkItemsCycleTimeVsLatencyChart
          stageName={stageName}
          workItems={workItems}
          stateTypes={stateTypes}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          onSelectionChange={
            (workItems) => {
              if (workItems.length === 1) {
                context.navigate(WorkItems, workItems[0].displayId, workItems[0].key)
              }
            }
          }
        />
      </VizItem>
    </VizRow>
  )

}