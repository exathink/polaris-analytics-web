import React from "react";
import {i18nDate, i18nNumber} from "../../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../views/measurementTrend/measurementTrendLineChart";
import { Colors } from "../../../../config";


export const PullRequestsCompletedTrendsChart = ({pullRequestMetricsTrends, measurementPeriod, measurementWindow, view, onSelectionChange}) => (
  <MeasurementTrendLineChart
    measurements={pullRequestMetricsTrends}
    metrics={[{key: "totalClosed", displayName: "Total Closed", visible: true, type: "column", color: Colors.PullRequestStateType.closed}]}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}
    onSelectionChange={onSelectionChange}
    config={{
      title: "Closed Pull Requests",
      yAxisUom: "Pull Requests",
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
              ["PRs Closed: ", `${i18nNumber(intl, measurement.totalClosed)}`],
              ["Avg Time to Close: ", `${intl.formatNumber(measurement.avgAge)} Days`],
              ["Max Time to Close: ", `${intl.formatNumber(measurement.maxAge)} Days`],
            ],
          };
        },
      },
    }}
  />
);
