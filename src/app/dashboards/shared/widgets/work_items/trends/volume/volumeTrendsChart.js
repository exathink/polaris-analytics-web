import React from 'react';
import {i18nDate, i18nNumber} from "../../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../views/measurementTrend/measurementTrendLineChart";
import { ResponseTimeMetricsColor } from "../../../../config";

export const VolumeTrendsChart = ({
  flowMetricsTrends,
  measurementPeriod,
  measurementWindow,
  onSelectionChange,
  chartConfig,
  view
}) => {


  const metrics = React.useMemo(() => {
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
    return [
      {key: "workItemsInScope", displayName: "Cards", visible: cards.visible, type: cards.type || "column"},
      {
        key: "workItemsWithCommits",
        displayName: "Specs",
        visible: specs.visible,
        type: specs.type || "spline",
        color: ResponseTimeMetricsColor.specs,
      },
    ]
  }, [chartConfig]);

  return (
  <MeasurementTrendLineChart
      measurements={flowMetricsTrends}
      metrics={metrics}
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
        annotations: [{
          visible: true,
          labels: [{
            point: {x:0, y:0},
            getText: (measurements, seriesKey, index, intl) => `Spec Ratio: ${i18nNumber(intl, (measurements[0].workItemsWithCommits/measurements[0].workItemsInScope)*100.0)} %`,
            backgroundColor: ResponseTimeMetricsColor.specs,
            borderColor: ResponseTimeMetricsColor.specs,
            align: 'center',

            distance: 9
          },{
            seriesKey: 'workItemsWithCommits',
            index: 0,
            getText: (measurements, seriesKey, index, intl) => `${i18nNumber(intl, measurements[index][seriesKey], 1)} Specs`,
            backgroundColor: ResponseTimeMetricsColor.specs,
            borderColor: ResponseTimeMetricsColor.specs,
            align: 'center',

            distance: 9
          }]
        }],
        tooltip: {
          formatter: (measurement, seriesKey, intl) => (
            {
              header: `${measurementWindow} days ending ${i18nDate(intl, measurement.measurementDate)}`,
              body: seriesKey === 'workItemsWithCommits' ? [
                ['Specs Closed: ', `${i18nNumber(intl, measurement.workItemsWithCommits)} specs`],
                ['Earliest Closed: ', `${i18nDate(intl, measurement.earliestClosedDate)}`],
                ['Latest Closed: ', `${i18nDate(intl, measurement.latestClosedDate)}`],

              ]: [
                  ['Total Closed: ', `${i18nNumber(intl, measurement.workItemsInScope)} cards`],
                  ['Specs Closed: ', `${i18nNumber(intl, measurement.workItemsWithCommits)} specs`],
                  ['Spec Ratio: ', `${i18nNumber(intl, (measurement.workItemsWithCommits/measurement.workItemsInScope)*100.0)} %`]
                ]
            }
          )
        }
      }}
    />
  );
}

