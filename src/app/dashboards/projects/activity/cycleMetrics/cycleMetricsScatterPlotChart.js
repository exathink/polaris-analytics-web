import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {displayPlural, displaySingular, formatDateTime, formatTerm} from "../../../../i18n";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {elide, pick, toMoment} from "../../../../helpers/utility";
import moment from "moment";

export const CycleMetricsScatterPlotChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'model')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({model, intl}) => {
    return {
      chart: {
        type: 'scatter',
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: "Scatter Plot"
      },
      subtitle: {
        text: `Subtitle`
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
          text: `Close Date`
        }
      },
      yAxis: {
        type: 'linear',
        id: 'cycle-metric',
        title: {
          text: `${formatTerm(intl, 'Lead Time')}`
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
                ['Lead Time: ', `${this.point.cycle.leadTime}`],
                ['Cycle Time: ', `${this.point.cycle.cycleTime}`],
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







