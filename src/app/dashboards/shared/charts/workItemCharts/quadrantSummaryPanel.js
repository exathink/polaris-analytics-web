import classNames from "classnames";
import { getWorkItemDurations } from "../../widgets/work_items/clientSideFlowMetrics";
import { Popover } from "antd";

import {
  getQuadrant,
  QuadrantColors,
  QuadrantNames,
  Quadrants
} from "../../widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";
import { useIntl } from "react-intl";
import { i18nNumber } from "../../../../helpers/utility";

function getQuadrantCounts({workItems, cycleTimeTarget, latencyTarget}) {
  return workItems.reduce((acc, item) => {
    const quadrant = getQuadrant(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (acc[quadrant]) {
      acc[quadrant] += 1;
    } else {
      acc[quadrant] = 1;
    }
    return acc;
  }, {});
}

function getTotalAgeByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalAge, item) => {
    const quadrant = getQuadrant(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalAge[quadrant]) {
      totalAge[quadrant] += item.cycleTime;
    } else {
      totalAge[quadrant] = item.cycleTime;
    }
    return totalAge;
  }, {});
}

function getTotalLatencyByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalLatency, item) => {
    const quadrant = getQuadrant(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalLatency[quadrant]) {
      totalLatency[quadrant] += item.latency;
    } else {
      totalLatency[quadrant] = item.latency;
    }
    return totalLatency;
  }, {});
}

function getTotalEffortByQuadrant({workItems, cycleTimeTarget, latencyTarget, quadrantCounts}) {
   return workItems.reduce((totalEffort, item) => {
    const quadrant = getQuadrant(item.cycleTime, item.latency, cycleTimeTarget, latencyTarget);
    if (totalEffort[quadrant]) {
      totalEffort[quadrant] += item.effort;
    } else {
      totalEffort[quadrant] = item.effort;
    }
    return totalEffort;
  }, {});
}

function QuadrantBox({name, val, total, totalAge, totalLatency, quadrantEffort, totalEffort, quadrantDescription, color, onQuadrantClick, className, fontClass, testId}) {
  const intl = useIntl();

  const percentageCount = (val/total)*100;
  const percentageCountDisplay = total > 0 ? `${i18nNumber(intl,percentageCount, 0 ) } %` : <span className="tw-text-base">N/A</span>;

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

  const tooltipContent = val > 0 && (
    <div className="tw-p-2 tw-grid tw-gap-2 tw-text-gray-300">
      {pairRender(`Avg. Age:`, averageAgeDisplay, `Days`)}
      {pairRender(`Avg. Latency:`, averageLatencyDisplay, `Days`)}
      {pairRender(`Effort:`, wipEffortDisplay, `FTE Days (${i18nNumber(intl,(quadrantEffort/totalEffort)*100, 0 ) }%)`)}
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
    </div>
  )
  return (
    <Popover content={tooltipContent} title={tooltipTitle} trigger={"hover"}>
      <div
        className={classNames("tw-flex tw-cursor-pointer tw-flex-col tw-items-center tw-justify-center tw-rounded-md tw-p-1 2xl:tw-space-y-1", className)}
        style={{backgroundColor: color}}
        onClick={onQuadrantClick}
        data-testid={testId}
      >
        <div className="2xl:tw-text-2xl">{name}</div>
        <div className={classNames("tw-text-black tw-text-opacity-80", fontClass)}>{percentageCountDisplay}</div>
        <div
          className={classNames(
            "tw-truncate tw-text-xs tw-text-black tw-text-opacity-80",
            val === 0 ? "tw-invisible" : ""
          )}
        >
          {val > 0 ? `Avg. Age ${averageAgeDisplay}` : "random text"}
        </div>
      </div>
    </Popover>
  );
}

export function QuadrantSummaryPanel({
  workItems,
  stateTypes,
  cycleTimeTarget,
  latencyTarget,
  className,
  onQuadrantClick,
  selectedQuadrant,
  valueFontClass = "tw-text-2xl",
}) {
  const intl = useIntl();
  const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter((workItem) =>
    stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
  );
  const quadrantCounts = getQuadrantCounts({
    workItems: workItemsWithAggregateDurations,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantAge = getTotalAgeByQuadrant({
    workItems: workItemsWithAggregateDurations,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantLatency = getTotalLatencyByQuadrant({
    workItems: workItemsWithAggregateDurations,
    cycleTimeTarget,
    latencyTarget,
  });

  const quadrantEffort = getTotalEffortByQuadrant({
    workItems: workItemsWithAggregateDurations,
    cycleTimeTarget,
    latencyTarget,
  });

  const totalEffort = Object.keys(quadrantEffort).reduce(
    (totalEffort, current) => totalEffort + quadrantEffort[current],
    0
  );

  const selectedBorderClasses = "tw-border-2 tw-border-solid tw-border-gray-300";
  const quadrantDescription = {
    [Quadrants.ok]: `Age <= ${i18nNumber(intl, cycleTimeTarget, 0)} days, IdleTime <= ${i18nNumber(intl, latencyTarget, 1)} days`,
    [Quadrants.latency]: `Age <= ${i18nNumber(intl, cycleTimeTarget, 0)} days, IdleTime > ${i18nNumber(intl, latencyTarget, 1)} days`,
    [Quadrants.age]: `Age > ${i18nNumber(intl, cycleTimeTarget, 0)} days, IdleTime <= ${i18nNumber(intl, latencyTarget, 1)} days`,
    [Quadrants.critical]: `Age > ${i18nNumber(intl, cycleTimeTarget, 0)} days, IdleTime > ${i18nNumber(intl, latencyTarget, 1)} days`,
  };
  const allQuadrants = Object.entries(QuadrantNames).map(([key, value]) => ({
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

  const allElements = allQuadrants.map((q) => {
    return (
      <QuadrantBox
        key={q.quadKey}
        testId={q.quadKey}
        {...q}
        fontClass={valueFontClass}
        total={workItems.length}
        totalEffort={totalEffort}
        onQuadrantClick={() => onQuadrantClick(q.quadKey)}
      />
    );
  });
  return <div className={classNames("tw-grid tw-grid-cols-4 tw-grid-rows-1 tw-gap-1", className)}>{allElements}</div>;
}
