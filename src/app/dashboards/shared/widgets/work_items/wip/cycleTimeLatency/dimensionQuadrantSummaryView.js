import classNames from "classnames";
import React from "react";
import { getWorkItemDurations } from "../../clientSideFlowMetrics";
import { MotionEfficiencyQuadrantSummaryCard } from "./motionEfficiencyQuadrantSummaryCard";
import {Quadrants, getQuadrant} from "./cycleTimeLatencyUtils";

export const DimensionQuadrantSummaryView = ({
  dimension,
  stageName,
  data,
  stateTypes,
  groupByState,
  cycleTimeTarget,
  latencyTarget,
  displayBag,
  specsOnly,
  excludeAbandoned,
  tooltipType,
  view,
  context,
}) => {
  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);

  const initTransformedData = excludeAbandoned
    ? getWorkItemDurations(workItems).filter(
        (w) => getQuadrant(w.cycleTime, w.latency, cycleTimeTarget, latencyTarget) !== Quadrants.abandoned
      )
    : getWorkItemDurations(workItems);

  return (
    <MotionEfficiencyQuadrantSummaryCard
      workItems={initTransformedData}
      stateTypes={stateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      className="tw-h-full"
      displayBag={{...displayBag, className: classNames("tw-mx-auto tw-h-full tw-w-[98%]", displayBag?.fontSize)}}
     />
  );
};
