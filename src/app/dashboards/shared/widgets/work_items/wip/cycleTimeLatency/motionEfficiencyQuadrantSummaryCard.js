import {QuadrantSummaryPanel} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {PlainCard} from "../../../../components/cards/plainCard";
import {AppTerms, itemsDesc} from "../../../../config";
import {useMotionEfficiency} from "../../clientSideFlowMetrics";
import {FlowEfficiencyDetailsView} from "./flowEfficiencyDetailsView";
import {filterByStateTypes} from "./cycleTimeLatencyUtils";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import { CardInspectorWithDrawer, useCardInspector } from "../../../../../work_items/cardInspector/cardInspectorUtils";
import { EVENT_TYPES } from "../../../../../../helpers/utility";

export function MotionEfficiencyQuadrantSummaryCard({
  workItems,
  stateTypes,
  specsOnly,
  cycleTimeTarget,
  latencyTarget,
  onQuadrantClick,
  selectedQuadrant,
  context,
  className,
  displayBag,
}) {
  const filteredWorkItems = filterByStateTypes(workItems, stateTypes);
  const [workInMotion, percentage] = useMotionEfficiency(filteredWorkItems, latencyTarget);
  const workItemsDisplay = itemsDesc(specsOnly);
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();

  function handleSelectionChange(items, eventType) {
    if (eventType === EVENT_TYPES.POINT_CLICK) {
      setWorkItemKey(items[0].key);
      setShowPanel(true);
    }
  }

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
      latencyView={
        displayBag?.showLatencyPopup
          ? {
              title: (
                <div className="tw-text-lg tw-text-gray-300">
                  Motion Analysis, All {specsOnly ? "Dev Items" : "Work Items"}
                </div>
              ),
              placement: "bottom",
              content: (
                <div className="tw-w-[500px]">
                  <WorkItemsCycleTimeVsLatencyChart
                    stageName={"Process"}
                    workItems={filteredWorkItems}
                    groupByState={true}
                    tooltipType={"small"}
                    specsOnly={specsOnly}
                    stateTypes={stateTypes}
                    cycleTimeTarget={cycleTimeTarget}
                    latencyTarget={latencyTarget}
                    onSelectionChange={handleSelectionChange}
                    excludeAbandoned={displayBag?.excludeAbandoned}
                  />

                    <CardInspectorWithDrawer
                      workItemKey={workItemKey}
                      showPanel={showPanel}
                      setShowPanel={setShowPanel}
                      context={context}
                      drawerOptions={{placement: "bottom"}}
                    />
                  
                </div>
              ),
            }
          : undefined
      }
    >
      <QuadrantSummaryPanel
        workItems={filteredWorkItems}
        cycleTimeTarget={cycleTimeTarget}
        latencyTarget={latencyTarget}
        onQuadrantClick={onQuadrantClick}
        selectedQuadrant={selectedQuadrant}
        popupProps={{
          specsOnly,
          cycleTimeTarget,
          latencyTarget,
          stateTypes,
          showQuadrantPopup: displayBag?.showQuadrantPopup,
          excludeAbandoned: displayBag?.excludeAbandoned,
          context,
        }}
        {...displayBag}
      />
    </PlainCard>
  );
}
