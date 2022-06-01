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

function QuadrantBox({name, val, color}) {
  return (
    <div className="tw-flex tw-flex-col tw-rounded-md tw-p-1" style={{backgroundColor: color}}>
      <div>{name}</div>
      <div className="tw-font-medium">{val}</div>
    </div>
  );
}

export function QuadrantSummaryPanel({workItems, stateTypes, cycleTimeTarget, latencyTarget}) {
  const workItemsWithAggregateDurations = getWorkItemDurations(workItems).filter((workItem) =>
    stateTypes != null ? stateTypes.indexOf(workItem.stateType) !== -1 : true
  );
  const quadrantValues = getQuadrantSummaryValues({
    workItems: workItemsWithAggregateDurations,
    cycleTimeTarget,
    latencyTarget,
  });

  return (
    <div className="tw-grid tw-grid-cols-4 tw-grid-rows-1 tw-gap-1">
      <QuadrantBox
        name={QuadrantNames[Quadrants.ok]}
        val={quadrantValues[Quadrants.ok] ?? 0}
        color={QuadrantColors[Quadrants.ok]}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.latency]}
        val={quadrantValues[Quadrants.latency] ?? 0}
        color={QuadrantColors[Quadrants.latency]}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.age]}
        val={quadrantValues[Quadrants.age] ?? 0}
        color={QuadrantColors[Quadrants.age]}
      />
      <QuadrantBox
        name={QuadrantNames[Quadrants.critical]}
        val={quadrantValues[Quadrants.critical] ?? 0}
        color={QuadrantColors[Quadrants.critical]}
      />
    </div>
  );
}
