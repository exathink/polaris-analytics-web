import React from "react";
import {i18nDate, i18nNumber, percentileToText} from "../../../../../../helpers/utility";
import {MeasurementTrendLineChart} from "../../../../views/measurementTrend/measurementTrendLineChart";

function getSelectedMetricDisplay(measurement, targetPercentile, seriesKey, intl) {
  switch (seriesKey) {
    case "percentileCycleTime": {
      return [
        `${percentileToText(targetPercentile)} Cycle Time: `,
        `${i18nNumber(intl, measurement.percentileCycleTime)} days`,
      ];
    }
    case "percentileLeadTime": {
      return [
        `${percentileToText(targetPercentile)} Lead Time: `,
        `${i18nNumber(intl, measurement.percentileLeadTime)} days`,
      ];
    }
    case "percentileDuration": {
      return [
        `${percentileToText(targetPercentile)} Duration: `,
        `${i18nNumber(intl, measurement.percentileDuration)} days`,
      ];
    }
    case "percentileLatency": {
      return [
        `${percentileToText(targetPercentile)} Delivery Latency: `,
        `${i18nNumber(intl, measurement.percentileLatency)} days`,
      ];
    }
    case "percentileEffort": {
      return [
        `${percentileToText(targetPercentile)} Effort: `,
        `${i18nNumber(intl, measurement.percentileEffort)} dev-days`,
      ];
    }
    case "avgCycleTime": {
      return [`Avg. Cycle Time: `, `${i18nNumber(intl, measurement.avgCycleTime)} days`];
    }
    case "avgLeadTime": {
      return [`Avg. Lead Time: `, `${i18nNumber(intl, measurement.avgLeadTime)} days`];
    }
    case "avgDuration": {
      return [`Avg. Implementation: `, `${i18nNumber(intl, measurement.avgDuration)} days`];
    }
    case "avgLatency": {
      return [`Avg. Delivery: `, `${i18nNumber(intl, measurement.avgLatency)} days`];
    }
    case "avgEffort": {
      return [`Avg. Effort: `, `${i18nNumber(intl, measurement.avgEffort)} dev-days`];
    }
    default: {
      return ["", ""];
    }
  }
}
function isVisibleByDefault(defaultSeries, series) {
  return defaultSeries.indexOf("all") !== -1 || defaultSeries.indexOf(series) !== -1;
}

export const ResponseTimeTrendsChart = (
  {
    flowMetricsTrends,
    targetPercentile,
    leadTimeTarget,
    cycleTimeTarget,
    measurementPeriod,
    measurementWindow,
    onSelectionChange,
    defaultSeries,
    specsOnly,
    view
  }) => {
  
  const metrics = React.useMemo(() => [
    {key: 'avgLeadTime', displayName: `Lead Time`, visible: isVisibleByDefault(defaultSeries, "leadTime"), type: 'spline'},
    {key: 'avgCycleTime', displayName: `Cycle Time`, visible: isVisibleByDefault(defaultSeries, "cycleTime"), type:'spline'},

    {key: 'avgLatency', displayName: `Delivery`, visible: isVisibleByDefault(defaultSeries, "latency"), type: 'areaspline', stacked: true, color: '#beddd3'},
    {key: 'avgDuration', displayName: `Implementation`, visible: isVisibleByDefault(defaultSeries, "duration"), type: 'areaspline', stacked: true},
    {key: 'avgEffort', displayName: `Effort`, visible: isVisibleByDefault(defaultSeries, "effort"), type:'spline', color: '#0f49b1'},

  ], [defaultSeries]);
  
  return <MeasurementTrendLineChart
    measurements={flowMetricsTrends}
    metrics={metrics}
    measurementPeriod={measurementPeriod}
    measurementWindow={measurementWindow}
    onSelectionChange={onSelectionChange}
    config={{
      title: 'Response Time',
      legendText: specsOnly != null && !specsOnly ? 'All Cards' : 'Specs',
      yAxisUom: 'Days',
      plotLinesY: [
        {
            color: "blue",
            value: leadTimeTarget,
            dashStyle: "longdashdot",
            width: 1,
            label: {
              text: `${percentileToText(targetPercentile)} LTT=${leadTimeTarget}`,
              align: 'left',
              verticalAlign: 'middle',
            },
            zIndex: 5,
          },
        {
            color: "orange",
            value: cycleTimeTarget,
            dashStyle: "longdashdot",
            width: 1,
            label: {
              text: `${percentileToText(targetPercentile)} CTT=${cycleTimeTarget}`,
              align: 'left',
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
                  ['Total Closed: ', `${i18nNumber(intl, measurement.workItemsInScope)} ${specsOnly? 'Specs' : 'Cards'}`],
                  ['Earliest Closed: ', `${i18nDate(intl, measurement.earliestClosedDate)}`],
                  ['Latest Closed: ', `${i18nDate(intl, measurement.latestClosedDate)}`],
                ]
            }
          )
        }
      }
    }}
  />
  }


