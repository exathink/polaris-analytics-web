import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors, WorkItemStateTypes, WorkItemStateTypeDisplayName, ResponseTimeMetricsColor} from "../../config";
import {getHistogramCategories, getHistogramSeries} from "../../../projects/shared/helper/utils";
import {getWorkItemDurations} from "../../widgets/work_items/clientSideFlowMetrics";

function getChartTitle(stateType, seriesName=null) {
  if (stateType !== WorkItemStateTypes.closed) {
     return `${seriesName || 'Age'} Distribution`
  } else {
    return `${seriesName || 'Lead Time' } Variability`
  }
}

function getChartSubTitle(stateType, specsOnly) {
  return `${specsOnly ? 'Specs' : 'All cards'} in ${WorkItemStateTypeDisplayName[stateType]}`
}
export const WorkItemsDurationsHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "workItems", "specsOnly", "stateType"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({workItems, intl, colWidthBoundaries, metricsMeta, stateType, specsOnly, onPointClick}) => {
    const workItemsWithAggregateDurations = getWorkItemDurations(workItems);
    const chartDisplayTitle = stateType === WorkItemStateTypes.closed ? "Lead Time" : "Age";

    const pointsLeadTimeOrAge = workItemsWithAggregateDurations.map((w) =>
      stateType === WorkItemStateTypes.closed ? w["leadTime"] : w["cycleTime"]
    );
    const pointsCycleTimeOrLatency = workItemsWithAggregateDurations.map((w) =>
      stateType === WorkItemStateTypes.closed ? w["cycleTime"] : w["latency"]
    );
    const pointsEffort = workItemsWithAggregateDurations.map((w) => w["effort"]);

    const seriesLeadTimeOrAge = getHistogramSeries({
      id: "leadTimeOrAge",
      intl,
      colWidthBoundaries,
      points: pointsLeadTimeOrAge,
      name: stateType === WorkItemStateTypes.closed ? "Lead Time" : "Age",
      color: stateType === WorkItemStateTypes.closed ? ResponseTimeMetricsColor.leadTime : ResponseTimeMetricsColor.cycleTime,
    });
    const seriesCycleTimeOrLatency = getHistogramSeries({
      id: "cycleTimeOrLatency",
      intl,
      colWidthBoundaries,
      points: pointsCycleTimeOrLatency,
      name: stateType === WorkItemStateTypes.closed ? "Cycle Time" : "Latency",
      color: stateType === WorkItemStateTypes.closed ? ResponseTimeMetricsColor.cycleTime: ResponseTimeMetricsColor.latency,
      visible: false
    });
    const seriesEffort = getHistogramSeries({
      id: "effort",
      intl,
      colWidthBoundaries,
      points: pointsEffort,
      name: "Effort",
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
        text: getChartSubTitle(stateType, specsOnly)
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
          text: specsOnly ? `Specs` : `Cards`,
        },
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const uom = this.series.name === "Effort" ? "dev-days" : "days";
          return tooltipHtml({
            header: `${this.series.name}: ${this.point.category}`,
            body: [
              [`Cards: `, `${this.point.y}`],
              [`Average ${this.series.name}: `, `${i18nNumber(intl, this.point.total / this.point.y, 2)} ${uom}`],
            ],
          });
        },
      },
      series: [seriesLeadTimeOrAge, seriesCycleTimeOrLatency, seriesEffort],
      plotOptions: {
        series: {
          animation: false,
          cursor: 'pointer',
          point: {
            events: {
              click: function () {
                const category = this.category;
                const selectedMetric = this.series.userOptions.id;
                onPointClick({category, selectedMetric})
              },
            },
          },
          events: {
            legendItemClick: function () {
              // get all the series
              var series = this.chart.series;

              // don't allow visible series to be hidden
              if (this.visible) {
                return false;
              } else {
                const currentSeries = this;
                
                // update xAxis title, as we click through different series
                currentSeries.xAxis.setTitle({ text: currentSeries.name });
                // update the chart title
                this.chart.setTitle({text: getChartTitle(stateType, currentSeries.name)})
                // check if the current series is effort
                if(currentSeries.name === "Effort"){
                  currentSeries.xAxis.userOptions.originalCategories = currentSeries.xAxis.categories;
                  currentSeries.xAxis.categories = currentSeries.xAxis.categories.map(x => x.replace("days", "dev-days"));
                } else {
                  // reset xAxis categories if it has been overridden earlier
                  if(currentSeries.xAxis.userOptions.originalCategories){
                    currentSeries.xAxis.categories = currentSeries.xAxis.userOptions.originalCategories
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
