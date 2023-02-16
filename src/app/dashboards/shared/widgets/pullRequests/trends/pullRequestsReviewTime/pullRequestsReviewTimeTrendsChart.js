import React from "react";
import {i18nDate, i18nNumber, toMoment} from "../../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../views/measurementTrend/measurementTrendLineChart";
import { ResponseTimeMetricsColor } from "../../../../config";

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
  onSelectionChange
}) => (
  <MeasurementTrendLineChart
    measurements={pullRequestMetricsTrends}
    metrics={[
      {key: "avgAge", displayName: "Avg", visible: true, type: "areaspline", color: ResponseTimeMetricsColor.cycleTime},
    ]}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}
    onSelectionChange={onSelectionChange}
    config={{
      title: "Closed Pull Requests: Avg. Time to Merge",
      yAxisUom: "Days",
      legendText: "Time to Merge",
      tooltip: {
        formatter: (measurement, seriesKey, intl) => {
          return {
            header: `${measurementWindow} days ending ${i18nDate(intl, toMoment(measurement.measurementDate))}`,
            body: [
              getSelectedMetricDisplay(measurement, seriesKey, intl),
              ["Reviews Completed: ", `${i18nNumber(intl, measurement.totalClosed)}`],
            ],
          };
        },
      },
    }}
  />
);
