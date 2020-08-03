import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {pick, toMoment, i18nNumber} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";
import {getMetricRange, getPercentSpread} from "../../../shared/helpers/statsUtils";

function getPlotBands(config, measurements, intl) {
  if(config.plotBands) {
    const {min, max} = getMetricRange(measurements, config.plotBands.metric)
      return {
          plotBands: [
            {
              to: max,
              from: min,
              label: {
                text: `Spread: ${i18nNumber(intl, getPercentSpread(min, max))}%`,
                align: 'right',
                verticalAlign: 'top',
                x: -10,
                y: -5,
              }
            },

          ],
          plotLines: [
            {
              value: max,
              label: {
                text: `Max: ${i18nNumber(intl, max)}`,
                align: 'left',
                verticalAlign: 'top',

              }
            },
            {
              value: min,
              label: {
                text: `Min: ${i18nNumber(intl,min)}`,
                align: 'left',
                verticalAlign: 'bottom',
                x: 15,
                y: 15
              },
              zIndex: 3,

            }
          ]
        }
  } else {
    return {}
  }

}

function getTooltip(config, intl) {
  if (config.tooltip) {
    return {
      tooltip: {
          useHTML: true,
          followPointer: false,
          hideDelay: 0,
          formatter: function () {
            return tooltipHtml(
              config.tooltip.formatter(this.point.measurement, this.point.series.options.key, intl)
            )
          }
        }
    }
  } else {
    return {}
  }
}

function getYAxisRange(config, measurements) {
  if (config.yAxisNormalization) {
    const {min, max} = getMetricRange(measurements, config.yAxisNormalization.metric)

    return {
      // The min value of the axis will be set to 0 unless the minScale is specified
      min: (config.yAxisNormalization.minScale || 0) * min,
      // The max value of the axis will be set to max unless the maxScale value is specified.
      max: (config.yAxisNormalization.maxScale || 1) * max
    }
  } else {
    return {
    }
  }
}

export const MeasurementTrendLineChart = Chart({
    chartUpdateProps: props => pick(props, 'measurements', 'metrics', 'config', 'measurementWindow', 'measurementPeriod'),
    eventHandler: DefaultSelectionEventHandler,
    mapPoints: (points, _) => points,
    getConfig: ({measurements, metrics, measurementPeriod, measurementWindow, config, intl}) => {

      const series = metrics.map(
        (metric, index) => ({
          key: metric.key,
          id: metric.key,
          type: metric.type,
          name: metric.displayName,
          visible: metric.visible,
          data: measurements.map(
            measurement => ({
              x: toMoment(measurement.measurementDate, true).valueOf(),
              y: measurement[metric.key],
              measurement: measurement
            })
          ).sort(
            (m1, m2) => m1.x - m2.x
          )
        })
      );

      const {min: yAxisMin, max: yAxisMax} = getYAxisRange(config, measurements);

      const plotBands = getPlotBands(config, measurements, intl);

      const tooltip = getTooltip(config, intl);

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
          text: config.title,
        },
        subtitle: {
          text: config.subTitle || `${measurementPeriod} day trend`
        },
        legend: {
          title: {
            text: config.legendText || ``,
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
            text: config.xAxisUom || `Days`
          },

        },
        yAxis: {
          type: 'linear',
          id: 'cycle-metric',
          title: {
            text: config.yAxisUom
          },
          min: yAxisMin,
          max: yAxisMax,
          // interpolate plotbands
          ...plotBands
        },
        // interpolate tooltip
        ...tooltip,
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