import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, toMoment, percentileToText} from "../../../../helpers/utility";
import {Colors, WorkItemTypeDisplayName} from "../../../shared/config";
import {formatDateTime} from "../../../../i18n";


export const CycleMetricsTrendsBoxPlotChart = Chart({
    chartUpdateProps: props => pick(props, 'flowMetricsTrends', 'measurementPeriod', 'measurementWindow'),
    eventHandler: DefaultSelectionEventHandler,
    mapPoints: (points, _) => points,
    getConfig: ({flowMetricsTrends, measurementWindow, measurementPeriod, targetPercentile, intl}) => {

      const boxPlotSeriesName = 'Variability';
      const lineSeriesName = `${percentileToText(targetPercentile)}`;

      const series = [
        {
          key: 'cycle_time_percentile',
          id: 'cycle_time_percentile',
          name: `${lineSeriesName}`,
          type: 'line',
          data: flowMetricsTrends.map(
            measurement => ({
              x: toMoment(measurement['measurementDate'], true).valueOf(),
              y: measurement['percentileCycleTime'],
              measurement: measurement
            })
          ).sort(
              (m1, m2) => m1.x - m2.x
            )
        },
        {
          key: 'cycle_time_box',
          id: 'cycle_time_box',
          name: `${boxPlotSeriesName}`,
          type: 'boxplot',
          data: flowMetricsTrends.map(
            measurement => ({
              x: toMoment(measurement['measurementDate'], true).valueOf(),
              low: measurement['minCycleTime'],
              q1: measurement['q1CycleTime'],
              median: measurement['medianCycleTime'],
              q3: measurement['q3CycleTime'],
              high: measurement['maxCycleTime'],
              measurement: measurement
            })
          ).sort(
              (m1, m2) => m1.x - m2.x
            )
        },

      ]
      return {
        chart: {
          animation: false,
          backgroundColor: Colors.Chart.backgroundColor,
          panning: true,
          panKey: 'shift',
          zoomType: 'xy'
        },
        title: {
          text: 'Predictability'
        },
        subtitle: {
          text: `${measurementPeriod} day trend`
        },
        legend: {
          title: {
            text: `Cycle Time`,
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
        },
        tooltip: {
          useHTML: true,
          followPointer: false,
          hideDelay: 0,
          formatter: function () {
            return tooltipHtml(this.point.series.name === boxPlotSeriesName ? {
              header: `${this.point.series.name}: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                ['Maximum:  ', `${intl.formatNumber(this.point.measurement.maxCycleTime)} days`],
                ['Upper Quartile: ', `${intl.formatNumber(this.point.measurement.q3CycleTime)} days`],
                ['Median : ', `${intl.formatNumber(this.point.measurement.medianCycleTime)} days`],
                ['Lower Quartile: ', `${intl.formatNumber(this.point.measurement.q1CycleTime)} days`],
                ['Minimum: ', `${intl.formatNumber(this.point.measurement.minCycleTime)} days`],
                [`------`, ``],
                ['Total Closed: ', `${intl.formatNumber(this.point.measurement.workItemsInScope)} work items`],

              ]
            }: {
              header: `${this.point.series.name}: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`${percentileToText(targetPercentile)}`, `${intl.formatNumber(this.point.measurement.percentileCycleTime)} days`],
                [`Average: `, `${intl.formatNumber(this.point.measurement.avgCycleTime)} days`],
                [`------`, ``],
                ['Total Closed: ', `${intl.formatNumber(this.point.measurement.workItemsInScope)} work items`],
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