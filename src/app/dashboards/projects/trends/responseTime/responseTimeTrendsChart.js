import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, toMoment} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";
import {getMetricsRange, getPercentSpread} from "../../../shared/helpers/statsUtils";


export const ResponseTimeTrendsChart = Chart({
    chartUpdateProps: props => pick(props, 'flowMetricsTrends', 'measurementPeriod', 'measurementWindow'),
    eventHandler: DefaultSelectionEventHandler,
    mapPoints: (points, _) => points,
    getConfig: ({flowMetricsTrends, measurementWindow, measurementPeriod, intl}) => {

      // Get the extreme values of the two metrics we are showing and
      // stuff them into conveniently named variable
      const responseTimeRange = getMetricsRange(flowMetricsTrends, ['avgCycleTime', 'avgLeadTime'])
      const minLeadTime = responseTimeRange['avgLeadTime'].min;
      const maxLeadTime = responseTimeRange['avgLeadTime'].max;
      const minCycleTime = responseTimeRange['avgCycleTime'].min;
      const maxCycleTime = responseTimeRange['avgCycleTime'].max;


      const series = [
        {
          key: 'avg_cycle_time',
          id: 'avg_cycle_time',
          name: 'Avg. Cycle Time',
          data: flowMetricsTrends.map(
            measurement => ({
              x: toMoment(measurement['measurementDate'], true).valueOf(),
              y: measurement['avgCycleTime'],
              measurement: measurement
            })
          ).sort(
              (m1, m2) => m1.x - m2.x
            )
        },
        {
          key: 'avg_lead_time',
          id: 'avg_lead_time',
          name: 'Avg. Lead Time',
          visible: false,
          data: flowMetricsTrends.map(
            measurement => ({
              x: toMoment(measurement.measurementDate, true).valueOf(),
              y: measurement['avgLeadTime'],
              measurement: measurement
            })
          ).sort(
            (m1, m2) => m1.x - m2.x
          )
        },

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
          text: 'Response Time'
        },
        subtitle: {
          text: `${measurementPeriod} day trend`
        },
        legend: {
          title: {
            text: `Specs`,
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
            text: `Date`
          }
        },
        yAxis: {
          type: 'linear',
          id: 'cycle-metric',
          title: {
            text: `Days`
          },
          min:0,
          max: maxLeadTime * 2,
          plotBands:[
            {
              to: minCycleTime,
              from: maxCycleTime,
              label: {
                text: `Spread: ${intl.formatNumber(getPercentSpread(minCycleTime, maxCycleTime))}%`,
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: -5,
              }
            },

          ],
          plotLines:[
            {
              value: maxCycleTime,
              label: {
                text: `Max: ${intl.formatNumber(maxCycleTime)}`,
                align: 'left',
                verticalAlign: 'top',

              }
            },
            {
              value: minCycleTime,
              label: {
                text: `Min: ${intl.formatNumber(minCycleTime)}`,
                align: 'left',
                verticalAlign: 'bottom',
                x: 15,
                y: 15
              },
              zIndex: 3
            },

          ]
        },
        tooltip: {
          useHTML: true,
          followPointer: false,
          hideDelay: 0,
          formatter: function () {
            return tooltipHtml({
              header: `${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                ['Avg. Cycle Time: ', `${intl.formatNumber(this.point.measurement.avgCycleTime)} days`],
                ['Avg. Lead Time: ', `${intl.formatNumber(this.point.measurement.avgLeadTime)} days`],
                [`------`, ``],
                ['Total Closed: ', `${intl.formatNumber(this.point.measurement.workItemsInScope)} work items`],
                ['Earliest Closed: ', `${intl.formatDate(toMoment(this.point.measurement.earliestClosedDate).valueOf())}`],
                ['Latest Closed: ', `${intl.formatDate(toMoment(this.point.measurement.latestClosedDate).valueOf())}`],
                ['No Cycle Time  : ', `${this.point.measurement.workItemsWithNullCycleTime} work items`],
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