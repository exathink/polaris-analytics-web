import classNames from "classnames";
import { getQuadrantCounts } from "../../widgets/work_items/clientSideFlowMetrics";
import { Popover } from "antd";

import React from "react";
import {
  getQuadrantDescription,
  getQuadrantLegacy,
  QuadrantColors,
  QuadrantNames,
  Quadrants
} from "../../widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { useIntl } from "react-intl";
import { EVENT_TYPES, i18nNumber, useBlurClass } from "../../../../helpers/utility";
import { WorkItemsCycleTimeVsLatencyChart } from "./workItemsCycleTimeVsLatencyChart";
import { CardInspectorWithDrawer, useCardInspector } from "../../../work_items/cardInspector/cardInspectorUtils";
import { LabelValue } from "../../../../helpers/components";


export function getTotalAgeByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalAge, item) => {
    const quadrant = getQuadrantLegacy(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalAge[quadrant]) {
      totalAge[quadrant] += item.cycleTime;
    } else {
      totalAge[quadrant] = item.cycleTime;
    }
    return totalAge;
  }, {});
}

export function getTotalLatencyByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalLatency, item) => {
    const quadrant = getQuadrantLegacy(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalLatency[quadrant]) {
      totalLatency[quadrant] += item.latency;
    } else {
      totalLatency[quadrant] = item.latency;
    }
    return totalLatency;
  }, {});
}

export function getTotalEffortByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalEffort, item) => {
    const quadrant = getQuadrantLegacy(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalEffort[quadrant]) {
      totalEffort[quadrant] += item.effort;
    } else {
      totalEffort[quadrant] = item.effort;
    }
    return totalEffort;
  }, {});
}

function QuadrantBox({quadKey, name, val, total, totalAge, totalLatency, quadrantEffort, totalEffort, quadrantDescription, color, onQuadrantClick, className, fontClass, testId, size, popupProps, workItems}) {
  const intl = useIntl();
  const blurClass = useBlurClass();

  const percentageCount = total === 0 ? 0 : (val / total) * 100;
  const percentageCountDisplay =
    total >= 0 ? `${i18nNumber(intl, percentageCount, 0)} %` : <span className="tw-text-base">N/A</span>;

  const averageAge = totalAge/val;
  const averageAgeDisplay = val > 0 ? `${i18nNumber(intl, averageAge,averageAge < 10 ? 1 :0)}`: '';

  const averageLatency = totalLatency/val;
  const averageLatencyDisplay = val > 0 ? `${i18nNumber(intl, averageLatency,averageAge < 10 ? 1 :0)}`: '';

  const wipEffortDisplay = total > 0 ?  `${i18nNumber(intl,quadrantEffort, 0 ) } ` : '';

  const pairRender = (label, value, uom) => (
    <div className="tw-flex tw-items-baseline tw-space-x-2">
      <div className="tw-text-xl tw-tracking-wide">{label}</div>
      <div className="tw-flex tw-items-baseline tw-space-x-2">
        <div className="tw-text-2xl tw-font-medium tw-leading-3 tw-text-black">{value}</div>
        <div className="tw-text-sm tw-font-normal">{uom}</div>
      </div>
    </div>
  );
  
  const {workItemKey, setWorkItemKey, showPanel, setShowPanel} = useCardInspector();
  function handleSelectionChange(items, eventType) {
    if (eventType === EVENT_TYPES.POINT_CLICK) {
      setWorkItemKey(items[0].key);
      setShowPanel(true);
    }
  }

  let initialPopoverContent = (
    <div className="tw-flex tw-justify-between">
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
        uom={`FTE Days (${i18nNumber(intl, (quadrantEffort / totalEffort) * 100, 0)}%)`}
      />
    </div>
  );
  let popoverContent;
  if (popupProps && popupProps.showQuadrantPopup) {
    const quadrantWorkItems = workItems.filter(
      (w) => getQuadrantLegacy(w.cycleTime, w.latency, popupProps.cycleTimeTarget, popupProps.latencyTarget) === quadKey
    );
    popoverContent = (
      <>  
        <WorkItemsCycleTimeVsLatencyChart
          stageName={"Wip"}
          workItems={quadrantWorkItems}
          groupByState={true}
          tooltipType={"small"}
          specsOnly={popupProps.specsOnly}
          stateTypes={popupProps.stateTypes}
          cycleTimeTarget={popupProps.cycleTimeTarget}
          latencyTarget={popupProps.latencyTarget}
          onSelectionChange={handleSelectionChange}
          excludeMotionless={popupProps.excludeMotionless}
          title=" "
          blurClass={blurClass}
        />
        {initialPopoverContent}
        <CardInspectorWithDrawer
          workItemKey={workItemKey}
          showPanel={showPanel}
          setShowPanel={setShowPanel}
          context={popupProps.context}
          drawerOptions={{placement: "top"}}
        />
      </>
    );
  } else {
    popoverContent = (
      <>
        {pairRender(`Avg. Age:`, averageAgeDisplay, `Days`)}
        {pairRender(`Avg. Days Since Last Move:`, averageLatencyDisplay, ``)}
        {pairRender(
          `Effort:`,
          wipEffortDisplay,
          `FTE Days (${i18nNumber(intl, (quadrantEffort / totalEffort) * 100, 0)}%)`
        )}
      </>
    );
  }


  const tooltipContent = val > 0 && (
    <div className={classNames("tw-grid tw-gap-2 tw-text-gray-300", popupProps?.showQuadrantPopup && "tw-w-[500px]")}>
      {popoverContent}
    </div>
  )
  const tooltipTitle = (
    <div className="tw-p-2 tw-text-gray-300 tw-text-xl tw-tracking-wide">
      <div>
        {`${val} ${name}`}
      </div>
      <div className={classNames("tw-font-normal tw-italic tw-text-xs")}>
        {quadrantDescription}
      </div>
      <div className={classNames("tw-font-normal tw-italic tw-text-xs")}>
        Motion is indicated by a change in workflow state or commit activity for a work item.
      </div>
    </div>
  )
  return (
    <Popover content={tooltipContent} title={tooltipTitle} trigger={"hover"}>
      <div
        className={classNames("tw-flex tw-cursor-pointer tw-flex-col tw-items-center tw-justify-center tw-rounded-md", className, {"2xl:tw-space-y-1  tw-p-1":size!=="small"})}
        style={{backgroundColor: color}}
        onClick={onQuadrantClick}
        data-testid={testId}
      >
        <div className={classNames({"tw-text-xs": size==="small"}, {"2xl:tw-text-2xl": size!=="small"})}>{name}</div>
        <div className={classNames("tw-text-black tw-text-opacity-80", fontClass)}>{percentageCountDisplay}</div>
        <div
          className={classNames(
            "tw-truncate tw-text-xs tw-text-black tw-text-opacity-80",
            val === 0 ? "tw-invisible" : ""
          )}
        >
          {val > 0 ? `Avg. Age ${averageAgeDisplay} Days` : ""}
        </div>
      </div>
    </Popover>
  );
}

export function QuadrantSummaryPanel({
  workItems,
  cycleTimeTarget,
  latencyTarget,
  className,
  onQuadrantClick,
  selectedQuadrant,
  valueFontClass = "tw-text-2xl",
  size,
  popupProps
}) {
  const intl = useIntl();

  const quadrantCounts = getQuadrantCounts({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantAge = getTotalAgeByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantLatency = getTotalLatencyByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantEffort = getTotalEffortByQuadrant({
    workItems,
    cycleTimeTarget,
    latencyTarget,
  });

  const totalEffort = Object.keys(quadrantEffort).reduce(
    (totalEffort, current) => totalEffort + quadrantEffort[current],
    0
  );

  const selectedBorderClasses = "tw-border-2 tw-border-solid tw-border-gray-300";
  const quadrantDescription = getQuadrantDescription({intl, cycleTimeTarget, latencyTarget});

  //TODO: remove abandoned for now, from the quadrant summary panel
  const {[Quadrants.abandoned]: _ignore, ...restQuadrants} = QuadrantNames;
  const allQuadrantsProps = Object.entries(restQuadrants).map(([key, value]) => ({
    quadKey: key,
    name: value,
    val: quadrantCounts[key] ?? 0,
    totalAge: quadrantAge[key] ?? 0,
    totalLatency: quadrantLatency[key] ?? 0,
    quadrantEffort: quadrantEffort[key] ?? 0,
    quadrantDescription: quadrantDescription[key],
    color: QuadrantColors[key],
    className: selectedQuadrant === key ? selectedBorderClasses : "",
  }));

  const allElements = allQuadrantsProps.map((quadrantProps) => {
    return (
      <QuadrantBox
        key={quadrantProps.quadKey}
        testId={quadrantProps.quadKey}
        {...quadrantProps}
        fontClass={valueFontClass}
        total={workItems.length}
        totalEffort={totalEffort}
        onQuadrantClick={() => onQuadrantClick(quadrantProps.quadKey)}
        size={size}
        popupProps={popupProps}
        workItems={workItems}
      />
    );
  });
  return <div className={classNames("tw-grid tw-grid-cols-4 tw-grid-rows-1 tw-gap-1", className)}>{allElements}</div>;
}
