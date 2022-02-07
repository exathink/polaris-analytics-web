import React from 'react';
import {EVENT_TYPES, getTodayDate, pick, toMoment} from "../../../../../helpers/utility";
import {getMeasurementTrendSeriesForMetrics} from "../../../views/measurementTrend/measurementTrendLineChart";
import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors} from "../../../config";
import {WorkBalanceContributorDetailChart} from "./workBalanceContributorDetailChart";
import styles from "./workBalance.module.css";

function fteEquivalent(measurementWindow) {
  switch (measurementWindow) {
    case 7: return 5;

    case 30: return 20;

    default: return null;

  }
}



const WorkBalanceTrendsWithContributorDetailChart = Chart({
  chartUpdateProps: props => pick(props, "capacityTrends", "contributorDetail", "showContributorDetail", "showEffort", "cycleMetricsTrends", "measurementWindow", "measurementPeriod", "view", "chartConfig"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points,

  getConfig: ({capacityTrends, contributorDetail, cycleMetricsTrends, showContributorDetail,showEffort, measurementWindow, measurementPeriod, specsOnly, showCounts, intl, chartConfig}) => {

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
        {key: 'baseline', value : measurement => (fteEquivalent(measurementWindow) * measurement.contributorCount), displayName: 'Capacity', visible: false, type: 'spline', color: '#8d9196'},
        {key: 'totalCommitDays', displayName: 'Active Days', visible: true, type: 'spline', color: '#0f49b1'}
      ],
      capacityTrends
    );

    let cycleMetricsTrendsSeries = [];
    if (showEffort) {
      let totalEffortChartType = "spline"; // spline is default
      if (chartConfig && chartConfig.totalEffortDisplayType) {
        totalEffortChartType = chartConfig.totalEffortDisplayType;
      }
      cycleMetricsTrendsSeries = getMeasurementTrendSeriesForMetrics(
        [{key: "totalEffort", displayName: "EffortOUT", visible: true, type: totalEffortChartType, color: "#4c84ec"}],
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
        text: `${showContributorDetail ? 'Active Days by Contributor ' : '<span>Effort<sub><em>out</em></sub></span>'}`,
        useHTML: true
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
            text: `Dev-Days`
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
                [`Active Days:`, `${intl.formatNumber(this.point.y)} ( ${intl.formatNumber(this.point.percentage, {maximumFractionDigits: 1})}% )`],


              ]
            } : this.point.series.name === 'Active Days' ? {
              header: `Active Days: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Active Days: `, `${intl.formatNumber(this.point.y)}`],
                [`Contributors: `, `${intl.formatNumber(this.point.measurement.contributorCount)}`],

              ]
            } : this.point.series.name === 'EffortOUT' ?  {
              header: `EffortOUT: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [``, `${intl.formatNumber(this.point.y)} Dev-Days`],
              ]
            }  : {
              header: `Capacity: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Capacity: `, `${intl.formatNumber(this.point.y)} Dev-Days`],
                [`Contributors: `, `${intl.formatNumber(this.point.measurement.contributorCount)}`],
              ]
            }
          )
        }
      },
      series: [...capacityTrendsSeries, ...cycleMetricsTrendsSeries, ...contributorDetailSeries,]
    }
  }
});


export const WorkBalanceTrendsChart = ({
  capacityTrends,
  contributorDetail,
  cycleMetricsTrends,
  showContributorDetail,
  showEffort,
  measurementPeriod,
  measurementWindow,
  view,
  chartConfig,
}) => {
  const [selectedPoint, setSelectedPoint] = React.useState(toMoment(getTodayDate("YYYY-MM-DD"), true).valueOf());
  const [contributorSeriesColors, setColors] = React.useState({});

  let selectedContributors = [];
  if (selectedPoint && contributorSeriesColors) {
    selectedContributors = contributorDetail
      .filter((x) => toMoment(x["measurementDate"], true).valueOf() === selectedPoint)
      .map((c) => ({...c, color: contributorSeriesColors[c.contributorKey]}));
  }

  function handleSelectionChange(items, eventType) {
    if (eventType === EVENT_TYPES.POINT_CLICK) {
      const [{x, series}] = items;
      const allSeriesColors = series?.chart?.series
        .map((s) => ({key: s.userOptions.key, color: s.color}))
        .reduce((acc, item) => {
          acc[item.key] = item.color;
          return acc;
        }, {});
      setColors(allSeriesColors);
      setSelectedPoint(x);
    }
  }

  function handleInitialChartColors(chart) {
    const allSeriesColors = chart?.series
      .map((s) => ({key: s.userOptions.key, color: s.color}))
      .reduce((acc, item) => {
        acc[item.key] = item.color;
        return acc;
      }, {});
    setColors(allSeriesColors);
  }

  const workBalanceTrendsChart = (
    <WorkBalanceTrendsWithContributorDetailChart
      {...{
        capacityTrends,
        contributorDetail,
        showContributorDetail,
        showEffort,
        cycleMetricsTrends,
        measurementWindow,
        measurementPeriod,
        view,
        chartConfig,
      }}
      onSelectionChange={handleSelectionChange}
      getChart={handleInitialChartColors}
    />
  );

  if (showContributorDetail) {
    return (
      <div className={styles.workBalance}>
        {workBalanceTrendsChart}
        <WorkBalanceContributorDetailChart
          selectedContributors={selectedContributors}
          measurementWindow={measurementWindow}
          selectedDate={selectedPoint}
        />
      </div>
    );
  } else {
    return workBalanceTrendsChart;
  }
};

