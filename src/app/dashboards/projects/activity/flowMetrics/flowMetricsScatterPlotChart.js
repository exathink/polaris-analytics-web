import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {pick, toMoment} from "../../../../helpers/utility";

export const FlowMetricsScatterPlotChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'model')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({model, days, intl}) => {
    return {
      chart: {
        type: 'scatter',
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: "Flow Metrics"
      },
      subtitle: {
        text: `Last ${days} days`
      },
      legend: {
        title: {
          text: 'Cycle Metrics',
          style: {
            fontStyle: 'italic'
          }
        },
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemMarginBottom: 3,

      },
      xAxis: {
        type: 'datetime',
        title: {
          text: `Date Closed`
        }
      },
      yAxis: {
        type: 'linear',
        id: 'cycle-metric',
        title: {
          text: `Days`
        }
      },
      series: [
        {
          key: 'lead-time',
          id: 'lead-time',
          name: 'Lead Time',

          data: model.map(
            cycle => ({
              x: toMoment(cycle.endDate).valueOf(),
              y: cycle.leadTime,
              z: 1,
              cycle: cycle
            })
          ),
          turboThreshold: 0,
          allowPointSelect: true,

        },
        {
          key: 'cycle-time',
          id: 'cycle-time',
          name: 'Cycle Time',

          data: model.map(
            cycle => ({
              x: toMoment(cycle.endDate).valueOf(),
              y: cycle.cycleTime,
              z: 1,
              cycle: cycle
            })
          ),
          turboThreshold: 0,
          allowPointSelect: true,

        }
      ],
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml({
              header: `Work Item: ${this.point.cycle.name}`,
              body: [
                ['Closed Date: ', `${intl.formatDate(this.point.cycle.endDate)}`],
                ['Lead Time: ', `${intl.formatNumber(this.point.cycle.leadTime)}`],
                ['Cycle Time: ', `${intl.formatNumber(this.point.cycle.cycleTime) || 'N/A'}`],
              ]
            })
        }

      },
      plotOptions: {
        series: {
          dataLabels: {
            enabled: true,
            format: `{point.name}`,
            inside: true,
            verticalAlign: 'center',
            style: {
              color: 'black',
              textOutline: 'none'
            }

          }
        }

      }
    }

  }
});







