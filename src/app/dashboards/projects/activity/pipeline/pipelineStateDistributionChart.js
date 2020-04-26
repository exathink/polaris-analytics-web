import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick} from "../../../../helpers/utility";
import {PlotLines} from "../shared/chartParts";

import {
  Colors,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
  WorkItemTypeDisplayName
} from "../../../shared/config";

function getMaxDays(workItems, projectCycleMetrics) {
  return workItems.reduce(
    (max, workItem) => workItem.timeInState > max ? workItem.timeInState : max,
    projectCycleMetrics.percentileLeadTime || 0
  )


}

export const PipelineStateDistributionChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems', 'projectCycleMetrics')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItems, projectCycleMetrics, intl}) => {

    // work items are grouped into buckets based on their current state
    const workItemsByStateType = workItems.reduce(
      (workItemsByStateType, workItem) => {
        if (workItemsByStateType[workItem.stateType] != null) {
          workItemsByStateType[workItem.stateType].push(workItem)
        } else {
          workItemsByStateType[workItem.stateType] = [workItem]
        }
        return workItemsByStateType
      },
      {}
    )
    // One series is created per bucket by current state type, series are sorted by standard state type sort order
    const series = Object.keys(workItemsByStateType).sort(
      (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
    ).map(
      // Series definition for this state type
      stateType => ({
        name: WorkItemStateTypeDisplayName[stateType],
        // default color for the series. points will override, but this shows on the legend.
        color: WorkItemStateTypeColor[stateType],
        stacking: true,
        // Within the series the work items are sorted by current state. This is needed to consistently
        // order the columns in the column chart.
        data: workItemsByStateType[stateType].sort(
            (itemA, itemB) =>
              itemA.state < itemB.state ? -1 :
                itemA.state > itemB.state ? 1 :
                  // All items with the same state are sorted in DESCENDING order of time in state
                  // oldest items show up at the top of each group in the chart
                  (itemB.timeInState - itemA.timeInState)
          ).flatMap(
            // each work item is mapped to one or more points
            // in the series, one point per distinct state that was in
            // prior to the current state. So we flatMap here instead of map
            workItem =>
              workItem.workItemStateDetails.currentDeliveryCycleDurations.sort(
                (durationA , durationB) =>
                  durationA.daysInState && durationB.daysInState ?
                    // If both states are prior states sort the delivery cycle durations by standard state type order
                    WorkItemStateTypeSortOrder[durationA.stateType] - WorkItemStateTypeSortOrder[durationB.stateType] :
                    // otherwise the current state, the state with null days in state gets sorted last
                    durationA.daysInState ? -1 : 1
              ).map(
                // This is single point in the series
                durationInState => ({
                  name: workItem.displayId,
                  y: durationInState.daysInState || workItem.timeInState,
                  color: WorkItemStateTypeColor[durationInState.stateType],
                  durationInState: durationInState,
                  workItem: workItem
                })
              )
          )
      })
    )
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
            body: this.point.durationInState.state === this.point.workItem.state ?
              [
                [`Current State:`, `${state}`],
                [`Entered:`, `${timeInStateDisplay}`],
                [`Time in State:`, `${intl.formatNumber(this.y)} days`],
              ] : [
                [`Phase:`, `${WorkItemStateTypeDisplayName[this.point.durationInState.stateType]}`],
                [`State:`, `${this.point.durationInState.state}`],
                [`Time in State:`, `${intl.formatNumber(this.y)} days`],
              ]
          })
        }
      },
      series: series,
      legend: {
        title: {
          text: "Phase",
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

