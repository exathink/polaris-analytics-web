import classNames from "classnames";
import {getWorkItemDurations} from "../../widgets/work_items/clientSideFlowMetrics";
import {
  getQuadrant,
  QuadrantColors,
  QuadrantNames,
  Quadrants,
} from "../../widgets/work_items/wip/cycleTimeLatency/cycleTimeLatencyUtils";

function getQuadrantSummaryValues({workItems, cycleTimeTarget, latencyTarget}) {
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

function QuadrantBox({name, val, color, onQuadrantClick, className}) {
  return (
    <div className={classNames("tw-flex tw-flex-col tw-rounded-md tw-p-1 tw-cursor-pointer", className)} style={{backgroundColor: color}} onClick={onQuadrantClick}>
      <div>{name}</div>
      <div className="tw-textXl tw-text-black tw-text-opacity-80">{val}</div>
    </div>
  );
}

export function QuadrantSummaryPanel({workItems, stateTypes, cycleTimeTarget, latencyTarget, className, onQuadrantClick, selectedQuadrant}) {
  const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter((workItem) =>
    stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
  );
  const quadrantValues = getQuadrantSummaryValues({
    workItems: workItemsWithAggregateDurations,
    cycleTimeTarget,
    latencyTarget,
  });

  const selectedBorderClasses = "tw-border-2 tw-border-solid tw-border-gray-300";
  return (
    <div className={classNames("tw-grid tw-grid-cols-4 tw-grid-rows-1 tw-gap-1", className)}>
      <QuadrantBox
        name={QuadrantNames[Quadrants.ok]}
        val={quadrantValues[Quadrants.ok] ?? 0}
        color={QuadrantColors[Quadrants.ok]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.ok)}
        className={selectedQuadrant === Quadrants.ok ? selectedBorderClasses : ""}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.latency]}
        val={quadrantValues[Quadrants.latency] ?? 0}
        color={QuadrantColors[Quadrants.latency]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.latency)}
        className={selectedQuadrant === Quadrants.latency ? selectedBorderClasses : ""}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.age]}
        val={quadrantValues[Quadrants.age] ?? 0}
        color={QuadrantColors[Quadrants.age]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.age)}
        className={selectedQuadrant === Quadrants.age ? selectedBorderClasses : ""}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.critical]}
        val={quadrantValues[Quadrants.critical] ?? 0}
        color={QuadrantColors[Quadrants.critical]}
        onQuadrantClick={() => onQuadrantClick(Quadrants.critical)}
        className={selectedQuadrant === Quadrants.critical ? selectedBorderClasses : ""}
      />
    </div>
  );
}
