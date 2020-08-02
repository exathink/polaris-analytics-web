import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, toMoment} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";


export const ThroughputTrendsChart = Chart({
    chartUpdateProps: props => pick(props, 'flowMetricsTrends', 'measurementWindow', 'measurementPeriod'),
    eventHandler: DefaultSelectionEventHandler,
    mapPoints: (points, _) => points,
    getConfig: ({flowMetricsTrends, measurementPeriod, measurementWindow, intl}) => {
      const throughputRange = flowMetricsTrends.reduce(
        ({min,max, specMax, specMin}, measurement) => ({
            max: Math.max(max, measurement['workItemsInScope']),
            min: Math.min(min, measurement['workItemsInScope']),
            specMax: Math.max(specMax, measurement['workItemsWithCommits']),
            specMin: Math.min(specMin, measurement['workItemsWithCommits']),
          }),
        {min:Number.MAX_VALUE, max:0, specMin: Number.MAX_VALUE, specMax: 0}
      )
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
          max: throughputRange.max * 2,
          plotBands:[
            {
              to: throughputRange.specMin,
              from: throughputRange.specMax,
              label: {
                text: `Delta: ${((throughputRange.specMax-throughputRange.specMin)/throughputRange.specMax)*100}%`,
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: -5,
              }
            },

          ],
          plotLines:[
            {
              value: throughputRange.specMax,
              label: {
                text: `Max: ${throughputRange.specMax}`,
                align: 'left',
                verticalAlign: 'top',

              }
            },
            {
              value: throughputRange.specMin,
              label: {
                text: `Min: ${throughputRange.specMin}`,
                align: 'left',
                verticalAlign: 'middle'
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