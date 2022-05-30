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
      <div className="tw-flex tw-flex-col tw-rounded-md tw-p-1" style={{backgroundColor: QuadrantColors[Quadrants.ok]}}>
        <div>{QuadrantNames[Quadrants.ok]}</div>
        <div className="tw-font-medium">{quadrantValues[Quadrants.ok] ?? 0}</div>
      </div>
      <div
        className="tw-flex tw-flex-col tw-rounded-md tw-p-1"
        style={{backgroundColor: QuadrantColors[Quadrants.latency]}}
      >
        <div>{QuadrantNames[Quadrants.latency]}</div>
        <div className="tw-font-medium">{quadrantValues[Quadrants.latency] ?? 0}</div>
      </div>
      <div
        className="tw-flex tw-flex-col tw-rounded-md tw-p-1"
        style={{backgroundColor: QuadrantColors[Quadrants.age]}}
      >
        <div>{QuadrantNames[Quadrants.age]}</div>
        <div className="tw-font-medium">{quadrantValues[Quadrants.age] ?? 0}</div>
      </div>
      <div
        className="tw-flex tw-flex-col tw-rounded-md tw-p-1"
        style={{backgroundColor: QuadrantColors[Quadrants.critical]}}
      >
        <div>{QuadrantNames[Quadrants.critical]}</div>
        <div className="tw-font-medium">{quadrantValues[Quadrants.critical] ?? 0}</div>
      </div>
    </div>
  );
}
