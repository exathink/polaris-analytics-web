import React from 'react';
import WorkItems from "../../../work_items/context";
import {WorkItemsEffortChart} from "../../../shared/charts/workItemCharts/workItemsEffortChart";
import {VizItem, VizRow} from "../../../shared/containers/layout";
import {WorkItemScopeSelector} from "../../shared/components/workItemScopeSelector";
import {Flex} from "reflexbox";

export const ProjectPipelineImplementationCostView = (
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
        <div style={{width: "100%", height: "100%"}}>
          {
            view === 'detail' &&
            <Flex w={1} justify={'center'}>
              <WorkItemScopeSelector
                workItemScope={workItemScope}
                setWorkItemScope={setWorkItemScope}
              />
            </Flex>
          }
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
          {
            view === 'primary' &&
            <Flex w={1} justify={'center'}>
              <WorkItemScopeSelector
                workItemScope={workItemScope}
                setWorkItemScope={setWorkItemScope}
              />
            </Flex>
          }
        </div>
      </VizItem>
    </VizRow>
  )

}