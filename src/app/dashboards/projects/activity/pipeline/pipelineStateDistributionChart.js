import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick} from "../../../../helpers/utility";
import {PlotLines} from "../shared/chartParts";

import {
  Colors,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
  WorkItemTypeDisplayName, WorkItemTypeSortOrder, WorkItemColorMap
} from "../../../shared/config";

function getMaxDays(workItems, projectCycleMetrics) {
  return workItems.reduce(
    (max, workItem) => workItem.timeInState + workItem.timeInPriorStates > max ?
      workItem.timeInState + workItem.timeInPriorStates
      :
      max,
    projectCycleMetrics.percentileLeadTime || 0
  )
}

export const PipelineStateDistributionChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems', 'projectCycleMetrics')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItems, stateType, projectCycleMetrics, intl}) => {
    // The list of work items represents work items of a single series type.
    const workItemsByWorkItemType = workItems.reduce(
      (workItemsByWorkItemType, workItem) => {
        if (workItemsByWorkItemType[workItem.workItemType] != null) {
          workItemsByWorkItemType[workItem.workItemType].push(workItem)
        } else {
          workItemsByWorkItemType[workItem.workItemType] = [workItem]
        }
        return workItemsByWorkItemType
      },
      {}
    );
    // We group the work items into series by work item type.
    const series = Object.keys(workItemsByWorkItemType).sort(
      (typeA, typeB) => WorkItemTypeSortOrder[typeA] - WorkItemTypeSortOrder[typeB]
    ).map(
      workItemType => ({
        name: WorkItemTypeDisplayName[workItemType],
        // default color for the series. points will override, but this shows on the legend.
        color: WorkItemColorMap[workItemType],
        stacking: true,
        // Within the series, each workItem is represented by one or more points which are stacked on top of
        // each other,
        // The point representing the current state and the time it has spent in it is stacked at the end of the series.
        // The points representing the time spent in each of the previous state TYPES are the beginning
        // of the series. These priorStateDurations are ordered by the standard stateType ordering.

        // Since each workItem can yield multiple points, we flatMap to give a valid series array
        data: workItemsByWorkItemType[workItemType].flatMap(
          workItem => {
            // Total up the prior state durations by state type.
            const priorStateDurations = workItem.workItemStateDetails.currentDeliveryCycleDurations.reduce(
              (priorStateDurations, durationInfo) => {
                // we drop the record for the current state if it has no previous accumulated time.
                if (durationInfo.daysInState != null) {
                  if (priorStateDurations[durationInfo.stateType] != null) {
                    priorStateDurations[durationInfo.stateType] = priorStateDurations[durationInfo.stateType] + durationInfo.daysInState
                  } else {
                    priorStateDurations[durationInfo.stateType] = durationInfo.daysInState
                  }
                }
                return priorStateDurations
              },
              {}
            );
            const workItemPoints = Object.keys(priorStateDurations).sort(
              (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
            ).map(
              stateType => ({
                name: workItem.displayId,
                y: priorStateDurations[stateType],
                color: WorkItemStateTypeColor[stateType],
                stateType: stateType,
                priorState: true,
                workItem: workItem
              })
            );
            //finally push a point for the current work item state at the end
            workItemPoints.push({
              name: workItem.displayId,
              y: workItem.timeInState,
              color: WorkItemStateTypeColor[workItem.stateType],
              priorState: false,
              workItem: workItem
            })
            return workItemPoints
          }
        )
      }
      )
    );

    return {
      chart: {
        type: 'bar',
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: `Pipeline Status`
      },
      xAxis: {
        type: 'category',
        title: {
          text: 'Work Item'
        }
      },
      yAxis: {
        type: 'linear',
        max: getMaxDays(workItems, projectCycleMetrics),
        allowDecimals: false,
        title: {
          text: 'Days in State'
        },
        plotLines: [
          PlotLines.percentileLeadTime(projectCycleMetrics, intl)
        ],
      },


      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const {displayId, workItemType, name, state, timeInStateDisplay} = this.point.workItem;

          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[workItemType]}: ${displayId}<br/>${name}`,
            body: this.point.priorState ?
              [
                [`Phase:`, `${WorkItemStateTypeDisplayName[this.point.stateType]}`],
                [`Time in Phase:`, `${intl.formatNumber(this.y)} days`],
              ]
                :
              [
                [`Current State:`, `${state}`],
                [`Entered:`, `${timeInStateDisplay}`],
                [`Time in State:`, `${intl.formatNumber(this.y)} days`],
              ]
          })
        }
      },
      series: series,
      legend: {
        title: {
          text: "Type",
          style: {
            fontStyle: 'italic'
          }
        },
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemMarginBottom: 3,

      },
    }
  }
});

