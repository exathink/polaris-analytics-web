import React from "react";
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
  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  return (
    <div className={`tw-my-auto tw-flex tw-h-auto tw-items-center`}>
      <QuadrantSummaryPanel
        workItems={workItems}
        stateTypes={stateTypes}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        className="tw-mx-auto tw-w-[98%]"
      />
    </div>
  );
};
