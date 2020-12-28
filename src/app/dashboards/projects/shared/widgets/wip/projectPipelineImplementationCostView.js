import React from 'react';
import WorkItems from "../../../../work_items/context";
import {WorkItemsEffortChart} from "../../../../shared/charts/workItemCharts/workItemsEffortChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {WorkItemScopeSelector} from "../../components/workItemScopeSelector";
import {Flex} from "reflexbox";

export const ProjectPipelineImplementationCostView = (
  {
    workItems,
    specsOnly,
    workItemScope,
    setWorkItemScope,
    view,
    context
  }
) => {
  const [visibleSeries, setVisibleSeries] = React.useState([]);
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
            visibleSeries={visibleSeries}
            onSelectionChange={
              (workItems, options={}) => {
                if (workItems.length === 1) {
                  context.navigate(WorkItems, workItems[0].displayId, workItems[0].key)
                }
                if (options.visibleSeries) {
                  setVisibleSeries(options.visibleSeries)
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