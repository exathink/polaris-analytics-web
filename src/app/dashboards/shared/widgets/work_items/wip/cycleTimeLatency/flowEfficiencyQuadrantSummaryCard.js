import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {PlainCard} from "../../../../components/cards/plainCard";
import {AppTerms} from "../../../../config";
import {useFlowEfficiency} from "../../clientSideFlowMetrics";
import {FlowEfficiencyDetailsView} from "./flowEfficiencyDetailsView";

export function FlowEfficiencyQuadrantSummaryCard({workItems, stateTypes, specsOnly, cycleTimeTarget, latencyTarget, onQuadrantClick, selectedQuadrant, className}) {
  const flowEfficiency = useFlowEfficiency(workItems, stateTypes);

  return (
    <PlainCard
      title="Flow Efficiency"
      className={className}
      value={flowEfficiency}
      info={{title: "Flow Efficiency"}}
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
        workItems={workItems}
        stateTypes={stateTypes}
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
