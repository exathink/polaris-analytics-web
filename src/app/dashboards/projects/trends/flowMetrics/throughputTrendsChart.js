import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, toMoment} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";


export const ThroughputTrendsChart = Chart({
    chartUpdateProps: props => pick(props, 'flowMetricsTrends', 'measurementWindow', 'measurementPeriod'),
    eventHandler: DefaultSelectionEventHandler,
    mapPoints: (points, _) => points,
    getConfig: ({flowMetricsTrends, measurementPeriod, measurementWindow, intl}) => {

      const series = [
        {
          key: 'throughput',
          id: 'throughput',
          name: 'Total Closed',
          data: flowMetricsTrends.map(
            measurement => ({
              x: toMoment(measurement.measurementDate).valueOf(),
              y: measurement['workItemsInScope'],
              measurement: measurement
            })
          )
        }
      ]
      return {
        chart: {
          type: 'line',
          animation: false,
          backgroundColor: Colors.Chart.backgroundColor,
          panning: true,
          panKey: 'shift',
          zoomType: 'xy'
        },
        title: {
          text: 'Throughput'
        },
        subtitle: {
          text: `Past ${measurementPeriod} days`
        },
        legend: {
          title: {
            text: `Window: Prior ${measurementWindow} days`,
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
            text: `Days`
          }
        },
        yAxis: {
          type: 'linear',
          id: 'cycle-metric',
          title: {
            text: `Work Items`
          },
        },
        tooltip: {
          useHTML: true,
          followPointer: false,
          hideDelay: 0,
          formatter: function () {
            return tooltipHtml({
              header: `${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                ['Total Closed: ', `${intl.formatNumber(this.point.measurement.workItemsInScope)} work items`],
                ['Earliest Closed: ', `${intl.formatDate(toMoment(this.point.measurement.earliestClosedDate).valueOf())}`],
                ['Latest Closed: ', `${intl.formatDate(toMoment(this.point.measurement.latestClosedDate).valueOf())}`],
                [`------`, ``],
                ['Avg. Lead Time: ', `${intl.formatNumber(this.point.measurement.avgLeadTime)} days`],
                ['Avg. Cycle Time: ', `${intl.formatNumber(this.point.measurement.avgCycleTime)} days`],
                ['Null Cycle Time : ', `${this.point.measurement.workItemsWithNullCycleTime} work items`]
              ]
            })
          }
        },
        series: series,
        plotOptions: {
          series: {
            animation: false,

          }

        },
        time: {
          // Since we are already passing in UTC times we
          // dont need the chart to translate the time to UTC
          // This makes sure the tooltips text matches the timeline
          // on the axis.
          useUTC: false
        }
      }
    }
  }
)