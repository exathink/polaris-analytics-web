import React from 'react';
import {i18nDate, i18nNumber} from "../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../shared/views/measurementTrend/measurementTrendLineChart";


function getSelectedMetricDisplay(measurement, seriesKey, intl) {
  switch (seriesKey) {
    case 'avgCycleTime': {
      return ['Avg. Cycle Time: ', `${i18nNumber(intl, measurement.avgCycleTime)} days`]
    }
    case 'avgLeadTime': {
      return ['Avg. Lead Time: ', `${i18nNumber(intl, measurement.avgLeadTime)} days`]
    }
    case 'avgDuration': {
      return ['Avg. Duration: ', `${i18nNumber(intl, measurement.avgDuration)} days`]
    }
    case 'avgLatency': {
      return ['Avg. Latency: ', `${i18nNumber(intl, measurement.avgLatency)} days`]
    }

  }
}
export const ResponseTimeTrendsChart = (
  {
    flowMetricsTrends,
    measurementPeriod,
    measurementWindow,
    view
  }) => (
  <MeasurementTrendLineChart
    measurements={flowMetricsTrends}
    metrics={[
      {key: 'avgCycleTime', displayName: 'Avg. Cycle Time', visible: true, type:'spline'},
      {key: 'avgLatency', displayName: 'Avg. Latency', visible: view === 'detail', type: 'spline'},
      {key: 'avgDuration', displayName: 'Avg. Duration', visible: view ==='detail', type: 'spline'},
      {key: 'avgLeadTime', displayName: 'Avg. Lead Time', visible: view === 'detail', type: 'spline'},
    ]}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}

    config={{
      title: 'Response Time',
      legendText: 'Specs',
      yAxisUom: 'Days',
      plotBands: {
        metric: 'avgCycleTime'
      },
      yAxisNormalization: {
        metric: 'avgLeadTime',
        minScale: 0,
        maxScale: 1,
      },
      tooltip: {
        formatter: (measurement, seriesKey, intl) => {

          return (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body:
                [
                  getSelectedMetricDisplay(measurement, seriesKey, intl)
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


