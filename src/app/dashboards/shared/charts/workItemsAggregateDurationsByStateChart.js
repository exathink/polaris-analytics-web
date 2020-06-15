import {Chart, tooltipHtml} from "../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {daysFromNow, pick, toMoment} from "../../../helpers/utility";

import {Colors, WorkItemStateTypeColor, WorkItemTypeSortOrder} from "../config";

export const WorkItemsAggregateDurationsByStateChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'workItems')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({workItems, title, intl}) => {

    const aggregateDurations = {}
    for (let i = 0; i < workItems.length; i++) {
      const durations = workItems[i].workItemStateDetails.currentDeliveryCycleDurations;
      for (let j = 0; j < durations.length; j++) {
        const state = durations[j].state
        /* filter out backlog for non-closed items*/
        if (workItems[i].stateType === 'closed' || durations[j].stateType !== 'backlog') {
          /* adjust duration to include current state if needed*/
          let daysInState = durations[j].daysInState;
          if (workItems[i].state === state && durations[j].stateType !== 'closed') {
            daysInState = daysInState + daysFromNow(toMoment(workItems[i].workItemStateDetails.currentStateTransition.eventDate));
          }
          if (aggregateDurations[state] != null) {
            aggregateDurations[state].daysInState += daysInState;
          } else {
            aggregateDurations[state] = {
              stateType: durations[j].stateType,
              daysInState: daysInState || 0
            };
          }
        }
      }
    }

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
        color: WorkItemStateTypeColor[aggregateDurations[state].stateType]
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
        minPointLength: 3,
      }],
      legend: {
        enabled: false
      }
    }
  }
});