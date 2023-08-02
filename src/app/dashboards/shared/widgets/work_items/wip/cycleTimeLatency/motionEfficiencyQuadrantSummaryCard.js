import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {PlainCard} from "../../../../components/cards/plainCard";
import {AppTerms} from "../../../../config";
import { useFlowEfficiency, useMotionEfficiency } from "../../clientSideFlowMetrics";
import {FlowEfficiencyDetailsView} from "./flowEfficiencyDetailsView";
import { filterByStateTypes } from "./cycleTimeLatencyUtils";

export function MotionEfficiencyQuadrantSummaryCard({workItems, stateTypes, specsOnly, cycleTimeTarget, latencyTarget, onQuadrantClick, selectedQuadrant, className}) {
  const filteredWorkItems = filterByStateTypes(workItems, stateTypes)
  const motionEfficiency = useMotionEfficiency(filteredWorkItems, latencyTarget);

  return (
    <PlainCard
      title="Work In Motion"
      className={className}
      value={motionEfficiency}
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
    >
      <QuadrantSummaryPanel
        workItems={filteredWorkItems}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        onQuadrantClick={onQuadrantClick}
        selectedQuadrant={selectedQuadrant}
        className="tw-mx-auto tw-w-[98%]"
        valueFontClass="tw-text-3xl"
        size="small"
      />
    </PlainCard>
  );
}
