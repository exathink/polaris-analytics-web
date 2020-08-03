import React from 'react';
import {i18nDate, i18nNumber} from "../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../shared/views/measurementTrend/measurementTrendLineChart";

export const ResponseTimeTrendsChart = (
  {
    flowMetricsTrends,
    measurementPeriod,
    measurementWindow
  }) => (
  <MeasurementTrendLineChart
    measurements={flowMetricsTrends}
    metrics={[
      {key: 'avgCycleTime', displayName: 'Avg. Cycle Time', visible: true, type:'line'},
      {key: 'avgLeadTime', displayName: 'Avg. Lead Time', visible: false, type: 'line'}
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
        maxScale: 2,
      },
      tooltip: {
        formatter: (measurement, seriesKey, intl) => {
          const selectedMetricDisplay = seriesKey === 'avgCycleTime' ?
            ['Avg. Cycle Time: ', `${i18nNumber(intl, measurement.avgCycleTime)} days`] :
            ['Avg. Lead Time: ', `${i18nNumber(intl, measurement.avgLeadTime)} days`];
          return (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body:
                [
                  selectedMetricDisplay
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


