import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {i18nNumber, pick, toMoment} from "../../../../helpers/utility";
import {Colors} from "../../../shared/config";
import {getMetricRange} from "../../../shared/helpers/statsUtils";
import {Highcharts} from "../../../../framework/viz/charts"

require('highcharts/modules/annotations')(Highcharts);

function getPlotBands(config, measurements, metrics, plotLinesY, intl) {
  if (config.plotBands) {
    const metricConfig = metrics.find(metric => metric.key === config.plotBands.metric);
    let range = getMetricRange(measurements, config.plotBands.metric)
    if (metricConfig != null && metricConfig.value != null) {
      range = getMetricRange(
        measurements.map(
          measurement => (
            {
              value: metricConfig.value(measurement)
            })
        ),
        'value'
      )
    }
    const {min, max} = range;

    return {
      plotBands: [
        {
          to: max,
          from: min
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
            text: `Min: ${i18nNumber(intl, min)}`,
            align: 'left',
            verticalAlign: 'bottom',
            x: 15,
            y: 15
          },
          zIndex: 3,

        },
        ...(plotLinesY || [])
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

function getYValuesRange(config, measurements) {
  if (config.yAxisNormalization) {
    if (config.yAxisNormalization.metric) {
      const {min, max} = getMetricRange(measurements, config.yAxisNormalization.metric)

      return {
        // The min value of the axis will be set to 0 unless the minScale is specified
        min: (config.yAxisNormalization.minScale || 0) * min,
        // The max value of the axis will be set to max unless the maxScale value is specified.
        max: (config.yAxisNormalization.maxScale || 1) * max
      }
    } else if (config.yAxisNormalization.max && config.yAxisNormalization.min) {
      return {
        min: config.yAxisNormalization.min,
        max: config.yAxisNormalization.max
      }
    }
  }
  return {}
}

function getYAxisRange(plotLinesY, min, max) {
  if (plotLinesY != null) {
    // adjust the min and max values to include plotLines.
    let minY = min || plotLinesY[0].value;
    let maxY = max || plotLinesY[0].value;
    for (let i= 0; i < plotLinesY.length; i++) {
      if (plotLinesY[i].value < minY) {
        minY = plotLinesY[i].value
      }

      if(plotLinesY[i].value > maxY) {
        maxY = plotLinesY[i].value
      }
    }
    return {min: minY, max: maxY}

  } else {
    return {min, max}
  }
}

function getAnnotations(config, measurements, intl) {
  let annotations = [];
  if (config.annotations != null) {
    annotations = config.annotations.map(
      annotation => ({
        ...annotation,
        labels: annotation.labels.map(
          label => ({
            ...label,
            point: label.seriesKey ? getPointId(label.seriesKey, label.index) : label.point,
            text: label.getText ? label.getText(
              measurements, label.seriesKey, label.index, intl
            ): label.text
          })
        )
      })
    )
  }
  return annotations
}

function getPointId(seriesKey, index) {
  return `${seriesKey}:${index}`
}

export function getMeasurementTrendSeriesForMetrics(metrics, measurements) {
  const series = metrics.map(
    (metric, index) => ({
      key: metric.key,
      id: metric.key,
      type: metric.type,
      name: metric.displayName,
      visible: metric.visible,
      allowPointSelect: true,
      data: measurements.map(
        (measurement, index) => ({
          id: getPointId(metric.key, index),
          x: toMoment(measurement.measurementDate, true).valueOf(),
          y: metric.value ? metric.value(measurement) : measurement[metric.key],
          measurement: {...measurement, key: metric.key, index: index},
        })
      ).sort(
        (m1, m2) => m1.x - m2.x
      ),
      stacking: metric.stacked ? 'normal' : null,
      color: metric.color,
      cursor: 'pointer'
    })
  );
  return series;
}

export const MeasurementTrendLineChart = Chart({
    chartUpdateProps: props => pick(props, 'measurements', 'metrics', 'measurementWindow', 'measurementPeriod'),
    eventHandler: DefaultSelectionEventHandler,
    mapPoints: (points, _) => points.map(point => point.measurement),
    getConfig: ({measurements, metrics, measurementPeriod, measurementWindow, showPlotBands, config, intl}) => {

      const series = getMeasurementTrendSeriesForMetrics(metrics, measurements);

      const {min, max} = getYValuesRange(config, measurements, metrics);

      const {plotLinesY} = config
      const {min: yAxisMin, max: yAxisMax} = getYAxisRange(plotLinesY, min, max)

      const plotBands = showPlotBands ? getPlotBands(config, measurements, metrics, plotLinesY, intl) : [];


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
            text: config.xAxisUom || `${measurementWindow} days ending`
          },

        },
        yAxis: {
          type: 'linear',
          id: 'cycle-metric',
          title: {
            text: config.yAxisUom
          },
          softMin: yAxisMin,
          softMax: yAxisMax,
          // interpolate plotbands
          ...plotBands,
          plotLines: plotLinesY

        },
        // interpolate tooltip
        ...tooltip,
        series: series,
        plotOptions: {
          series: {
            animation: false,
            cursor: "pointer",
            states: {
              select: {
                color: null,
                opacity: 0.5
              },
            },
          }
        },
        annotations: getAnnotations(config, measurements, intl) || [],
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