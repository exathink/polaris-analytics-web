import {PlainCard} from "../../../../components/cards/plainCard";
import {AppTerms} from "../../../../config";
import {useFlowEfficiency} from "../../clientSideFlowMetrics";
import {FlowEfficiencyDetailsView} from "./flowEfficiencyDetailsView";

export function FlowEfficiencyCard({workItems, stateTypes, specsOnly, children}) {
  const filteredWorkItems = workItems.filter((workItem) => stateTypes.indexOf(workItem.stateType) !== -1);
  const value = useFlowEfficiency(filteredWorkItems, stateTypes);

  return (
    <PlainCard
      title="Flow Efficiency"
      value={value}
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
        content: <FlowEfficiencyDetailsView workItems={filteredWorkItems} phases={stateTypes} />,
      }}
    >
      {children}
    </PlainCard>
  );
}
