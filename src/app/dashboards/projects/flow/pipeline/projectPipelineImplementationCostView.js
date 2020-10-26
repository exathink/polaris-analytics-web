import React from 'react';
import WorkItems from "../../../work_items/context";
import {WorkItemsEffortChart} from "../../../shared/charts/workItemCharts/workItemsEffortChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";

export const ProjectPipelineImplementationCostView = (
  {
    stageName,
    workItems,
    stateTypes,
    groupByState,
    cycleTimeTarget,
    latencyTarget,
    specsOnly,
    view,
    context
  }
) => {

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <WorkItemsEffortChart
          view={view}
          stageName={stageName}
          specsOnly={specsOnly}
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