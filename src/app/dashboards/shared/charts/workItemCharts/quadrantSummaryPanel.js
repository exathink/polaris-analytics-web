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

function QuadrantBox({name, val, total, totalAge, totalLatency, quadrantEffort, totalEffort, quadrantDescription, color, onQuadrantClick, className, layout, fontClass}) {
  const intl = useIntl();

  const percentageCount = (val/total)*100;
  const percentageCountDisplay = total > 0 ? `${i18nNumber(intl,percentageCount, 0 ) } %` : 0;

  const averageAge = totalAge/val;
  const averageAgeDisplay = val > 0 ? `${i18nNumber(intl, averageAge,averageAge < 10 ? 1 :0)} days`: '';

  const averageLatency = totalLatency/val;
  const averageLatencyDisplay = val > 0 ? `${i18nNumber(intl, averageLatency,averageAge < 10 ? 1 :0)} days`: '';

  const wipEffortDisplay = total > 0 ?  `${i18nNumber(intl,quadrantEffort, 0 ) } FTE Days (${i18nNumber(intl,(quadrantEffort/totalEffort)*100, 0 ) } %)` : '';

  const tooltipContent = (
    <div>
      <div>
        {
        val > 0 &&
          <span><b>Avg. Age:</b> {averageAgeDisplay}</span>
        }
      </div>
      <div>
        {
        val > 0 &&
          <span><b>Avg. Idle Time:</b> {averageLatencyDisplay}</span>
        }
      </div>
      <div>
        {
          val > 0 &&
          <span><b>Effort:</b> {wipEffortDisplay}</span>
        }
      </div>

    </div>
  )
  const tooltipTitle = (
    <div>
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
          {percentageCountDisplay}
        </div>
        <div className={classNames("tw-text-black tw-text-opacity-80", "tw-text-xs")}>
          {val > 0 ? `Avg. Age ${averageAgeDisplay}` : ''}
        </div>
      </div>
    </Popover>
  );
}

export function QuadrantSummaryPanel({workItems, stateTypes, cycleTimeTarget, latencyTarget, className, onQuadrantClick, selectedQuadrant, layout="col", valueFontClass="tw-text-2xl"}) {
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

  const totalEffort = Object.keys(quadrantEffort).reduce((totalEffort, current) => totalEffort + quadrantEffort[current], 0);


  const selectedBorderClasses = "tw-border-2 tw-border-solid tw-border-gray-300";
  return (
    <div className={classNames("tw-grid tw-grid-cols-4 tw-grid-rows-1 tw-gap-1", className)}>
      <QuadrantBox
        name={QuadrantNames[Quadrants.ok]}
        val={quadrantCounts[Quadrants.ok] ?? 0}
        total={workItems.length}
        totalAge={quadrantAge[Quadrants.ok] ?? 0}
        totalLatency={quadrantLatency[Quadrants.ok] ?? 0}
        quadrantEffort={quadrantEffort[Quadrants.ok] ?? 0}
        totalEffort={totalEffort}
        quadrantDescription={`Age <= ${i18nNumber(intl, cycleTimeTarget,0)} days, IdleTime <= ${i18nNumber(intl, latencyTarget, 1)} days`}
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
        totalLatency={quadrantLatency[Quadrants.latency] ?? 0}
        quadrantEffort={quadrantEffort[Quadrants.latency] ?? 0}
        totalEffort={totalEffort}
        quadrantDescription={`Age <= ${i18nNumber(intl, cycleTimeTarget,0)} days, IdleTime > ${i18nNumber(intl, latencyTarget, 1)} days`}
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
        totalLatency={quadrantLatency[Quadrants.age] ?? 0}
        quadrantEffort={quadrantEffort[Quadrants.age] ?? 0}
        totalEffort={totalEffort}
        quadrantDescription={`Age > ${i18nNumber(intl, cycleTimeTarget,0)} days, IdleTime <= ${i18nNumber(intl, latencyTarget, 1)} days`}
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
        totalLatency={quadrantLatency[Quadrants.critical] ?? 0}
        quadrantEffort={quadrantEffort[Quadrants.critical] ?? 0}
        totalEffort={totalEffort}
        quadrantDescription={`Age > ${i18nNumber(intl, cycleTimeTarget,0)} days, IdleTime > ${i18nNumber(intl, latencyTarget, 1)} days`}
        color={QuadrantColors[Quadrants.critical]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.critical)}
        layout={layout}
        className={selectedQuadrant === Quadrants.critical ? selectedBorderClasses : ""}
        fontClass={valueFontClass}
      />
    </div>
  );
}
