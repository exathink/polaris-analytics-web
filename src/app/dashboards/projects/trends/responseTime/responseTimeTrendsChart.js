import React from 'react';
import {i18nDate, i18nNumber, percentileToText} from "../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../shared/views/measurementTrend/measurementTrendLineChart";


function getSelectedMetricDisplay(measurement, targetPercentile, seriesKey, intl) {
  switch (seriesKey) {
    case 'percentileCycleTime': {
      return [`${percentileToText(targetPercentile)} Cycle Time: `, `${i18nNumber(intl, measurement.percentileCycleTime)} days`]
    }
    case 'percentileLeadTime': {
      return [`${percentileToText(targetPercentile)} Lead Time: `, `${i18nNumber(intl, measurement.percentileLeadTime)} days`]
    }
    case 'percentileDuration': {
      return [`${percentileToText(targetPercentile)} Duration: `, `${i18nNumber(intl, measurement.percentileDuration)} days`]
    }
    case 'percentileLatency': {
      return [`${percentileToText(targetPercentile)} Delivery Latency: `, `${i18nNumber(intl, measurement.percentileLatency)} days`]
    }
    case 'percentileEffort': {
      return [`${percentileToText(targetPercentile)} Effort: `, `${i18nNumber(intl, measurement.percentileEffort)} dev-days`]
    }
    default: {
      return ['', '']
    }

  }
}
export const ResponseTimeTrendsChart = (
  {
    flowMetricsTrends,
    targetPercentile,
    measurementPeriod,
    measurementWindow,
    view
  }) => (
  <MeasurementTrendLineChart
    measurements={flowMetricsTrends}
    metrics={[
      {key: 'percentileLeadTime', displayName: `${percentileToText(targetPercentile)} Lead Time`, visible: false, type: 'spline'},
      {key: 'percentileCycleTime', displayName: `${percentileToText(targetPercentile)} Cycle Time`, visible: true, type:'spline'},
      {key: 'percentileLatency', displayName: `${percentileToText(targetPercentile)} Delivery L..`, visible: false, type: 'areaspline', stacked: true, color: '#beddd3'},
      {key: 'percentileDuration', displayName: `${percentileToText(targetPercentile)} Duration`, visible: false, type: 'areaspline', stacked: true},
      {key: 'percentileEffort', displayName: `${percentileToText(targetPercentile)} Effort`, visible: false, type:'spline', color: '#0f49b1'},

    ]}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}

    config={{
      title: 'Response Time',
      legendText: 'Specs',
      yAxisUom: 'Days',
      plotBands: {
        metric: 'percentileCycleTime'
      },

      tooltip: {
        formatter: (measurement, seriesKey, intl) => {

          return (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body:
                [
                  getSelectedMetricDisplay(measurement, targetPercentile, seriesKey, intl)
                  ,
                  [`------`, ``],
                  ['Total Closed: ', `${i18nNumber(intl, measurement.workItemsInScope)} work items`],
                  ['Earliest Closed: ', `${i18nDate(intl, measurement.earliestClosedDate)}`],
                  ['Latest Closed: ', `${i18nDate(intl, measurement.latestClosedDate)}`],
                  ['No Cycle Time  : ', `${measurement.workItemsWithNullCycleTime} work items`],
                ]
            }
          )
        }
      }
    }}
  />
)


