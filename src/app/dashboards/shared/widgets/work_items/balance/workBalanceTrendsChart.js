import React from "react";
import { EVENT_TYPES, getTodayDate, i18nNumber, pick, toMoment } from "../../../../../helpers/utility";
import { getMeasurementTrendSeriesForMetrics } from "../../../views/measurementTrend/measurementTrendLineChart";
import { Chart, tooltipHtml } from "../../../../../framework/viz/charts";
import {
  DefaultSelectionEventHandler
} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import { Colors, ResponseTimeMetricsColor } from "../../../config";
import { WorkBalanceContributorDetailChart } from "./workBalanceContributorDetailChart";
import Contributors from "../../../../contributors/context";
import { fteEquivalent, getCapacityEfficiency } from "../../../helpers/statsUtils";

function getCapEfficiencyForEffortOutPoint(effortOutPoint, measurementWindow, capacityTrends) {
  // Bit of a hack to show the capEfficiency in the tooltip for effortOut.
  // We are grabbing the index of the effort out point and looking up the capacityTrends in the corresponding capacity
  // trends data since we dont have that in the context of highchart series.

  const effortOutPointIndex = effortOutPoint.measurement.index;
  if (0 <= effortOutPointIndex <= capacityTrends.length) {
    return getCapacityEfficiency(effortOutPoint.measurement.totalEffort, measurementWindow, capacityTrends[effortOutPointIndex].contributorCount);
  } else {
    return null;
  }
}

const WorkBalanceTrendsWithContributorDetailChart = Chart({
  chartUpdateProps: props => pick(props, "capacityTrends", "contributorDetail", "showContributorDetail", "showEffort", "cycleMetricsTrends", "measurementWindow", "measurementPeriod", "view", "chartConfig"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points,

  getConfig: ({
                capacityTrends,
                contributorDetail,
                cycleMetricsTrends,
                showContributorDetail,
                showEffort,
                measurementWindow,
                measurementPeriod,
                specsOnly,
                showCounts,
                showAnnotations,
                intl,
                chartConfig
              }) => {

    // One series per contributor
    let contributorDetailSeries = [];
    if (showContributorDetail) {
      const contributorDetailByContributor = contributorDetail.reduce(
        (result, measurement) => {
          const key = measurement.contributorKey;
          if (result[key] != null) {
            result[key].push(measurement);
          } else {
            result[key] = [measurement];
          }
          return result;
        },
        {}
      );
      contributorDetailSeries = Object.keys(contributorDetailByContributor).map(
        contributor => (
          {
            key: `${contributor}`,
            id: `${contributor}`,
            name: `${contributorDetailByContributor[contributor][0].contributorName}`,
            type: "column",
            stacking: "normal",
            maxPointWidth: 30,
            minPointLength: 1,
            data: contributorDetailByContributor[contributor].map(
              measurement => (
                {
                  x: toMoment(measurement["measurementDate"], true).valueOf(),
                  y: measurement.totalCommitDays,
                  measurement: measurement

                }
              )
            ),
            yAxis: 0
          }
        )
      );
    }

    const capacityTrendsSeries = getMeasurementTrendSeriesForMetrics([
        {
          key: "baseline",
          value: measurement => (fteEquivalent(measurementWindow) * measurement.contributorCount),
          displayName: "Capacity",
          visible: true,
          type: "spline",
          color: ResponseTimeMetricsColor.capacity
        },
        { key: "totalCommitDays", displayName: "Active Days", visible: true, type: "spline", color: "#68b10f" }
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
        [{
          key: "totalEffort", displayName: "Total Traceable Effort", visible: true, type: totalEffortChartType, color: ResponseTimeMetricsColor.effort,
        }],
        cycleMetricsTrends
      );
    }

    return {
      chart: {
        animation: false,
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: `${showContributorDetail ? "Active Days by Contributor " : "<span>Total Effort</span>"}`,
        useHTML: true
      },
      subtitle: {
        text: `${measurementPeriod} day trend`
      },
      xAxis: {
        type: "datetime",
        title: {
          text: `${measurementWindow} days ending`
        }
      },

      yAxis: [
        {
          id: "commit-days",
          type: "linear",
          title: {
            text: `FTE Days`
          }

        }

      ],
      plotOptions: {
        series: {
          animation: false
        }
      },
      annotations: [{
        visible: true,
        labels: [{
          point: { x: 0, y: 0 },
          text: `Effort Ratio: ${i18nNumber(intl, getCapacityEfficiency(cycleMetricsTrends[0]?.totalEffort, measurementWindow, capacityTrends[0]?.contributorCount), 1)} %`,
          backgroundColor: ResponseTimeMetricsColor.effort,
          borderColor: ResponseTimeMetricsColor.effort,
          align: "center",
          distance: 9
        },{
          point: "baseline:0",
          text: `${i18nNumber(intl, capacityTrends[0]?.contributorCount, 1)} Contributors`,
          backgroundColor: ResponseTimeMetricsColor.capacity,
          borderColor: ResponseTimeMetricsColor.capacity,
          align: "center",
          distance: 12
        }, {
          point: "totalEffort:0",
          text: `${i18nNumber(intl, cycleMetricsTrends[0]?.totalEffort, 1)} FTE Days`,
          backgroundColor: ResponseTimeMetricsColor.effort,
          borderColor: ResponseTimeMetricsColor.effort,
          align: "center",
          distance: 12
        }]
      }],
      tooltip: {
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function() {
          return tooltipHtml(this.point.measurement.contributorName != null ? {
              header: `Contributor: ${this.point.measurement.contributorName}<br/>${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Active Days:`, `${intl.formatNumber(this.point.y)} ( ${intl.formatNumber(this.point.percentage, { maximumFractionDigits: 1 })}% )`]


              ]
            } : this.point.series.name === "Active Days" ? {
              header: `Active Days: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Active Days: `, `${intl.formatNumber(this.point.y)}`],
                [`Contributors: `, `${intl.formatNumber(this.point.measurement.contributorCount)}`]

              ]
            } : this.point.series.name === "Total Traceable Effort" ? {
              header: `Total Traceable Effort: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Effort: `, `${intl.formatNumber(this.point.y)} FTE Days`],
                [`Effort Ratio: `, `${intl.formatNumber(getCapEfficiencyForEffortOutPoint(this.point, measurementWindow, capacityTrends))} %`]
              ]
            } : {
              header: `Capacity: ${measurementWindow} days ending ${intl.formatDate(this.point.x)}`,
              body: [
                [`Capacity: `, `${intl.formatNumber(this.point.y)} FTE Days`],
                [`Contributors: `, `${intl.formatNumber(this.point.measurement.contributorCount)}`]
              ]
            }
          );
        }
      },
      series: [...capacityTrendsSeries, ...cycleMetricsTrendsSeries, ...contributorDetailSeries]
    };
  }
});


export const WorkBalanceTrendsChart = ({
                                         context,
                                         capacityTrends,
                                         contributorDetail,
                                         cycleMetricsTrends,
                                         showContributorDetail,
                                         showEffort,
                                         measurementPeriod,
                                         measurementWindow,
                                         view,
                                         showAnnotations,
                                         chartConfig,
                                         onPointClick
                                       }) => {
  const [selectedPoint, setSelectedPoint] = React.useState(toMoment(getTodayDate("YYYY-MM-DD"), true).valueOf());
  const [contributorSeriesColors, setColors] = React.useState({});

  let selectedContributors = [];
  if (selectedPoint && contributorSeriesColors) {
    selectedContributors = contributorDetail
      .filter((x) => toMoment(x["measurementDate"], true).valueOf() === selectedPoint)
      .map((c) => ({ ...c, color: contributorSeriesColors[c.contributorKey] }));
  }

  function handleSelectionChange(items, eventType) {
    if (eventType === EVENT_TYPES.POINT_CLICK) {
      const [{ x, y, series }] = items;
      const allSeriesColors = series?.chart?.series
        .map((s) => ({ key: s.userOptions.key, color: s.color }))
        .reduce((acc, item) => {
          acc[item.key] = item.color;
          return acc;
        }, {});
      setColors(allSeriesColors);
      setSelectedPoint(x);
      onPointClick({ x, y });
    }
  }

  function onChildrenSelected(context, childContext, children) {
    if (children && children.length === 1) {
      const child = children[0];
      const [key, name] = [child.measurement.contributorKey, child.measurement.contributorName];
      context.navigate(childContext, name, key);
    }
  }

  function handleInitialChartColors(chart) {
    const allSeriesColors = chart?.series
      .map((s) => ({ key: s.userOptions.key, color: s.color }))
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
        chartConfig
      }}
      onSelectionChange={handleSelectionChange}
      getChart={handleInitialChartColors}
    />
  );

  if (showContributorDetail) {
    return (
      <div className="tw-grid tw-gap-4 tw-grid-rows-[37vh,34vh]">
        {workBalanceTrendsChart}
        <WorkBalanceContributorDetailChart
          selectedContributors={selectedContributors}
          measurementWindow={measurementWindow}
          selectedDate={selectedPoint}
          onSelectionChange={(children) => {
            onChildrenSelected(context, Contributors, children);
          }}
        />
      </div>
    );
  } else {
    return workBalanceTrendsChart;
  }
};

