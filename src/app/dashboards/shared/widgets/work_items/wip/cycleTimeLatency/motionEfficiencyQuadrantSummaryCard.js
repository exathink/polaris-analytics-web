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

function getOverallQuadrantMetrics({workItems, cycleTimeTarget, latencyTarget, intl}) {
  const quadrantCounts = getQuadrantCounts({workItems, cycleTimeTarget, latencyTarget})
  const totalQuadrantCounts = Object.values(quadrantCounts).reduce((acc, item) => acc + item, 0);
  const quadrantAge = getTotalAgeByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });
  const totalQuadrantAge = Object.values(quadrantAge).reduce((acc, item) => acc + item, 0);

  const quadrantLatency = getTotalLatencyByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });
  const totalQuadrantLatency = Object.values(quadrantLatency).reduce((acc, item) => acc + item, 0);
  const quadrantEffort = getTotalEffortByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });
  const totalEffort = Object.values(quadrantEffort).reduce((acc, item) => acc + item, 0);

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
  const intl = useIntl();
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

  let latencyView;
  if (displayBag?.showLatencyPopup) {
    const {averageAgeDisplay, averageLatencyDisplay, wipEffortDisplay} = getOverallQuadrantMetrics({
      workItems,
      cycleTimeTarget,
      latencyTarget,
      intl,
    });
    latencyView = {
      title: (
        <div>
          <div className="tw-text-lg tw-text-gray-300">All {specsOnly ? "Dev Items" : "Work Items"}</div>
          <div className={classNames("tw-text-xs tw-font-normal tw-italic")}>
            Motion is indicated by a change in workflow state or commit activity for a work item.
          </div>
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
            excludeMotionless={displayBag?.excludeMotionless}
            blurClass={blurClass}
          />
          <div className="tw-mt-2 tw-flex tw-justify-between">
            <LabelValue
              label="Avg. Age:"
              labelClassName="tw-normal-case tw-font-normal"
              valueClassName="tw-ml-1"
              value={<span className="tw-text-base">{averageAgeDisplay}</span>}
              uom="Days"
            />
            <LabelValue
              label="Avg. Days Since Last Move:"
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
          <CardInspectorWithDrawer
            workItemKey={workItemKey}
            showPanel={showPanel}
            setShowPanel={setShowPanel}
            context={context}
            drawerOptions={{placement: "bottom"}}
          />
        </div>
      ),
    };
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
      latencyView={latencyView}
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
