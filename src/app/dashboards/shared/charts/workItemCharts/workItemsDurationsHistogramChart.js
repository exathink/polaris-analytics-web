import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors, WorkItemStateTypes, WorkItemStateTypeDisplayName, ResponseTimeMetricsColor, AppTerms} from "../../config";
import {getHistogramCategories, getHistogramSeries} from "../../../projects/shared/helper/utils";
import {getWorkItemDurations} from "../../widgets/work_items/clientSideFlowMetrics";
import {projectDeliveryCycleFlowMetricsMeta} from "../../helpers/metricsMeta";

function isClosed(stateType) {
  return stateType === WorkItemStateTypes.closed;
}

function getChartTitle(stateType, seriesName=null) {
  if (stateType !== WorkItemStateTypes.closed) {
     return `${seriesName || 'Age'} Distribution`
  } else {
    return `${seriesName || 'Lead Time' } Variability`
  }
}

function getChartSubTitle(stateType, specsOnly) {
  return `${specsOnly ? AppTerms.specs.display : `All ${AppTerms.cards.display}`} in ${WorkItemStateTypeDisplayName[stateType]}`
}
export const WorkItemsDurationsHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "workItems", "specsOnly", "stateType"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({workItems, intl, colWidthBoundaries, stateType, specsOnly, onPointClick, clearFilters}) => {
    const workItemsWithAggregateDurations = getWorkItemDurations(workItems);
    const chartDisplayTitle = isClosed(stateType) ? "Lead Time" : "Age";

    const pointsLeadTimeOrAge = workItemsWithAggregateDurations.map((w) =>
      isClosed(stateType) ? w["leadTime"] : w["cycleTime"]
    );
    const pointsCycleTimeOrLatency = workItemsWithAggregateDurations.map((w) =>
      isClosed(stateType) ? w["cycleTime"] : w["latency"]
    );
    const pointsEffort = workItemsWithAggregateDurations.map((w) => w["effort"]);

    const seriesLeadTimeOrAge = getHistogramSeries({
      id: "leadTimeOrAge",
      intl,
      colWidthBoundaries,
      points: pointsLeadTimeOrAge,
      name: isClosed(stateType) ? projectDeliveryCycleFlowMetricsMeta["leadTime"].display : "Age",
      color: isClosed(stateType) ? ResponseTimeMetricsColor.leadTime : ResponseTimeMetricsColor.cycleTime,
      visible: (isClosed(stateType) && specsOnly === false) || !isClosed(stateType),
    });
    const seriesCycleTimeOrLatency = getHistogramSeries({
      id: "cycleTimeOrLatency",
      intl,
      colWidthBoundaries,
      points: pointsCycleTimeOrLatency,
      name: isClosed(stateType)
        ? projectDeliveryCycleFlowMetricsMeta["cycleTime"].display
        : projectDeliveryCycleFlowMetricsMeta["latency"].display,
      color: isClosed(stateType) ? ResponseTimeMetricsColor.cycleTime : ResponseTimeMetricsColor.latency,
      visible: isClosed(stateType) && specsOnly === true,
    });



    const seriesEffort = getHistogramSeries({
      id: "effort",
      intl,
      colWidthBoundaries,
      points: pointsEffort,
      name: projectDeliveryCycleFlowMetricsMeta["effort"].display,
      color: ResponseTimeMetricsColor.effort,
      visible: false
    });
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: getChartTitle(stateType),
      },
      subtitle: {
        text: getChartSubTitle(stateType, specsOnly),
      },
      xAxis: {
        title: {
          text: `${chartDisplayTitle}`,
        },
        categories: getHistogramCategories(colWidthBoundaries, "days"),
        crosshair: true,
      },

      yAxis: {
        softMin: 0,
        title: {
          text: specsOnly ? AppTerms.specs.display : AppTerms.cards.display,
        },
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const uom = this.series.name === "Effort" ? "FTE Days" : "days";
          return tooltipHtml({
            header: `${this.series.name}: ${this.point.category}`,
            body: [
              [specsOnly ? `${AppTerms.specs.display}: ` : `${AppTerms.cards.display}: `, `${this.point.y}`],
              [`Average ${this.series.name}: `, `${i18nNumber(intl, this.point.total / this.point.y, 2)} ${uom}`],
            ],
          });
        },
      },
      series: isClosed(stateType)
        ? [seriesLeadTimeOrAge, seriesCycleTimeOrLatency, seriesEffort]
        : [seriesLeadTimeOrAge, seriesCycleTimeOrLatency, seriesEffort],
      plotOptions: {
        series: {
          animation: false,
          allowPointSelect: true,
          cursor: "pointer",
          states: {
            select: {
              color: null,
              opacity: 0.5
            },
          },
          point: {
            events: {
              click: function () {
                const category = this.category;
                const selectedMetric = this.series.userOptions.id;
                onPointClick({category, selectedMetric});
              },
            },
          },
          events: {
            legendItemClick: function () {
              clearFilters();
              // get all the series
              var series = this.chart.series;
              // don't allow visible series to be hidden
              if (this.visible) {
                return false;
              } else {
                const currentSeries = this;

                // update xAxis title, as we click through different series
                currentSeries.xAxis.setTitle({text: currentSeries.name});
                // update the chart title
                this.chart.setTitle({text: getChartTitle(stateType, currentSeries.name)});
                // check if the current series is effort
                if (currentSeries.name === "Effort") {
                  currentSeries.xAxis.userOptions.originalCategories = currentSeries.xAxis.categories;
                  currentSeries.xAxis.categories = currentSeries.xAxis.categories.map((x) =>
                    x.replace("days", "FTE Days")
                  );
                } else {
                  // reset xAxis categories if it has been overridden earlier
                  if (currentSeries.xAxis.userOptions.originalCategories) {
                    currentSeries.xAxis.categories = currentSeries.xAxis.userOptions.originalCategories;
                  }
                }

                // find visible series
                const visibleSeries = series.find((x) => x.visible);
                visibleSeries?.hide();

                // only allow hidden series to be shown, before showing it hide the visible series
                return true;
              }
            },
          },
        },
      },
      legend: {
        title: {
          text: "",
          style: {
            fontStyle: "italic",
          },
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
        enabled: true,
      },
    };
  },
});