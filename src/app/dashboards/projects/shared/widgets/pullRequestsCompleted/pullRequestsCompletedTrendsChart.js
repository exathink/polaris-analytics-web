import React from "react";
import {i18nDate, i18nNumber} from "../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../shared/views/measurementTrend/measurementTrendLineChart";

export const PullRequestsCompletedTrendsChart = ({pullRequestMetricsTrends, measurementPeriod, measurementWindow, view}) => (
  <MeasurementTrendLineChart
    measurements={pullRequestMetricsTrends}
    metrics={[{key: "totalClosed", displayName: "Total Closed", visible: true, type: "spline"}]}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}
    config={{
      title: "Code Reviews Completed",
      yAxisUom: "Code Reviews",
      plotBands: {
        metric: "totalClosed",
      },
      yAxisNormalization: {
        metric: "totalClosed",
        minScale: 0,
        maxScale: 1.25,
      },
      tooltip: {
        formatter: (measurement, seriesKey, intl) => {
          return {
            header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
            body: [
              ["Code Reviews Completed: ", `${i18nNumber(intl, measurement.totalClosed)}`],
              ["Avg Age: ", `${intl.formatNumber(measurement.avgAge)} Days`],
              ["Max Age: ", `${intl.formatNumber(measurement.maxAge)} Days`],
            ],
          };
        },
      },
    }}
  />
);
