import React from "react";
import {i18nDate, i18nNumber} from "../../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../views/measurementTrend/measurementTrendLineChart";
import {AppTerms, ResponseTimeMetricsColor} from "../../../../config";

export const VolumeTrendsChart = ({
  flowMetricsTrends,
  measurementPeriod,
  measurementWindow,
  onSelectionChange,
  chartConfig,
  effortOnly,
  specsOnly,
  view,
}) => {
  const metrics = React.useMemo(() => {
    const {
      specs = {
        visible: true,
        type: "column",
      },
      cards = {
        visible: true,
        type: "spline",
      },
    } = chartConfig || {};

    const specMetric = {
      key: "workItemsWithCommits",
      displayName: AppTerms.specs.display,
      visible: specs.visible,
      type: specs.type || "spline",
      color: ResponseTimeMetricsColor.specs,
    };
    const cardMetric = {
      key: "workItemsInScope",
      displayName: AppTerms.allCards.display,
      visible: cards.visible,
      type: cards.type || "column",
    };
    const effortMetric = {
      key: "totalEffort",
      displayName: "Total Effort",
      visible: true,
      type: "column",
      color: ResponseTimeMetricsColor.effort
    };
    if (effortOnly){
      return [effortMetric]
    } else {
      if (specsOnly !== undefined) {
        if (specsOnly) {
          return [specMetric];
        } else {
          return [cardMetric];
        }
      }
    }
    return [cardMetric, specMetric];
  }, [chartConfig, specsOnly, effortOnly]);

  return (
    <MeasurementTrendLineChart
      measurements={flowMetricsTrends}
      metrics={metrics}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}
      onSelectionChange={onSelectionChange}
      config={{
        title: effortOnly? "Effort Throughput" : (chartConfig?.title || "Flow Volume"),
        subTitle: chartConfig?.subTitle,
        yAxisUom: (effortOnly? "FTE Days" : chartConfig?.yAxisUom || "Work Items"),
        xAxisUom: chartConfig?.xAxisUom,
        plotBands: {
          metric: "workItemsWithCommits",
        },
        yAxisNormalization: {
          metric: "workItemsInScope",

        },
        annotations: chartConfig?.annotations ?? [
          {
            visible: true,
            labels: [
              {
                point: {x: 0, y: 0},
                getText: (measurements, seriesKey, index, intl) =>
                  `${AppTerms.spec.display} Ratio: ${i18nNumber(
                    intl,
                    measurements[0]?.workItemsInScope !== 0 && measurements[0]?.workItemsInScope != null && measurements[0]?.workItemsWithCommits != null ? (measurements[0]?.workItemsWithCommits / measurements[0]?.workItemsInScope) * 100.0 : 0
                  )} %`,
                backgroundColor: ResponseTimeMetricsColor.specs,
                borderColor: ResponseTimeMetricsColor.specs,
                align: "center",

                distance: 9,
              },
              {
                seriesKey: "workItemsWithCommits",
                index: 0,
                getText: (measurements, seriesKey, index, intl) =>
                  `${i18nNumber(intl, measurements[index]?.[seriesKey], 1)} ${AppTerms.specs.display}`,
                backgroundColor: ResponseTimeMetricsColor.specs,
                borderColor: ResponseTimeMetricsColor.specs,
                align: "center",

                distance: 9,
              },
            ],
          },
        ],
        tooltip: {
          formatter: (measurement, seriesKey, intl) => ({
            header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
            body:
              seriesKey === "workItemsWithCommits" || seriesKey === "totalEffort"
                ? [
                    [`${AppTerms.specs.display} Closed: `, `${i18nNumber(intl, measurement.workItemsWithCommits)} ${String(AppTerms.specs.display).toLowerCase()}`],
                    ["Earliest Closed: ", `${i18nDate(intl, measurement.earliestClosedDate)}`],
                    ["Latest Closed: ", `${i18nDate(intl, measurement.latestClosedDate)}`],
                    ["Total Effort: ", `${i18nNumber(intl, measurement.totalEffort)} FTE Days`]
                  ]
                : [
                    ["Total Closed: ", `${i18nNumber(intl, measurement.workItemsInScope)} ${String(AppTerms.cards.display).toLowerCase()}`],
                    [`${AppTerms.specs.display} Closed: `, `${i18nNumber(intl, measurement.workItemsWithCommits)} ${String(AppTerms.specs.display).toLowerCase()}`],
                    [
                      `${AppTerms.spec.display} Ratio: `,
                      `${i18nNumber(
                        intl,
                        measurement.workItemsInScope !== 0 ? (measurement.workItemsWithCommits / measurement.workItemsInScope) * 100.0 : 0
                      )} %`,
                    ],
                  ],
          }),
        },
      }}
    />
  );
};
