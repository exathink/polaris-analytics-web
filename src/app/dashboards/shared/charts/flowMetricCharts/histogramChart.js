import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors, ResponseTimeMetricsColor} from "../../config";
import {getTimePeriod, getHistogramSeries, getHistogramCategories} from "../../../projects/shared/helper/utils";

export const DeliveryCyclesHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "model", "selectedMetric", "specsOnly"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({intl, colWidthBoundaries, selectedMetric, model, metricsMeta, days, before, defectsOnly, specsOnly}) => {
    const points = model
      .filter((cycle) => cycle.workItemType !== "epic")
      .map((cycle) => metricsMeta[selectedMetric].value(cycle));

    const candidateCycles = model.filter((cycle) => cycle.workItemType !== "epic");

    const workItemsWithNullCycleTime = candidateCycles.filter((x) => !Boolean(x.cycleTime)).length;

    const seriesObj = getHistogramSeries({intl, colWidthBoundaries, selectedMetric, points, metricsMeta, color: ResponseTimeMetricsColor[selectedMetric]});
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: `${metricsMeta[selectedMetric].display} Distribution`,
      },
      subtitle: {
        text: (function () {
          const subTitle = defectsOnly
            ? `${candidateCycles.length} Defects closed: ${getTimePeriod(days, before)}`
            : ` ${candidateCycles.length} ${specsOnly ? "Specs" : "Cards"} closed: ${getTimePeriod(days, before)}`;
          // When showing cycle time we also report total with no cycle time if they exist.
          return selectedMetric === "cycleTime" && workItemsWithNullCycleTime > 0
            ? `${subTitle} (${workItemsWithNullCycleTime} with no cycle time)`
            : subTitle;
        })(),
      },
      xAxis: {
        title: {
          text: metricsMeta[selectedMetric].display,
        },
        categories: getHistogramCategories(colWidthBoundaries, selectedMetric, metricsMeta),
        crosshair: true,
      },

      yAxis: {
        softMin: 0,
        title: {
          text: `Specs Closed`,
        },
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          // This is the standard way we display tool tips.
          // A header string followed by a two column table with name, value pairs.
          // The strings can be HTML.
          return tooltipHtml({
            header: `${metricsMeta[selectedMetric].display}: ${this.point.category}<br/>${getTimePeriod(days, before)} `,
            body: [
              [`Specs Closed: `, `${this.point.y}`],
              [
                `Average ${metricsMeta[selectedMetric].display}: `,
                `${i18nNumber(intl, this.point.total / this.point.y, 2)} days`,
              ],
            ],
          });
        },
      },
      series: [seriesObj],
      plotOptions: {
        series: {
          animation: false,
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
