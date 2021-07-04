import React from 'react';
import WorkItems from "../../../../../work_items/context";
import {WorkItemsEffortChart} from "../../../../charts/workItemCharts/workItemsEffortChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {WorkItemScopeSelector} from "../../../../../projects/shared/components/workItemScopeSelector";
import {Flex} from "reflexbox";

export const DimensionWipEffortView = (
  {
    workItems,
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
            specsOnly={specsOnly}
            workItems={workItems}
            onSelectionChange={
              (workItems) => {
                if (workItems.length === 1) {
                  context.navigate(WorkItems, workItems[0].displayId, workItems[0].key)
                }
              }
            }
          />
        </div>
      </VizItem>
    </VizRow>
  )

}