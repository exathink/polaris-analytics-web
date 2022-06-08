import React from "react";
import { VizItem, VizRow } from "../../../../containers/layout";
import { QuadrantSummaryPanel } from "../../../../charts/workItemCharts/quadrantSummaryPanel";

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
