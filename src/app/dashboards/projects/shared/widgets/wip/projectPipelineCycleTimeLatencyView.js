import React from 'react';
import WorkItems from "../../../../work_items/context";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../shared/charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {useGenerateTicks} from "../../../../shared/hooks/useGenerateTicks";

export const ProjectPipelineCycleTimeLatencyView = (
  {
    stageName,
    workItems,
    stateTypes,
    groupByState,
    cycleTimeTarget,
    latencyTarget,
    specsOnly,
    tooltipType,
    view,
    context,
    drawerCallBacks
  }
) => {
  const tick = useGenerateTicks(2, 60000);
  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <WorkItemsCycleTimeVsLatencyChart
          view={view}
          stageName={stageName}
          specsOnly={specsOnly}
          workItems={workItems}
          stateTypes={stateTypes}
          groupByState={groupByState}
          cycleTimeTarget={cycleTimeTarget}
          latencyTarget={latencyTarget}
          tick={tick}
          tooltipType={tooltipType}
          onSelectionChange={
            (workItems) => {
              if (workItems.length === 1) {
                if (drawerCallBacks) {
                  const {setWorkItemKey, setShowPanel, setPlacement} = drawerCallBacks;
                  setPlacement("bottom");
                  setWorkItemKey(workItems[0].key);
                  setShowPanel(true);
                } else {
                  context.navigate(WorkItems, workItems[0].displayId, workItems[0].key)
                }
              }
            }
          }
        />
      </VizItem>
    </VizRow>
  )

}