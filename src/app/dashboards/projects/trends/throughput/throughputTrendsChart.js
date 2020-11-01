import React from 'react';
import {i18nDate, i18nNumber} from "../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../shared/views/measurementTrend/measurementTrendLineChart";

export const VolumeTrendsChart = ({
  flowMetricsTrends,
  measurementPeriod,
  measurementWindow,
  view
}) => (
  <MeasurementTrendLineChart
      measurements={flowMetricsTrends}
      metrics={[
        {key: 'workItemsInScope', displayName: 'Total Closed', visible: view === 'detail', type: 'spline'},
        {key: 'workItemsWithCommits', displayName: 'Specs Closed', visible: true, type: 'spline'},

      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}

      config={{
        title: 'Volume',
        yAxisUom: 'Work Items',
        plotBands: {
          metric: 'workItemsWithCommits'
        },
        yAxisNormalization: {
          metric: 'workItemsInScope',
          minScale: 0,
          maxScale: 1.25,
        },
        tooltip: {
          formatter: (measurement, seriesKey, intl) => (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body: seriesKey === 'workItemsWithCommits' ? [
                ['Specs Closed: ', `${i18nNumber(intl, measurement.workItemsWithCommits)} specs`],
                ['Earliest Closed: ', `${i18nDate(intl, measurement.earliestClosedDate)}`],
                ['Latest Closed: ', `${i18nDate(intl, measurement.latestClosedDate)}`],

              ]: [
                  ['Total Closed: ', `${i18nNumber(intl, measurement.workItemsInScope)} work items`],
                  ['Specs Closed: ', `${i18nNumber(intl, measurement.workItemsWithCommits)} specs`]
                ]
            }
          )
        }
      }}
    />
)

