import React from 'react';
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {useGenerateTicks} from "../../../../hooks/useGenerateTicks";
import {EVENT_TYPES} from "../../../../../../helpers/utility";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";

export const DimensionCycleTimeLatencyView = (
  {
    dimension,
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
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div className="tw-h-[22%] tw-flex tw-items-center">
          <QuadrantSummaryPanel
            workItems={workItems}
            stateTypes={stateTypes}
            cycleTimeTarget={cycleTimeTarget}
            latencyTarget={latencyTarget}
            className="tw-w-[90%]"
          />
        </div>
        <div className="tw-h-[78%]">
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
                setWorkItemKey(workItems[0].key);
                setShowPanel(true);
              }
            }}
          />
        </div>
        <CardInspectorWithDrawer
          workItemKey={workItemKey}
          context={context}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          drawerOptions={{placement: "bottom"}}
        />
      </VizItem>
    </VizRow>
  );

}