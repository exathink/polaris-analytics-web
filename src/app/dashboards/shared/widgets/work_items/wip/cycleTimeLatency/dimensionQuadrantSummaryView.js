import classNames from "classnames";
import React from "react";
import { getWorkItemDurations } from "../../clientSideFlowMetrics";
import { MotionEfficiencyQuadrantSummaryCard } from "./motionEfficiencyQuadrantSummaryCard";
import {Quadrants, getQuadrant} from "./cycleTimeLatencyUtils";
import { useWipData } from "../../../../../../helpers/hooksUtil";

export const DimensionQuadrantSummaryView = ({
  dimension,
  stageName,
  wipDataAll,
  stateTypes,
  groupByState,
  cycleTimeTarget,
  latencyTarget,
  displayBag,
  specsOnly,
  excludeMotionless,
  tooltipType,
  view,
  context,
}) => {
  const {wipWorkItems: workItems} = useWipData({wipDataAll, specsOnly, dimension});
  const initTransformedData = excludeMotionless
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
      context={context}
      displayBag={{...displayBag, className: classNames("tw-mx-auto tw-h-full tw-w-[98%]", displayBag?.fontSize), excludeMotionless}}
     />
  );
};
