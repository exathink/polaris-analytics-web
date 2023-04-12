import {Chart} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {tooltipHtml_v2} from "../../../../framework/viz/charts/tooltip";
import {i18nNumber, pick} from "../../../../helpers/utility";

import {Colors, workItemFlowTypeColor, WorkItemStateTypeDisplayName, WorkItemTypeSortOrder} from "../../config";
import {getDeliveryCycleDurationsByState} from "../../widgets/work_items/clientSideFlowMetrics";

function getAverageTimeInState(workItems, aggregateDurations, state) {
  return workItems.length > 0 ? aggregateDurations[state].daysInState / (workItems.length) : 0;
}

export const WorkItemsAggregateDurationsByStateChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems', 'phases')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItems, title, phases, intl}) => {

    const aggregateDurations = getDeliveryCycleDurationsByState(workItems, phases);

    const series_data = Object.keys(aggregateDurations).sort(
      (stateA, stateB) => {
        const [a, b] = [aggregateDurations[stateA], aggregateDurations[stateB]];
        return (
          /* Sort by stateType and then days in state desc */
          WorkItemTypeSortOrder[a.stateType] === WorkItemTypeSortOrder[b.stateType]
            ? b.daysInState - a.daysInState
            : WorkItemTypeSortOrder[a.stateType] - WorkItemTypeSortOrder[b.stateType]
        )
      }
    ).map(
      state => ({
        name: state,
        y: getAverageTimeInState(workItems, aggregateDurations, state),
        color: workItemFlowTypeColor(aggregateDurations[state].flowType),
        phase: WorkItemStateTypeDisplayName[aggregateDurations[state].stateType],
        label: aggregateDurations[state].flowType,
      })
    )

    return {
      chart: {
        type: 'column',
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: title
      },
      xAxis: {
        type: 'category',

      },
      yAxis: {
        type: 'linear',
        allowDecimals: false,
        title: {
          text: 'Days'
        }
      },


      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {

          return tooltipHtml_v2({
            header: `State: ${this.point.name} <br/> Phase: ${this.point.phase}`,
            body: [[`Average Time in State`, `${i18nNumber(intl, this.point.y, 1)} days`]]
          })
        }
      },
      series: [{
        data: series_data,
        dataLabels: {
          enabled: true,
          inside: true,
          style: {
            textOverflow: 'clip',
            fontSize: '14px'
          },
          formatter: function() {
            return this.point.label;
          }
        },
        minPointLength: 3,
      }],
      legend: {
        enabled: false
      }
    }
  }
});