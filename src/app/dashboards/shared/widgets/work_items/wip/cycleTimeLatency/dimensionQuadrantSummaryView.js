import classNames from "classnames";
import React from "react";
import { getWorkItemDurations } from "../../clientSideFlowMetrics";
import { MotionEfficiencyQuadrantSummaryCard } from "./motionEfficiencyQuadrantSummaryCard";

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
  tooltipType,
  view,
  context,
}) => {
  const workItems = React.useMemo(() => {
    const edges = data?.[dimension]?.["workItems"]?.["edges"] ?? [];
    return edges.map((edge) => edge.node);
  }, [data, dimension]);


  const initTransformedData = React.useMemo(() => getWorkItemDurations(workItems), [workItems]);
  return (
    <MotionEfficiencyQuadrantSummaryCard
      workItems={initTransformedData}
      stateTypes={stateTypes}
      specsOnly={specsOnly}
      cycleTimeTarget={cycleTimeTarget}
      latencyTarget={latencyTarget}
      className="tw-h-full"
      displayBag={{className: classNames("tw-mx-auto tw-h-full tw-w-[98%]", displayBag?.fontSize)}}
     />
  );
};
