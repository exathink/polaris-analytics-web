import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {capitalizeFirstLetter, pick, toMoment} from "../../../../helpers/utility";

export const FlowMetricsScatterPlotChart = Chart({
  chartUpdateProps: (props) => (
    pick(props, 'model', 'selectedMetric')
  ),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),

  getConfig: ({model, days, selectedMetric, metricsMeta, intl}) => {
    return {
      chart: {
        type: 'scatter',
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: metricsMeta[selectedMetric].display
      },
      subtitle: {
        text: `Work items closed in the last ${days} days`
      },
      legend: {
        title: {
          text: metricsMeta[selectedMetric].display,
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
          name: selectedMetric,

          data: model.map(
            cycle => ({
              x: toMoment(cycle.endDate).valueOf(),
              y: cycle[selectedMetric],
              z: 1,
              cycle: cycle
            })
          ),
          turboThreshold: 0,
          allowPointSelect: true,

        },
      ],
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml({
              header: `${capitalizeFirstLetter(this.point.cycle.workItemType)}: ${this.point.cycle.name} (${this.point.cycle.displayId})`,
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







