import React from "react";
import { i18nDate, i18nNumber, percentileToText } from "../../../../../../helpers/utility";
import { AppTerms, ResponseTimeMetricsColor } from "../../../../config";
import { MeasurementTrendLineChart } from "../../../../views/measurementTrend/measurementTrendLineChart";

function getSelectedMetricDisplay(measurement, targetPercentile, seriesKey, intl) {
  switch (seriesKey) {
    case "percentileCycleTime": {
      return [[
        `${percentileToText(targetPercentile)} Cycle Time: `,
        `${i18nNumber(intl, measurement.percentileCycleTime)} days`
      ]];
    }
    case "percentileLeadTime": {
      return [[
        `${percentileToText(targetPercentile)} Lead Time: `,
        `${i18nNumber(intl, measurement.percentileLeadTime)} days`
      ]];
    }
    case "percentileDuration": {
      return [[
        `${percentileToText(targetPercentile)} Coding: `,
        `${i18nNumber(intl, measurement.percentileDuration)} days`
      ]];
    }
    case "percentileLatency": {
      return [[
        `${percentileToText(targetPercentile)} Delivery: `,
        `${i18nNumber(intl, measurement.percentileLatency)} days`
      ]];
    }
    case "percentileEffort": {
      return [[
        `${percentileToText(targetPercentile)} Traceable Effort: `,
        `${i18nNumber(intl, measurement.percentileEffort)} FTE Days`
      ]];
    }
    case "avgCycleTime": {
      return [
        [`Avg. Cycle Time: `, `${i18nNumber(intl, measurement.avgCycleTime)} days`],
        ...getSelectedMetricDisplay(measurement, targetPercentile, "percentileCycleTime", intl)
      ];
    }
    case "avgLeadTime": {
      return [
        [`Avg. Lead Time: `, `${i18nNumber(intl, measurement.avgLeadTime)} days`],
        ...getSelectedMetricDisplay(measurement, targetPercentile, "percentileLeadTime", intl)
      ];
    }
    case "avgDuration": {
      return [
        [`Avg. Coding: `, `${i18nNumber(intl, measurement.avgDuration)} days`],
        ...getSelectedMetricDisplay(measurement, targetPercentile, "percentileDuration", intl)
      ];
    }
    case "avgLatency": {
      return [
        [`Avg. Delivery: `, `${i18nNumber(intl, measurement.avgLatency)} days`],
        ...getSelectedMetricDisplay(measurement, targetPercentile, "percentileLatency", intl)
      ];
    }
    case "avgEffort": {
      return [
        [`Avg. Traceable Effort: `, `${i18nNumber(intl, measurement.avgEffort)} FTE Days`],
        ...getSelectedMetricDisplay(measurement, targetPercentile, "percentileEffort", intl)
      ];
    }
    default: {
      return [["", ""]];
    }
  }
}

function isVisibleByDefault(defaultSeries, series) {
  return defaultSeries.indexOf("all") !== -1 || defaultSeries.indexOf(series) !== -1;
}

// function getAnnotationFor(measurements, seriesKey, index, intl, targetPercentile) {
//   const tooltipDisplay = getSelectedMetricDisplay(measurements[index], targetPercentile, seriesKey, intl);
//   return `${tooltipDisplay[0][1]}`;
// }

export const ResponseTimeTrendsChart = (
  {
    title,
    subtitle,
    flowMetricsTrends,
    targetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    measurementPeriod,
    measurementWindow,
    onSelectionChange,
    defaultSeries,
    specsOnly = true,
    showAnnotations = false,
    view
  }) => {

  const metrics = React.useMemo(() => [
    {
      key: "avgLeadTime",
      displayName: `Lead Time`,
      visible: isVisibleByDefault(defaultSeries, "leadTime"),
      type: "spline",
      color: ResponseTimeMetricsColor.leadTime
    },
    {
      key: "avgCycleTime",
      displayName: `Cycle Time`,
      visible: isVisibleByDefault(defaultSeries, "cycleTime"),
      type: "spline",
      color: ResponseTimeMetricsColor.cycleTime
    },

    {
      key: "avgLatency",
      displayName: `Delivery`,
      visible: isVisibleByDefault(defaultSeries, "latency"),
      type: "areaspline",
      stacked: true,
      color: ResponseTimeMetricsColor.latency
    },
    {
      key: "avgDuration",
      displayName: `Coding`,
      visible: isVisibleByDefault(defaultSeries, "duration"),
      type: "areaspline",
      stacked: true,
      color: ResponseTimeMetricsColor.duration
    },
    {
      key: "avgEffort",
      displayName: `Cost of Change`,
      visible: isVisibleByDefault(defaultSeries, "effort"),
      type: "spline",
      color: ResponseTimeMetricsColor.effort
    }

  ], [defaultSeries]);

  return <MeasurementTrendLineChart
    measurements={flowMetricsTrends}
    metrics={metrics}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}
    onSelectionChange={onSelectionChange}
    config={{
      title: title || `Response Time, ${specsOnly != null && !specsOnly ? `All ${AppTerms.cards.display}` : AppTerms.specs.display}`,
      legendText: "Average",
      yAxisUom: "Days",
      plotLinesY: [
        {
          color: "blue",
          value: leadTimeTarget,
          dashStyle: "longdashdot",
          width: 1,
          label: {
            text: `${percentileToText(targetPercentile)} LTT=${leadTimeTarget}`,
            align: "left",
            verticalAlign: "middle"
          },
          zIndex: 5
        },
        {
          color: "orange",
          value: cycleTimeTarget,
          dashStyle: "longdashdot",
          width: 1,
          label: {
            text: `${percentileToText(targetPercentile)} CTT=${cycleTimeTarget}`,
            align: "left",
            verticalAlign: "middle"
          },
          zIndex: 5
        }
      ],
      annotations: [{
        visible: showAnnotations,
        labels: [{
          seriesKey: "avgLeadTime",
          index: 0,
          getText: (measurements, seriesKey, index, intl) => `${i18nNumber(intl, measurements[index]?.[seriesKey], 1)} Days`,
          backgroundColor: ResponseTimeMetricsColor.leadTime,
          borderColor: ResponseTimeMetricsColor.leadTime,
          align: "center",

          distance: 9
        }, {
          seriesKey: "avgCycleTime",
          index: 0,
          getText: (measurements, seriesKey, index, intl) => `${i18nNumber(intl, measurements[index]?.[seriesKey], 1)} Days`,
          backgroundColor: ResponseTimeMetricsColor.cycleTime,
          borderColor: ResponseTimeMetricsColor.cycleTime,
          align: "center",

          distance: 10
        }, {
          seriesKey: "avgEffort",
          index: 0,
          getText: (measurements, seriesKey, index, intl) => `${i18nNumber(intl, measurements[index]?.[seriesKey], 1)} FTE Days`,
          backgroundColor: ResponseTimeMetricsColor.effort,
          borderColor: ResponseTimeMetricsColor.effort,
          align: "center",
          distance: 10
        }]
      }],
      tooltip: {
        formatter: (measurement, seriesKey, intl) => {

          return (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body:
                [
                  ...getSelectedMetricDisplay(measurement, targetPercentile, seriesKey, intl)
                  ,
                  [`------`, ``],
                  ["Total Closed: ", `${i18nNumber(intl, measurement.workItemsInScope)} ${!specsOnly ?  AppTerms.cards.display : AppTerms.specs.display}`],


                ]
            }
          );
        }
      }
    }}
  />;
};


