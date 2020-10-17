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
    cycleTimeTarget,
    latencyTarget,
    view,
    context
  }
) => {

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <WorkItemsCycleTimeVsLatencyChart
          view={view}
          stageName={stageName}
          workItems={workItems}
          stateTypes={stateTypes}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
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