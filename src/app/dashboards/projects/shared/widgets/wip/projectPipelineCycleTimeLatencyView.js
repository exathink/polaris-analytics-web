import React from 'react';
import WorkItems from "../../../../work_items/context";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../shared/charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {useGenerateTicks} from "../../../../shared/hooks/useGenerateTicks";
import {isObjectEmpty} from "../../helper/utils";
import {WorkItemStateTypeDisplayName} from "../../../../shared/config";

export const ProjectPipelineCycleTimeLatencyView = (
  {
    stageName,
    data,
    stateTypes,
    groupByState,
    cycleTimeTarget,
    latencyTarget,
    specsOnly,
    tooltipType,
    view,
    context,
    callBacks,
    appliedFilters = {}
  }
) => {
  const tick = useGenerateTicks(2, 60000);

  const applyFiltersTest = React.useCallback((node) => {
    const newNode = {...node, stateType: WorkItemStateTypeDisplayName[node.stateType]};
    if (isObjectEmpty(appliedFilters)) {
      return true;
    } else {
      const entries = Object.entries(appliedFilters).filter(([_, filterVals]) => filterVals != null);
      return entries.every(([filterKey, filterVals]) =>
        filterVals.some((filterVal) => {
          const re = new RegExp(filterVal, "i");
          return newNode[filterKey].indexOf(filterVal) === 0 || newNode[filterKey].match(re);
        })
      );
    }
  }, [appliedFilters])

  const workItems = React.useMemo(() => data['project']['workItems']['edges'].map(edge => edge.node).filter(applyFiltersTest), [data, applyFiltersTest]);

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
                if (callBacks) {
                  const {setWorkItemKey, setShowPanel, setPlacement} = callBacks;
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