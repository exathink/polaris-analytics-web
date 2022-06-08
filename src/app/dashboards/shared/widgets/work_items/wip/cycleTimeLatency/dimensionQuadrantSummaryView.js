import React from "react";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import {VizItem, VizRow} from "../../../../containers/layout";
import {useGenerateTicks} from "../../../../hooks/useGenerateTicks";
import {EVENT_TYPES} from "../../../../../../helpers/utility";
import {CardInspectorWithDrawer, useCardInspector} from "../../../../../work_items/cardInspector/cardInspectorUtils";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";

export const DimensionQuadrantSummaryView = ({
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
}) => {
  const tick = useGenerateTicks(2, 60000);

  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  return (
    <VizRow h={1}>
      <VizItem w={1}>
        <div className={`tw-flex tw-h-auto tw-items-center`}>
          <QuadrantSummaryPanel
            workItems={workItems}
            stateTypes={stateTypes}
            cycleTimeTarget={cycleTimeTarget}
            latencyTarget={latencyTarget}
            className="tw-w-[98%] tw-mx-auto"
          />
        </div>
      </VizItem>
    </VizRow>
  );
};
