import {QuadrantSummaryPanel, getTotalAgeByQuadrant, getTotalEffortByQuadrant, getTotalLatencyByQuadrant} from "../../../../charts/workItemCharts/quadrantSummaryPanel";
import {PlainCard} from "../../../../components/cards/plainCard";
import {AppTerms, itemsDesc} from "../../../../config";
import {getQuadrantCounts, useMotionEfficiency} from "../../clientSideFlowMetrics";
import {FlowEfficiencyDetailsView} from "./flowEfficiencyDetailsView";
import {filterByStateTypes} from "./cycleTimeLatencyUtils";
import {WorkItemsCycleTimeVsLatencyChart} from "../../../../charts/workItemCharts/workItemsCycleTimeVsLatencyChart";
import { CardInspectorWithDrawer, useCardInspector } from "../../../../../work_items/cardInspector/cardInspectorUtils";
import { EVENT_TYPES, i18nNumber, useBlurClass } from "../../../../../../helpers/utility";
import classNames from "classnames";
import React from "react";
import { LabelValue } from "../../../../../../helpers/components";
import { useIntl } from "react-intl";

function useOverallQuadrantMetrics({workItems, cycleTimeTarget, latencyTarget}) {
  const intl = useIntl();
  const quadrantCounts = getQuadrantCounts({workItems, cycleTimeTarget, latencyTarget})
  const totalQuadrantCounts = Object.values(quadrantCounts).reduce((acc, item) => acc + item);
  const quadrantAge = getTotalAgeByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });
  const totalQuadrantAge = Object.values(quadrantAge).reduce((acc, item) => acc + item);

  const quadrantLatency = getTotalLatencyByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });
  const totalQuadrantLatency = Object.values(quadrantLatency).reduce((acc, item) => acc + item);
  const quadrantEffort = getTotalEffortByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });
  const totalEffort = Object.values(quadrantEffort).reduce((acc, item) => acc + item);

  const averageAge = totalQuadrantAge/totalQuadrantCounts;
  const averageAgeDisplay = totalQuadrantCounts > 0 ? `${i18nNumber(intl, averageAge,averageAge < 10 ? 1 :0)}`: '';

  const averageLatency = totalQuadrantLatency/totalQuadrantCounts;
  const averageLatencyDisplay = totalQuadrantCounts > 0 ? `${i18nNumber(intl, averageLatency,averageAge < 10 ? 1 :0)}`: '';

  const wipEffortDisplay = workItems.length > 0 ?  `${i18nNumber(intl,totalEffort, 0 ) } ` : '';

  return {averageAgeDisplay, averageLatencyDisplay, wipEffortDisplay}
}

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
  const blurClass = useBlurClass();
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

const {averageAgeDisplay, averageLatencyDisplay, wipEffortDisplay} = useOverallQuadrantMetrics({workItems, cycleTimeTarget, latencyTarget});

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
                <div>
                  <div className="tw-text-lg tw-text-gray-300">
                    Motion Analysis, All {specsOnly ? "Dev Items" : "Work Items"}
                  </div>
                  <div className={classNames("tw-text-xs tw-font-normal tw-italic")}>
                    Motion is indicated by a change in workflow state or commit activity for a work item.
                  </div>
                </div>
              ),
              placement: "bottom",
              content: (
                <div className="tw-w-[500px]">
                  <div className="tw-mb-2 tw-flex tw-justify-between">
                    <LabelValue
                      label="Age:"
                      labelClassName="tw-normal-case tw-font-normal"
                      valueClassName="tw-ml-1"
                      value={<span className="tw-text-base">{averageAgeDisplay}</span>}
                      uom="Days"
                    />
                    <LabelValue
                      label="Days Since Last Move:"
                      labelClassName="tw-normal-case tw-font-normal"
                      valueClassName="tw-ml-1"
                      value={<span className="tw-text-base">{averageLatencyDisplay}</span>}
                      uom="Days"
                    />
                    <LabelValue
                      label="Total Effort:"
                      labelClassName="tw-normal-case tw-font-normal"
                      valueClassName="tw-ml-1"
                      value={<span className="tw-text-base">{wipEffortDisplay}</span>}
                      uom={`FTE Days`}
                    />
                  </div>
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
                    excludeMotionless={displayBag?.excludeMotionless}
                    blurClass={blurClass}
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
          excludeMotionless: displayBag?.excludeMotionless,
          context,
        }}
        {...displayBag}
      />
    </PlainCard>
  );
}
