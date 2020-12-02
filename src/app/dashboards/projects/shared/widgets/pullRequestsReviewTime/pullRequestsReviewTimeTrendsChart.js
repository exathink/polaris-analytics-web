import React from "react";
import {i18nDate, i18nNumber} from "../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../shared/views/measurementTrend/measurementTrendLineChart";

function getSelectedMetricDisplay(measurement, seriesKey, intl) {
  const seriesKeys = {
    avgAge: ["Avg Age: ", `${intl.formatNumber(measurement.avgAge)} Days`],
    maxAge: ["Max Age: ", `${intl.formatNumber(measurement.maxAge)} Days`],
  };

  return seriesKeys[seriesKey];
}

export const PullRequestsReviewTimeTrendsChart = ({
  pullRequestMetricsTrends,
  measurementPeriod,
  measurementWindow,
  view,
}) => (
  <MeasurementTrendLineChart
    measurements={pullRequestMetricsTrends}
    metrics={[
      {key: "maxAge", displayName: "Max Age", visible: true, type: "spline"},
      {key: "avgAge", displayName: "Avg Age", visible: true, type: "spline"},
    ]}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}
    config={{
      title: "Code Review Time",
      yAxisUom: "Days",
      plotBands: {
        metric: "maxAge",
      },
      yAxisNormalization: {
        metric: "maxAge",
        minScale: 0,
        maxScale: 1.25,
      },
      tooltip: {
        formatter: (measurement, seriesKey, intl) => {
          return {
            header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
            body: [
              getSelectedMetricDisplay(measurement, seriesKey, intl),
              ["Code Reviews Completed: ", `${i18nNumber(intl, measurement.totalClosed)}`],
            ],
          };
        },
      },
    }}
  />
);
