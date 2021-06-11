import React from 'react';
import WorkItems from "../../../../work_items/context";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../shared/charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../shared/containers/layout";
import {useGenerateTicks} from "../../../../shared/hooks/useGenerateTicks";
import {EVENT_TYPES} from "../../../../../helpers/utility";

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
  }
) => {
  const tick = useGenerateTicks(2, 60000);

  const workItems = React.useMemo(() => {
    const edges = data?.["project"]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data]);

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
          onSelectionChange={(workItems, eventType) => {
            if (eventType === EVENT_TYPES.POINT_CLICK) {
              context.navigate(WorkItems, workItems[0].displayId, workItems[0].key);
            }
          }}
        />
      </VizItem>
    </VizRow>
  );

}