import React from 'react';
import {i18nDate, i18nNumber} from "../../../../../helpers/utility";
import { AppTerms } from '../../../config';
import {MeasurementTrendLineChart} from "../../../views/measurementTrend/measurementTrendLineChart";

export const TraceabilityTrendsChart = ({
  traceabilityTrends,
  measurementPeriod,
  measurementWindow,
  excludeMerges,
}) => (
  <MeasurementTrendLineChart
      measurements={traceabilityTrends}
      metrics={[
        {
          key: 'traceability',
          displayName: excludeMerges? 'Excluding Merges' : 'Traceability',
          visible: true,
          type: 'spline',
          value: measurement => measurement.traceability * 100
        },

      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}

      config={{
        title: 'Traceability',
        yAxisUom: 'Traceability (%)',
        plotBands: {
          metric: 'traceability'
        },
        yAxisNormalization: {
          min: 0.1,
          max: 100,
        },
        tooltip: {
          formatter: (measurement, seriesKey, intl) => (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body: [
                ['Traceability: ', `${i18nNumber(intl, measurement.traceability * 100)} %`],

                [`------`, ``],
                [`Commits with ${AppTerms.specs.display}: `, `${i18nNumber(intl, measurement.specCount)}`],
                [`Commits without ${AppTerms.specs.display}: `, `${i18nNumber(intl, measurement.nospecCount)}`],
                ['Total Commits: ', `${i18nNumber(intl, measurement.totalCommits)}`],

              ]
            }
          )
        }
      }}
    />
)

