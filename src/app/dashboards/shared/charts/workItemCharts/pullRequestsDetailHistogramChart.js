import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {humanizeDuration, i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors} from "../../config";
import {
  projectDeliveryCycleFlowMetricsMeta,
} from "../../helpers/metricsMeta";
import {getHistogramCategories} from "../../../projects/shared/helper/utils";

function getTitle() {
  return "Number of Pull Requests"
}

export const PullRequestsDetailHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "series", "selectedMetric"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({
    title,
    chartSubTitle,
    intl,
    series,
    colWidthBoundaries,
    selectedMetric,
    onPointClick
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
        text: title || `Review Time Variability`,
      },
      subtitle: {
        text: chartSubTitle,
      },
      xAxis: {
        title: {
          text: "Age",
        },
        categories: getHistogramCategories(colWidthBoundaries, projectDeliveryCycleFlowMetricsMeta[selectedMetric].uom),
        crosshair: true,
      },

      yAxis: {
        softMin: 0,
        title: {
          text: getTitle(),
        },
        allowDecimals: false,
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml({
            header: `${this.series.name}: ${this.point.category}`,
            body: [
              [getTitle(), this.point.y],
              [`Average ${this.series.name}: `, `${humanizeDuration(i18nNumber(intl, this.point.total / this.point.y, 2))}`],
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
        enabled: false,
      },
    };
  },
});
