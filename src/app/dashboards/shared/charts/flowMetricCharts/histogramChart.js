import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {AppTerms, Colors, ResponseTimeMetricsColor, WorkItemStateTypes} from "../../config";
import {getTimePeriod, getHistogramSeries, getHistogramCategories} from "../../../projects/shared/helper/utils";
import { getSelectedMetricDisplayName } from "../../helpers/metricsMeta";

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

    const seriesObj = getHistogramSeries({id: selectedMetric,intl, colWidthBoundaries, name: getSelectedMetricDisplayName(selectedMetric, WorkItemStateTypes.closed), points, color: ResponseTimeMetricsColor[selectedMetric]});
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: `${getSelectedMetricDisplayName(selectedMetric, WorkItemStateTypes.closed)} Distribution`,
      },
      subtitle: {
        text: (function () {
          const subTitle = defectsOnly
            ? `${candidateCycles.length} Defects closed: ${getTimePeriod(days, before)}`
            : ` ${candidateCycles.length} ${specsOnly ? AppTerms.specs.display : AppTerms.cards.display} closed: ${getTimePeriod(days, before)}`;
          // When showing cycle time we also report total with no cycle time if they exist.
          return selectedMetric === "cycleTime" && workItemsWithNullCycleTime > 0
            ? `${subTitle} (${workItemsWithNullCycleTime} with no cycle time)`
            : subTitle;
        })(),
      },
      xAxis: {
        title: {
          text: getSelectedMetricDisplayName(selectedMetric, WorkItemStateTypes.closed),
        },
        categories: getHistogramCategories(colWidthBoundaries, metricsMeta[selectedMetric].uom),
        crosshair: true,
      },

      yAxis: {
        softMin: 0,
        title: {
          text: `${AppTerms.specs.display} Closed`,
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
              [`${AppTerms.specs.display} Closed: `, `${this.point.y}`],
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
