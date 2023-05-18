import classNames from "classnames";
import React from "react";
import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {PlainCard} from "../../../../components/cards/plainCard";
import {AppTerms} from "../../../../config";
import {getWorkItemDurations, useFlowEfficiency} from "../../clientSideFlowMetrics";
import {FlowEfficiencyDetailsView} from "./flowEfficiencyDetailsView";

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

  const flowEfficiencyPercentage = useFlowEfficiency(workItems, stateTypes);
  const initTransformedData = React.useMemo(() => getWorkItemDurations(workItems), [workItems]);

  return (
    <PlainCard
      title="WIP Flow Efficiency"
      value={flowEfficiencyPercentage}
      info={{title: "Flow Efficiency"}}
      detailsView={{
        title: (
          <div className="tw-text-lg tw-text-gray-300">
            WIP Flow Efficiency,{" "}
            <span className="tw-text-base tw-italic">
              {specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}
            </span>
          </div>
        ),
        placement: "bottom",
        content: <FlowEfficiencyDetailsView workItems={initTransformedData} phases={stateTypes} />,
      }}
      className="tw-h-full"
    >
      <QuadrantSummaryPanel
        workItems={initTransformedData}
        stateTypes={stateTypes}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        className={classNames("tw-mx-auto tw-h-full tw-w-[98%]", displayBag?.fontSize)}
      />
    </PlainCard>
  );
};
