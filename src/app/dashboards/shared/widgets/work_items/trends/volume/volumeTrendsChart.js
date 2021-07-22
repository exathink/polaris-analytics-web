import React from 'react';
import {i18nDate, i18nNumber} from "../../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../views/measurementTrend/measurementTrendLineChart";

export const VolumeTrendsChart = ({
  flowMetricsTrends,
  measurementPeriod,
  measurementWindow,
  onSelectionChange,
  chartConfig,
  view
}) => {
  const {
    specs = {
      visible: true,
      type: 'column'
    },
    cards = {
      visible: true,
      type: 'spline'
    }
  } = chartConfig || {};
  return (
  <MeasurementTrendLineChart
      measurements={flowMetricsTrends}
      metrics={[
        {key: 'workItemsInScope', displayName: 'Cards', visible: cards.visible, type: cards.type || 'column'},
        {key: 'workItemsWithCommits', displayName: 'Specs', visible: specs.visible, type: specs.type || 'spline', color: 'rgba(6,92,87,0.8)'},

      ]}
      measurementPeriod={measurementPeriod}
      measurementWindow={measurementWindow}
      onSelectionChange={onSelectionChange}
      config={{
        title: 'Volume',
        yAxisUom: 'Cards',
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
  );
}

