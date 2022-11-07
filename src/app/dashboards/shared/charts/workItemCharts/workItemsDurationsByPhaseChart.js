import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter, pick, getNumber} from "../../../../helpers/utility";
import {PlotLines} from "./chartParts";
import {getWorkItemDurations} from "../../widgets/work_items/clientSideFlowMetrics";

import {
  assignWorkItemStateColor,
  Colors,
  WorkItemColorMap,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
  WorkItemTypeDisplayName,
  WorkItemTypeSortOrder,
  cycleTimeDisplay, WorkItemStateTypes
} from "../../config";

function getMaxDays(workItems, targetMetrics) {
  return workItems.reduce(
    (max, workItem) =>
      workItem.leadTime + workItem.timeInState > max ? workItem.leadTime + workItem.timeInState : max,
    (targetMetrics && targetMetrics.leadTimeTarget) || 0
  );
}

function getDataPoints(workItem) {
  // Within the series, each workItem is represented by one or more points which are stacked on top of
  // each other,
  // The point representing the current state and the time it has spent in it is stacked at the end of the series.
  // The points representing the time spent in each of the previous state TYPES are the beginning
  // of the series. These priorStateDurations are ordered by the standard stateType ordering.

  // For each work item, total up the prior state durations by state type.
  const priorStateDurations = workItem.workItemStateDetails.currentDeliveryCycleDurations.reduce(
    (priorStateDurations, durationInfo) => {
      // we drop the record for the current state if it has no previous accumulated time.
      if (durationInfo.daysInState != null) {
        const stateType = durationInfo.stateType || "unmapped";
        if (priorStateDurations[stateType] != null) {
          priorStateDurations[stateType] = priorStateDurations[stateType] + durationInfo.daysInState;
        } else {
          priorStateDurations[stateType] = durationInfo.daysInState;
        }
      }
      return priorStateDurations;
    },
    {}
  );
  const workItemPoints = Object.keys(priorStateDurations)
    .sort((stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB])
    .filter(
      // For non-closed items we remove backlog time from the display since we want to highlight elapsed cycle time against targets
      (stateType) => (workItem.stateType !== "closed" ? stateType !== "backlog" : true)
    )
    .map((stateType) => ({
      name: workItem.displayId,
      y: priorStateDurations[stateType],
      color: WorkItemStateTypeColor[stateType],
      stateType: stateType,
      priorState: true,
      workItem: workItem,
    }));
  //finally push a point for the current work item state at the end
  workItemPoints.push({
    name: workItem.displayId,
    y: workItem.stateType !== "closed" ? workItem.timeInState : 0,
    priorState: false,
    workItem: workItem,
  });
  return workItemPoints;
}

function getSeriesGroupedByState(workItems, stateType) {
  // We group the work items into series by state.
  const workItemsByState = workItems.reduce((workItemsByState, workItem) => {
    if (workItemsByState[workItem.state] != null) {
      workItemsByState[workItem.state].push(workItem);
    } else {
      workItemsByState[workItem.state] = [workItem];
    }
    return workItemsByState;
  }, {});
  // series are sorted in ascending order of number of items in each state.
  return Object.keys(workItemsByState)
    .sort((stateA, stateB) => workItemsByState[stateA].length - workItemsByState[stateB].length)
    .map((workItemState, index) => {
      // Since each workItem can yield multiple points, we flatMap to give a valid series array
      const workItemPoints = workItemsByState[workItemState].flatMap((workItem) => getDataPoints(workItem));

      return {
        name: `${capitalizeFirstLetter(workItemState)} (${workItemsByState[workItemState].length})`,
        color: assignWorkItemStateColor(stateType, index),
        stacking: true,
        maxPointWidth: 30,
        minPointLength: 3,
        allowPointSelect: true,
        data: workItemPoints,
        cursor: 'pointer'
      };
    });
}

function getSeriesGroupedByWorkItemType(workItems, stateType) {
  // We group the work items into series by work item type.
  const workItemsByWorkItemType = workItems.reduce((workItemsByWorkItemType, workItem) => {
    if (workItemsByWorkItemType[workItem.workItemType] != null) {
      workItemsByWorkItemType[workItem.workItemType].push(workItem);
    } else {
      workItemsByWorkItemType[workItem.workItemType] = [workItem];
    }
    return workItemsByWorkItemType;
  }, {});
  // series are sorted by standard work item type sort order.
  return Object.keys(workItemsByWorkItemType)
    .sort((typeA, typeB) => WorkItemTypeSortOrder[typeA] - WorkItemTypeSortOrder[typeB])
    .map((workItemType) => {
      const workItemPoints = workItemsByWorkItemType[workItemType].flatMap((workItem) => getDataPoints(workItem));

      return {
        name: `${WorkItemTypeDisplayName[workItemType]} (${workItemsByWorkItemType[workItemType].length})`,
        // default color for the series. points will override, but this shows on the legend.
        color: WorkItemColorMap[workItemType],
        stacking: true,
        maxPointWidth: 30,
        minPointLength: 3,
        allowPointSelect: true,
        // Since each workItem can yield multiple points, we flatMap to give a valid series array
        data: workItemPoints,
        cursor: 'pointer'
      };
    });
}

export const WorkItemsDurationsByPhaseChart = Chart({
  chartUpdateProps: (props) => pick(props, "workItems", "targetMetrics", "groupBy", "stateType"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point.workItem),

  getConfig: ({workItems, stateType, groupBy, targetMetrics, singleWorkItemMode, title, shortTooltip, intl}) => {
    const workItemsWithAggregateDurations = getWorkItemDurations(workItems);

    let series = [];
    if (groupBy === "state") {
      series = getSeriesGroupedByState(workItemsWithAggregateDurations, stateType);
    } else {
      series = getSeriesGroupedByWorkItemType(workItemsWithAggregateDurations, stateType);
    }

    return {
      chart: {
        type: "bar",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: title,
      },
      xAxis: {
        type: "category",
        visible: !singleWorkItemMode,
        title: {
          text: !singleWorkItemMode ? "Card" : null,
        },
      },
      yAxis: {
        type: "linear",
        max: getMaxDays(workItemsWithAggregateDurations, targetMetrics),
        softMin: 0,
        allowDecimals: false,
        title: {
          text: `${stateType === WorkItemStateTypes.closed ? 'Lead Time' : 'Age'} in Days` ,
        },
        plotLines: targetMetrics
          ? [
              PlotLines.leadTime(targetMetrics.leadTimeTarget, targetMetrics.leadTimeConfidenceTarget, intl),
              PlotLines.cycleTime(targetMetrics.cycleTimeTarget, targetMetrics.cycleTimeConfidenceTarget, intl),
            ]
          : [],
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const {
            displayId,
            workItemType,
            name,
            state,
            stateType,
            leadTime,
            cycleTime,
            timeInStateDisplay,
            latestCommitDisplay,
            duration,
            effort,
            commitLatency,
            workItemStateDetails,
          } = this.point.workItem;

          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[workItemType]}: ${displayId}<br/>${name}`,
            body: this.point.priorState
              ? [
                  [`Phase:`, `${WorkItemStateTypeDisplayName[this.point.stateType]}`],
                  [`Time in Phase:`, `${intl.formatNumber(this.y)} days`],
                ]
              : [
                  stateType === "closed" ? [`Lead Time:`, `${intl.formatNumber(leadTime)} days`] : ["", ""],
                  [`${cycleTimeDisplay(stateType)}:`, `${intl.formatNumber(cycleTime)} days`],
                  [`Current State:`, `${state}`],
                  [`Entered:`, `${timeInStateDisplay}`],
                  stateType !== "closed" ? [`Time in State:`, `${intl.formatNumber(this.y)} days`] : ["", ""],
                  workItemStateDetails.commitCount != null ? [`-----------------`, ``] : ["", ""],
                  workItemStateDetails.commitCount != null
                    ? [`Commits: `, `${intl.formatNumber(workItemStateDetails.commitCount)}`]
                    : ["", ""],
                  latestCommitDisplay != null ? [`Latest Commit: `, `${latestCommitDisplay}`] : ["", ""],
                  duration != null ? [`Coding: `, `${intl.formatNumber(duration)} days`] : ["", ""],
                  effort != null ? [`Effort: `, `${getNumber(effort, intl)} FTE Days` ] : ["", ""],
                  stateType !== 'closed' && commitLatency != null ? [`Latency: `, `${intl.formatNumber(commitLatency)} days`] : ["", ""],
                ],
          });
        },
      },
      series: series,
      legend: {
        title: {
          text: groupBy === "state" ? "Current State" : "Type",
          style: {
            fontStyle: "italic",
          },
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
        enabled: !singleWorkItemMode,
      },
    };
  },
});
