import React from 'react';
import WorkItems from "../../../../work_items/context";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../shared/charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {useGenerateTicks} from "../../../../shared/hooks/useGenerateTicks";
import {isObjectEmpty} from "../../helper/utils";
import {WorkItemStateTypeDisplayName} from "../../../../shared/config";
import {getQuadrantColor} from "./cycleTimeLatencyUtils";
import {getWorkItemDurations} from "../../../../shared/charts/workItemCharts/shared";

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
    appliedFilters
  }
) => {
  const tick = useGenerateTicks(2, 60000);

  const applyFiltersTest = React.useCallback((node) => {
    const [nodeWithAggrDurations] = getWorkItemDurations([node]);
    const calculatedColumns = {
      stateType: WorkItemStateTypeDisplayName[node.stateType],
      quadrant: getQuadrantColor({
        cycleTime: nodeWithAggrDurations.cycleTime,
        latency: nodeWithAggrDurations.latency,
        cycleTimeTarget,
        latencyTarget,
      }),
    };
    const newNode = {...node, ...calculatedColumns};
    const localAppliedFilters = appliedFilters || {};
    if (isObjectEmpty(localAppliedFilters)) {
      return true;
    } else {
      const entries = Object.entries(localAppliedFilters).filter(([_, filterVals]) => filterVals != null);
      return entries.every(([filterKey, filterVals]) =>
        filterVals.some((filterVal) => {
          const re = new RegExp(filterVal, "i");
          return newNode[filterKey].indexOf(filterVal) === 0 || newNode[filterKey].match(re);
        })
      );
    }
  }, [appliedFilters, cycleTimeTarget, latencyTarget]);

  const workItems = React.useMemo(() => {
    const edges = data?.["project"]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node).filter(applyFiltersTest);
  }, [data, applyFiltersTest]);

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