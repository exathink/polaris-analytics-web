import React from 'react';
import {i18nDate, i18nNumber} from "../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../shared/views/measurementTrend/measurementTrendLineChart";

export const CapacityTrendsChart = ({
  capacityTrends,
  measurementPeriod,
  measurementWindow,
  view
}) => (
  <MeasurementTrendLineChart
      measurements={capacityTrends}
      metrics={[
        {key: 'totalCommitDays', displayName: 'Total Commit Days', visible: view === 'detail', type: 'spline'},
        {key: 'avgCommitDays', displayName: 'Av. Commit Days', visible: true, type: 'spline'},

      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}

      config={{
        title: 'Capacity',
        yAxisUom: 'Commit Days',
        plotBands: {
          metric: 'avgCommitDays'
        },
        yAxisNormalization: {
          metric: 'totalCommitDays',
          minScale: 0,
          maxScale: 1,
        },
        tooltip: {
          formatter: (measurement, seriesKey, intl) => (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body:  [
                ['Avg. Commit Days: ', `${i18nNumber(intl, measurement.avgCommitDays)}`],
                ['Total Commit Days', `${i18nNumber(intl, measurement.totalCommitDays)}`],
                ['Contributors: ', `${i18nNumber(intl, measurement.contributorCount)}`],

              ]
            }
          )
        }
      }}
    />
)

