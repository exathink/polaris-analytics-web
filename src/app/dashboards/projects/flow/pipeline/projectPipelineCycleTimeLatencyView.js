import React from 'react';
import WorkItems from "../../../work_items/context";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../shared/charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {Flex} from "reflexbox";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector";

export const ProjectPipelineCycleTimeLatencyView = (
  {
    stageName,
    workItems,
    stateTypes,
    groupByState,
    cycleTimeTarget,
    latencyTarget,
    specsOnly,
    workItemScope,
    setWorkItemScope,
    view,
    context
  }
) => {

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        {
            view === 'detail' &&
            <Flex w={1} justify={'center'}>
              <WorkItemScopeSelector
                workItemScope={workItemScope}
                setWorkItemScope={setWorkItemScope}
              />
            </Flex>
        }
        <WorkItemsCycleTimeVsLatencyChart
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