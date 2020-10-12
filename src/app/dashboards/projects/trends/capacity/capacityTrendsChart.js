import React from 'react';
import {toMoment} from "../../../../helpers/utility";
import {getMeasurementTrendSeriesForMetrics} from "../../../shared/views/measurementTrend/measurementTrendLineChart";
import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors} from "../../../shared/config";


const CapacityTrendsWithContributorDetailChart = Chart({
  chartUpdateProps: props => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points,

  getConfig: ({capacityTrends, contributorDetail, cycleMetricsTrends, showContributorDetail,showEffort, measurementWindow, measurementPeriod, specsOnly, showCounts, intl}) => {

    // One series per contributor
    let contributorDetailSeries = []
    if (showContributorDetail) {
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
      contributorDetailSeries = Object.keys(contributorDetailByContributor).map(
        contributor => (
          {
            key: `${contributor}`,
            id: `${contributor}`,
            name: `${contributorDetailByContributor[contributor][0].contributorName}`,
            type: 'column',
            stacking: 'normal',
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
            yAxis: 0
          }
        )
      );
    }

    const capacityTrendsSeries = getMeasurementTrendSeriesForMetrics([
        {key: 'totalCommitDays', displayName: 'Total Commit Days', visible: true, type: 'spline', color: '#0f49b1'},
        {key: 'avgCommitDays', displayName: 'Avg Commit Days', visible: true, type: 'spline', },

      ],
      capacityTrends
    );

    let cycleMetricsTrendsSeries = [];
    if (showEffort) {
      cycleMetricsTrendsSeries = getMeasurementTrendSeriesForMetrics([
          {key: 'totalEffort', displayName: 'Total Effort', visible: true, type: 'areaspline', color: '#4c84ec'}
        ],
        cycleMetricsTrends
      );
    }

    return {
      chart: {
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy'
      },
      title: {
        text: `Capacity Trends ${showContributorDetail ? ' by Contributor ' : ''}`
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
            text: `Commit Days`
          },

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
            } : this.point.series.name === 'Total Commit Days' ? {
              header: `Capacity: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Total Commit Days`, `${intl.formatNumber(this.point.y)}`],
              ]
            } : this.point.series.name === 'Total Effort' ?  {
              header: `Total Effort: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [``, `${intl.formatNumber(this.point.y)} Dev-Days`],
              ]
            } : {
              header: `Capacity: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Avg Commit Days`, `${intl.formatNumber(this.point.y)}`],
              ]
            }
          )
        }
      },
      series: [...capacityTrendsSeries, ...cycleMetricsTrendsSeries, ...contributorDetailSeries,]
    }
  }
});


export const CapacityTrendsChart = (
  {
    capacityTrends,
    contributorDetail,
    cycleMetricsTrends,
    showContributorDetail,
    showEffort,
    measurementPeriod,
    measurementWindow,
    view
  }
) => (

  <CapacityTrendsWithContributorDetailChart {...{
    capacityTrends,
    contributorDetail,
    showContributorDetail,
    showEffort,
    cycleMetricsTrends,
    measurementWindow,
    measurementPeriod
  }} />


)

