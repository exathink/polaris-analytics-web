import React from 'react';
import {i18nDate, i18nNumber} from "../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../shared/views/measurementTrend/measurementTrendLineChart";

export const ThroughputTrendsChart = ({
  flowMetricsTrends,
  measurementPeriod,
  measurementWindow
}) => (
  <MeasurementTrendLineChart
      measurements={flowMetricsTrends}
      metrics={[
        {key: 'workItemsWithCommits', displayName: 'Specs Closed', visible: true},
        {key: 'workItemsInScope', displayName: 'Total Closed', visible: false}
      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}

      config={{
        title: 'Throughput',
        yAxisUom: 'Work Items',
        plotBands: {
          metric: 'workItemsWithCommits'
        },
        yAxisNormalization: {
          metric: 'workItemsInScope',
          minScale: 0,
          maxScale: 2,
        },
        tooltip: {
          formatter: (measurement, seriesKey, intl) => (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body: seriesKey === 'workItemsWithCommits' ? [
                ['Specs Closed: ', `${i18nNumber(intl, measurement.workItemsWithCommits)} specs`],
                ['Earliest Closed: ', `${i18nDate(intl, measurement.earliestClosedDate)}`],
                ['Latest Closed: ', `${i18nDate(intl, measurement.latestClosedDate)}`],
                [`------`, ``],
                ['Avg. Cycle Time: ', `${i18nNumber(intl, measurement.avgCycleTime)} days`],
                ['Avg. Lead Time: ', `${i18nNumber(intl, measurement.avgLeadTime)} days`],
                ['No Cycle Time  : ', `${measurement.workItemsWithNullCycleTime} work items`]
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

