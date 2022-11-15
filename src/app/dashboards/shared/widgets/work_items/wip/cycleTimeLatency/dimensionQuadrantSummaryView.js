import classNames from "classnames";
import React from "react";
import {useFlowEfficiency} from "../../../../../projects/shared/helper/hooks";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {PlainCard} from "../../../../components/cards/plainCard";

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

  const flowEfficiencyPercentage = useFlowEfficiency(workItems);

  return (
    <PlainCard title="Flow Efficiency" value={flowEfficiencyPercentage} info={{title: "Flow Efficiency"}}>
      <QuadrantSummaryPanel
        workItems={workItems}
        stateTypes={stateTypes}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        className={classNames("tw-mx-auto tw-w-[98%] tw-h-full", displayBag?.fontSize)}
      />
    </PlainCard>
  );
};
