import React from 'react';
import {i18nDate, i18nNumber, percentileToText} from "../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../shared/views/measurementTrend/measurementTrendLineChart";


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
    case 'avgCycleTime': {
      return [`Avg. Cycle Time: `, `${i18nNumber(intl, measurement.avgCycleTime)} days`]
    }
    case 'avgLeadTime': {
      return [`Avg. Lead Time: `, `${i18nNumber(intl, measurement.avgLeadTime)} days`]
    }
    case 'avgDuration': {
      return [`Avg. Duration: `, `${i18nNumber(intl, measurement.avgDuration)} days`]
    }
    case 'avgLatency': {
      return [`Avg. Delivery Latency: `, `${i18nNumber(intl, measurement.avgLatency)} days`]
    }
    case 'avgEffort': {
      return [`Avg. Effort: `, `${i18nNumber(intl, measurement.avgEffort)} dev-days`]
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
    leadTimeTarget,
    cycleTimeTarget,
    measurementPeriod,
    measurementWindow,
    view
  }) => (
  <MeasurementTrendLineChart
    measurements={flowMetricsTrends}
    metrics={[
      {key: 'avgLeadTime', displayName: `Avg. Lead Time`, visible: false, type: 'spline'},
      {key: 'avgCycleTime', displayName: `Avg. Cycle Time`, visible: true, type:'spline'},
      {key: 'avgLatency', displayName: `Avg. Delivery L..`, visible: false, type: 'areaspline', stacked: true, color: '#beddd3'},
      {key: 'avgDuration', displayName: `Avg. Duration`, visible: false, type: 'areaspline', stacked: true},
      {key: 'avgEffort', displayName: `Avg. Effort`, visible: false, type:'spline', color: '#0f49b1'},

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
      plotLinesY: [
        {
            color: "orange",
            value: cycleTimeTarget,
            dashStyle: "longdashdot",
            width: 1,
            label: {
              text: `T=${cycleTimeTarget}`,
              align: 'right',
              verticalAlign: 'middle',
            },
            zIndex: 5,
          },
      ],
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


