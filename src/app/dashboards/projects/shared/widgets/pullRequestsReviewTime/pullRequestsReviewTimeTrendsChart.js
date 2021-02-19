import React from "react";
import {i18nDate, i18nNumber} from "../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../shared/views/measurementTrend/measurementTrendLineChart";

function getSelectedMetricDisplay(measurement, seriesKey, intl) {
  const seriesKeys = {
    avgAge: ["Avg Time to Review: ", `${intl.formatNumber(measurement.avgAge)} Days`],
    maxAge: ["Max Time to Review: ", `${intl.formatNumber(measurement.maxAge)} Days`],
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
      {key: "maxAge", displayName: "Max", visible: true, type: "spline"},
      {key: "avgAge", displayName: "Avg", visible: true, type: "spline"},
    ]}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}
    config={{
      title: "Time to Close",
      yAxisUom: "Days",
      plotBands: {
        metric: "avgAge",
      },
      legendText: "Time to Close",
      yAxisNormalization: {
        metric: "maxAge",
        minScale: 0,
        maxScale: 1,
      },
      tooltip: {
        formatter: (measurement, seriesKey, intl) => {
          return {
            header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
            body: [
              getSelectedMetricDisplay(measurement, seriesKey, intl),
              ["Requests Completed: ", `${i18nNumber(intl, measurement.totalClosed)}`],
            ],
          };
        },
      },
    }}
  />
);
