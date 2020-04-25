import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick} from "../../../../helpers/utility";
import {cycleMetricsReferencePlotlines} from "../shared/chartParts";

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
    projectCycleMetrics.maxLeadTime || 0
  )


}

export const PipelineStateDistributionChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems', 'projectCycleMetrics')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItems, projectCycleMetrics, intl}) => {

    const workItemsMeta = workItems.reduce(
      (workItemsMeta, workItem) => {
        if (workItemsMeta[workItem.stateType] != null) {
          workItemsMeta[workItem.stateType].push(workItem)
        } else {
          workItemsMeta[workItem.stateType] = [workItem]
        }
        return workItemsMeta
      },
      {}
    )
    // One series per state type, series are sorted by standard state type sort order
    const series = Object.keys(workItemsMeta).sort(
      (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
    ).map(
      // Series definition for this state type
      stateType => ({
        name: WorkItemStateTypeDisplayName[stateType],
        color: WorkItemStateTypeColor[stateType],
        // Within the series the work items are sorted by state. This is needed to consistently
        // stack the columns in the column chart.
        data: workItemsMeta[stateType].sort(
          (itemA, itemB) =>
            itemA.state < itemB.state ? -1 :
              itemA.state > itemB.state ? 1 :
                // All items with the same state are sorted in DESCENDING order of time in state
                // oldest items show up at bottom in the chart
                (itemB.timeInState - itemA.timeInState)
        ).map(
          workItem => {
            return({
              name: workItem.displayId,
              y: workItem.timeInState,
              workItem: workItem
            })
          }
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
        type: 'logarithmic',
        max: getMaxDays(workItems, projectCycleMetrics),
        allowDecimals: false,
        title: {
          text: 'Days in State'
        },
        plotLines: cycleMetricsReferencePlotlines(projectCycleMetrics, intl)
      },


      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml({
            header: `${WorkItemTypeDisplayName[this.point.workItem.workItemType]}: ${this.point.workItem.name}`,
            body: [
              [`Id:`, `${this.point.workItem.displayId}`],
              [`State:`, `${this.point.workItem.state}`],
              [`Entered:`, `${this.point.workItem.timeInStateDisplay}`],
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

