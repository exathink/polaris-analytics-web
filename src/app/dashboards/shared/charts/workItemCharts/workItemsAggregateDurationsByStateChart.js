import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick} from "../../../../helpers/utility";

import {Colors, WorkItemStateTypeColor, WorkItemTypeSortOrder} from "../../config";
import {getDeliveryCycleDurationsByState} from "../../widgets/work_items/clientSideFlowMetrics";

export const WorkItemsAggregateDurationsByStateChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItems, title, intl}) => {

    const aggregateDurations = getDeliveryCycleDurationsByState(workItems);

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
        y: aggregateDurations[state].daysInState,
        color: WorkItemStateTypeColor[aggregateDurations[state].stateType],
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

          return tooltipHtml({
            header: `${intl.formatNumber(this.point.y)} days`,
            body: []
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