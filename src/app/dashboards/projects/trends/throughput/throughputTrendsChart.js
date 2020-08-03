import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, toMoment} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";
import {getMetricsRange, getPercentSpread} from "../../../shared/helpers/statsUtils";

export const ThroughputTrendsChart = Chart({
    chartUpdateProps: props => pick(props, 'flowMetricsTrends', 'measurementWindow', 'measurementPeriod'),
    eventHandler: DefaultSelectionEventHandler,
    mapPoints: (points, _) => points,
    getConfig: ({flowMetricsTrends, measurementPeriod, measurementWindow, intl}) => {
      const throughputRange = getMetricsRange(flowMetricsTrends, ['workItemsWithCommits', 'workItemsInScope']);
      const minSpecThroughput = throughputRange['workItemsWithCommits'].min;
      const maxSpecThroughput = throughputRange['workItemsWithCommits'].max;
      const minTotalWorkItems = throughputRange['workItemsInScope'].min;
      const maxTotalWorkItems = throughputRange['workItemsInScope'].max;

      const series = [
        {
          key: 'throughput1',
          id: 'throughput1',
          name: 'Specs',
          data: flowMetricsTrends.map(
            measurement => ({
              x: toMoment(measurement.measurementDate, true).valueOf(),
              y: measurement['workItemsWithCommits'],
              measurement: measurement
            })
          ).sort(
            (m1, m2) => m1.x - m2.x
          )
        },
        {
          key: 'throughput2',
          id: 'throughput2',
          name: 'All Work Items',
          visible: false,

          data: flowMetricsTrends.map(
            measurement => ({
              x: toMoment(measurement.measurementDate, true).valueOf(),
              y: measurement['workItemsInScope'],
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
          text: 'Throughput'
        },
        subtitle: {
          text: `${measurementPeriod} day trend`
        },
        legend: {
          title: {
            text: ``,
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
          },

        },
        yAxis: {
          type: 'linear',
          id: 'cycle-metric',
          title: {
            text: `Work Items`
          },
          min: 0,
          max: maxTotalWorkItems * 2,
          plotBands:[
            {
              to: minSpecThroughput,
              from: maxSpecThroughput,
              label: {
                text: `Spread: ${getPercentSpread(minSpecThroughput, maxSpecThroughput)}%`,
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: -5,
              }
            },

          ],
          plotLines:[
            {
              value: maxSpecThroughput,
              label: {
                text: `Max: ${maxSpecThroughput}`,
                align: 'left',
                verticalAlign: 'top',

              }
            },
            {
              value: minSpecThroughput,
              label: {
                text: `Min: ${minSpecThroughput}`,
                align: 'left',
                verticalAlign: 'bottom',
                x: 15,
                y: 15
              },
              zIndex: 3,

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
                ['Throughput: ', `${intl.formatNumber(this.point.measurement.workItemsWithCommits)} work items`],
                ['Total Closed: ', `${intl.formatNumber(this.point.measurement.workItemsInScope)} work items`],
                ['Earliest Closed: ', `${intl.formatDate(toMoment(this.point.measurement.earliestClosedDate).valueOf())}`],
                ['Latest Closed: ', `${intl.formatDate(toMoment(this.point.measurement.latestClosedDate).valueOf())}`],
                [`------`, ``],
                ['Avg. Cycle Time: ', `${intl.formatNumber(this.point.measurement.avgCycleTime)} days`],
                ['Avg. Lead Time: ', `${intl.formatNumber(this.point.measurement.avgLeadTime)} days`],
                ['No Cycle Time  : ', `${this.point.measurement.workItemsWithNullCycleTime} work items`]
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