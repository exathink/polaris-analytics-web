import React from 'react';
import {i18nDate, i18nNumber} from "../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../shared/views/measurementTrend/measurementTrendLineChart";

export const TraceabilityTrendsChart = ({
  traceabilityTrends,
  measurementPeriod,
  measurementWindow
}) => (
  <MeasurementTrendLineChart
      measurements={traceabilityTrends}
      metrics={[
        {
          key: 'traceability',
          displayName: 'Traceability',
          visible: true,
          type: 'line',
          value: measurement => measurement.traceability * 100
        },

      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}

      config={{
        title: 'Traceability',
        yAxisUom: 'Traceability (%)',

        yAxisNormalization: {
          min: 0,
          max: 100,
        },
        tooltip: {
          formatter: (measurement, seriesKey, intl) => (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body: [
                ['Traceability: ', `${i18nNumber(intl, measurement.traceability * 100)} %`],

                [`------`, ``],
                ['Commits with Specs (for this project): ', `${i18nNumber(intl, measurement.specCount)}`],
                ['Commits without Specs: ', `${i18nNumber(intl, measurement.nospecCount)}`],
                ['Total Commits: ', `${i18nNumber(intl, measurement.totalCommits)}`],

              ]
            }
          )
        }
      }}
    />
)

