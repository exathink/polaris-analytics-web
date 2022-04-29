import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors} from "../../config";
import {
  getDefaultMetricKey,
  getSelectedMetricDisplayName,
  projectDeliveryCycleFlowMetricsMeta,
} from "../../helpers/metricsMeta";
import {getHistogramCategories} from "../../../projects/shared/helper/utils";

function getChartTitle(metric, stateType) {
  const metricDisplayName = getSelectedMetricDisplayName(metric, stateType);
  return `${metricDisplayName} Variability`;
}

function getTitle() {
  return "Pull Requests Closed"
}

export const PullRequestsDetailHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "series", "selectedMetric", "specsOnly", "stateType"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({
    chartSubTitle,
    specsOnly,
    intl,
    series,
    colWidthBoundaries,
    stateType,
    selectedMetric = getDefaultMetricKey(stateType),
  }) => {
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: getChartTitle(selectedMetric, stateType),
      },
      subtitle: {
        text: chartSubTitle,
      },
      xAxis: {
        title: {
          text: "",
        },
        categories: getHistogramCategories(colWidthBoundaries, projectDeliveryCycleFlowMetricsMeta[selectedMetric].uom),
        crosshair: true,
      },

      yAxis: {
        softMin: 0,
        title: {
          text: getTitle(stateType, specsOnly),
        },
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const uom = "days";
          return tooltipHtml({
            header: `${this.series.name}: ${this.point.category}`,
            body: [
              [getTitle(stateType, specsOnly), this.point.y],
              [`Average ${this.series.name}: `, `${i18nNumber(intl, this.point.total / this.point.y, 2)} ${uom}`],
            ],
          });
        },
      },
      series: series,
      plotOptions: {
        series: {
          animation: false,
          allowPointSelect: true,
          cursor: "pointer",
          states: {
            select: {
              color: null,
              borderWidth: 2,
              borderColor: Colors.HistogramSelection,
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
