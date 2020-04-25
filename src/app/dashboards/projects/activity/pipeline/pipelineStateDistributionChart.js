import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {capitalizeFirstLetter, percentileToText, pick, toMoment, daysFromNow} from "../../../../helpers/utility";
import {Colors, WorkItemStateTypeSortOrder, WorkItemStateTypeDisplayName} from "../../../shared/config";
import {formatTerm} from "../../../../i18n";

export const PipelineStateDistributionChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItems, intl}) => {

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
    // One series per state type, series are sorted by standard state type sort order
    const series = Object.keys(workItemsByStateType).sort(
      (stateTypeA, stateTypeB) => WorkItemStateTypeSortOrder[stateTypeA] - WorkItemStateTypeSortOrder[stateTypeB]
    ).map(
      // Series definition for this state type
      stateType => ({
        name: WorkItemStateTypeDisplayName[stateType],
        // Within the series the work items are sorted by state. This is needed to consistently
        // stack the columns in the column chart.
        data: workItemsByStateType[stateType].sort(
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
        allowDecimals: false,
        title: {
          text: 'Days in State'
        }
      },


      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml({
            header: `${this.point.workItem.displayId}: ${this.point.workItem.name}`,
            body: [
              [`State:`, `${this.point.workItem.state}`],
              [`Days in State:`, `${intl.formatNumber(this.y)}`],
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

