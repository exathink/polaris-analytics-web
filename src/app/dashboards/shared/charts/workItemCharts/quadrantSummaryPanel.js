import classNames from "classnames";
import {getWorkItemDurations} from "../../widgets/work_items/clientSideFlowMetrics";
import {
  getQuadrant,
  QuadrantColors,
  QuadrantNames,
  Quadrants,
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

function QuadrantBox({name, val, total, totalAge, color, onQuadrantClick, className, layout, fontClass}) {
  const intl = useIntl();
  return (
    <div
      className={classNames(
        "tw-flex tw-cursor-pointer tw-rounded-md tw-p-1",
        layout === "col" ? "tw-flex-col tw-items-center" : "tw-h-14 tw-flex-row tw-items-center tw-justify-between tw-px-6",
        className
      )}
      style={{backgroundColor: color}}
      onClick={onQuadrantClick}
    >
      <div>{name}</div>
      <div className={classNames("tw-text-black tw-text-opacity-80", fontClass)}>
        {total > 0 ? `${i18nNumber(intl,(val/total)*100, 0 ) } %` : 0}
      </div>
      <div className={classNames("tw-text-black tw-text-opacity-80", "tw-text-xs")}>
        {val > 0 ? `Avg. Age ${i18nNumber(intl, totalAge/val,totalAge/val < 10 ? 1 :0)} days`: ''}
      </div>
    </div>
  );
}

export function QuadrantSummaryPanel({workItems, stateTypes, cycleTimeTarget, latencyTarget, className, onQuadrantClick, selectedQuadrant, layout="col", valueFontClass="tw-text-2xl"}) {
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

  const selectedBorderClasses = "tw-border-2 tw-border-solid tw-border-gray-300";
  return (
    <div className={classNames("tw-grid tw-grid-cols-4 tw-grid-rows-1 tw-gap-1", className)}>
      <QuadrantBox
        name={QuadrantNames[Quadrants.ok]}
        val={quadrantCounts[Quadrants.ok] ?? 0}
        total={workItems.length}
        totalAge={quadrantAge[Quadrants.ok] ?? 0}
        color={QuadrantColors[Quadrants.ok]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.ok)}
        layout={layout}
        className={selectedQuadrant === Quadrants.ok ? selectedBorderClasses : ""}
        fontClass={valueFontClass}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.latency]}
        val={quadrantCounts[Quadrants.latency] ?? 0}
        total={workItems.length}
        totalAge={quadrantAge[Quadrants.latency] ?? 0}
        color={QuadrantColors[Quadrants.latency]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.latency)}
        layout={layout}
        className={selectedQuadrant === Quadrants.latency ? selectedBorderClasses : ""}
        fontClass={valueFontClass}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.age]}
        val={quadrantCounts[Quadrants.age] ?? 0}
        total={workItems.length}
        totalAge={quadrantAge[Quadrants.age] ?? 0}
        color={QuadrantColors[Quadrants.age]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.age)}
        layout={layout}
        className={selectedQuadrant === Quadrants.age ? selectedBorderClasses : ""}
        fontClass={valueFontClass}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.critical]}
        val={quadrantCounts[Quadrants.critical] ?? 0}
        total={workItems.length}
        totalAge={quadrantAge[Quadrants.critical] ?? 0}
        color={QuadrantColors[Quadrants.critical]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.critical)}
        layout={layout}
        className={selectedQuadrant === Quadrants.critical ? selectedBorderClasses : ""}
        fontClass={valueFontClass}
      />
    </div>
  );
}
