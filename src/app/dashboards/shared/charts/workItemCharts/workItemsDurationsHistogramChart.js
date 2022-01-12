import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors, ResponseTimeMetricsColor, WorkItemStateTypes} from "../../config";
import {getCategories, getHistogramSeries} from "../../../projects/shared/helper/utils";
import {getWorkItemDurations} from "../../widgets/work_items/clientSideFlowMetrics";

export const WorkItemsDurationsHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "workItems", "specsOnly", "stateType"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({workItems, intl, colWidthBoundaries, metricsMeta, stateType, specsOnly}) => {
    const workItemsWithAggregateDurations = getWorkItemDurations(workItems);
    const chartDisplayTitle = stateType === WorkItemStateTypes.closed ?  "Response Time" : "Age";

    // get series for lead time and cycle time
    const pointsLeadTime = workItemsWithAggregateDurations.map((w) => w["leadTime"]);
    const pointsCycleTime = workItemsWithAggregateDurations.map((w) => w["cycleTime"]);
    const seriesLeadTime = getHistogramSeries({intl, colWidthBoundaries, points: pointsLeadTime, selectedMetric: "leadTime", metricsMeta, color: ResponseTimeMetricsColor.leadTime})
    const seriesCycleTime = getHistogramSeries({intl, colWidthBoundaries, points: pointsCycleTime, selectedMetric: "cycleTime", metricsMeta, color: ResponseTimeMetricsColor.cycleTime, visible: false})
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: `Response Time Distribution`,
      },
      xAxis: {
        title: {
          text: `${chartDisplayTitle} in Days`,
        },
        categories: getCategories(colWidthBoundaries),
        crosshair: true,
      },

      yAxis: {
        softMin: 0,
        title: {
          text: specsOnly ? `Specs`: `Cards`,
        },
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          debugger;
          return tooltipHtml({
            header: `${this.series.name}: ${this.point.category}`,
            body: [
              [`Cards: `, `${this.point.y}`],
              [
                `Average ${this.series.name}: `,
                `${i18nNumber(intl, this.point.total / this.point.y, 2)} days`,
              ],
            ],
          });
        },
      },
      series: stateType === WorkItemStateTypes.closed ? [...seriesLeadTime, ...seriesCycleTime] : seriesLeadTime,
      plotOptions: {
        series: {
          animation: false,
          events: {
            legendItemClick: function () {
              // get all the series
              var series = this.chart.series;

              // don't allow visible series to be hidden
              if (this.visible) {
                return false;
              } else {
                // find visible series
                const visibleSeries = series.find((x) => x.visible);
                visibleSeries.hide();

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
