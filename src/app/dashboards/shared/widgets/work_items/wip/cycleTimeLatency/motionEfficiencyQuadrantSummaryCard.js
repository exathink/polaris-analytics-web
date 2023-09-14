import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {PlainCard} from "../../../../components/cards/plainCard";
import {AppTerms, itemsDesc} from "../../../../config";
import {useMotionEfficiency} from "../../clientSideFlowMetrics";
import {FlowEfficiencyDetailsView} from "./flowEfficiencyDetailsView";
import {filterByStateTypes} from "./cycleTimeLatencyUtils";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";

export function MotionEfficiencyQuadrantSummaryCard({
  workItems,
  stateTypes,
  specsOnly,
  cycleTimeTarget,
  latencyTarget,
  onQuadrantClick,
  selectedQuadrant,
  className,
  displayBag,
}) {
  const filteredWorkItems = filterByStateTypes(workItems, stateTypes);
  const [workInMotion, percentage] = useMotionEfficiency(filteredWorkItems, latencyTarget);
  const workItemsDisplay = itemsDesc(specsOnly);

  return (
    <PlainCard
      title={`${workInMotion > 0 ? workInMotion : "No "} ${workItemsDisplay} in Motion `}
      className={className}
      value={workInMotion > 0 ? `: ${percentage}` : ""}
      info={{title: "Work in Motion"}}
      detailsView={{
        title: (
          <div className="tw-text-lg tw-text-gray-300">
            Flow Efficiency,{" "}
            <span className="tw-text-base tw-italic">
              {specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`}
            </span>
          </div>
        ),
        placement: "bottom",
        content: <FlowEfficiencyDetailsView workItems={workItems} phases={stateTypes} />,
      }}
      latencyView={displayBag?.showLatencyPopup ? {
        title: (
          <div className="tw-text-lg tw-text-gray-300">
            Overall Motion Analysis
          </div>
        ),
        placement: "bottom",
        content: (
          <div className="tw-w-[500px]">
            <WorkItemsCycleTimeVsLatencyChart
              stageName={"Wip"}
              workItems={filteredWorkItems}
              groupByState={true}
              tooltipType={"small"}
              specsOnly={specsOnly}
              stateTypes={stateTypes}
              cycleTimeTarget={cycleTimeTarget}
              latencyTarget={latencyTarget}
            />
          </div>
        ),
      }: undefined}
    >
      <QuadrantSummaryPanel
        workItems={filteredWorkItems}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        onQuadrantClick={onQuadrantClick}
        selectedQuadrant={selectedQuadrant}
        popupProps={{specsOnly, cycleTimeTarget, latencyTarget, stateTypes}}
        {...displayBag}
      />
    </PlainCard>
  );
}
