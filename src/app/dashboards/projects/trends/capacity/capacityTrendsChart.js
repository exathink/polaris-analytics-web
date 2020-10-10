import React from 'react';
import {i18nDate, i18nNumber, toMoment} from "../../../../helpers/utility";
import {
  MeasurementTrendLineChart,
  getMeasurementTrendSeriesForMetrics
} from "../../../shared/views/measurementTrend/measurementTrendLineChart";
import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors} from "../../../shared/config";


const CapacityTrendsWithContributorDetailChart = Chart({
  chartUpdateProps: props => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points,

  getConfig: ({capacityTrends, contributorDetail, measurementWindow, measurementPeriod, specsOnly, showCounts, intl}) => {

    // One series per contributor
    const contributorDetailByContributor = contributorDetail.reduce(
      (result, measurement) => {
        const key = measurement.contributorKey;
        if (result[key] != null) {
          result[key].push(measurement)
        } else {
          result[key] = [measurement]
        }
        return result
      },
      {}
    )
    const contributorDetailSeries = Object.keys(contributorDetailByContributor).map(
      contributor => (
        {
          key: `${contributor}`,
          id: `${contributor}`,
          name: `${contributorDetailByContributor[contributor][0].contributorName}`,
          type: 'column',
          stacking: 'percent',
          maxPointWidth: 30,
          minPointLength: 1,
          data: contributorDetailByContributor[contributor].map(
            measurement => (
              {
                x: toMoment(measurement['measurementDate'], true).valueOf(),
                y: measurement.totalCommitDays,
                measurement: measurement,
              }
            )
          ),
          yAxis: 1
        }
      )
    );

    const capacityTrendsSeries = getMeasurementTrendSeriesForMetrics([
        {key: 'totalCommitDays', displayName: 'Total Commit Days', visible: true, type: 'spline'}
      ],
      capacityTrends
    );

    return {
      chart: {
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: `Capacity Trends by Contributor`
      },
      subtitle: {
        text: `${measurementPeriod} day trend`
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: `${measurementWindow} days ending`
        }
      },

      yAxis: [
        {
          id: 'commit-days',
          type: 'linear',
          title: {
            text: `Total Commit Days`
          },

        },
        {
          id: 'commit-days-percentage',
          type: 'linear',
          title: {
            text: `%Total Commit Days`
          },
          opposite: true
        },

      ],

      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          return tooltipHtml(this.point.series.type === 'column' ? {
            header: `Contributor: ${this.point.measurement.contributorName}<br/>${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
            body: [
              [`Commit Days:`, `${intl.formatNumber(this.point.y)} ( ${intl.formatNumber(this.point.percentage, {maximumFractionDigits: 1})}% )`],


            ]
          } : {
            header: `Capacity: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
            body: [
              [``, `${intl.formatNumber(this.point.y)} Commit Days`],
            ]
          })
        }
      },
      series: [...capacityTrendsSeries, ...contributorDetailSeries]
    }
  }
});


const CapacityTrendsLineChart = (
  {
    capacityTrends,
    measurementPeriod,
    measurementWindow,
    view
  }
) => {

  return (
    <MeasurementTrendLineChart
      measurements={capacityTrends}
      metrics={[
        {key: 'totalCommitDays', displayName: 'Total Commit Days', visible: true, type: 'spline'},
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
              body: [
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
}


export const CapacityTrendsChart = (
  {
    capacityTrends,
    contributorDetail,
    showContributorDetail,
    measurementPeriod,
    measurementWindow,
    view
  }
) => (
  showContributorDetail ?
    <CapacityTrendsWithContributorDetailChart {...{
      capacityTrends,
      contributorDetail,
      measurementWindow,
      measurementPeriod
    }} />
    :
    <CapacityTrendsLineChart {...{capacityTrends, measurementWindow, measurementPeriod, view}} />

)

