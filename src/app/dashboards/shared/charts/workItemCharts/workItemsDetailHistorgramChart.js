import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors, WorkItemStateTypes} from "../../config";
import {
  getDefaultMetricKey,
  getSelectedMetricDisplayName,
  projectDeliveryCycleFlowMetricsMeta,
} from "../../helpers/metricsMeta";
import {getHistogramCategories, isClosed} from "../../../projects/shared/helper/utils";

function getChartTitle(metric, stateType) {
  const metricDisplayName = getSelectedMetricDisplayName(metric, stateType);
  if (stateType === WorkItemStateTypes.closed) {
    return `${metricDisplayName} Variability`;
  } else {
    return `${metricDisplayName} Distribution`;
  }
}

function getWorkItemTitle(stateType, specsOnly) {
  if (isClosed(stateType)) {
    if (specsOnly) {
      return `Specs Closed`;
    } else {
      return `Cards Closed`;
    }
  } else {
    if (specsOnly) {
      return `Specs`;
    } else {
      return `All Cards`;
    }
  }
}

export const WorkItemsDetailHistogramChart = Chart({
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
    onPointClick,
    clearFilters,
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
          text: getSelectedMetricDisplayName(selectedMetric, stateType),
        },
        categories: getHistogramCategories(colWidthBoundaries, projectDeliveryCycleFlowMetricsMeta[selectedMetric].uom),
        crosshair: true,
      },

      yAxis: {
        softMin: 0,
        title: {
          text: getWorkItemTitle(stateType, specsOnly),
        },
      },
      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const uom = this.series.userOptions.id === "effort" ? "dev-days" : "days";
          return tooltipHtml({
            header: `${this.series.name}: ${this.point.category}`,
            body: [
              [getWorkItemTitle(stateType, specsOnly), this.point.y],
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
              borderColor: "Black",
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
                this.chart.setTitle({text: getChartTitle(currentSeries.userOptions.id, stateType)});
                // check if the current series is effort
                if (currentSeries.name === "Effort") {
                  currentSeries.xAxis.userOptions.originalCategories = currentSeries.xAxis.categories;
                  currentSeries.xAxis.categories = currentSeries.xAxis.categories.map((x) =>
                    x.replace("days", "dev-days")
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
