import {Chart} from "../../../../framework/viz/charts";
import { i18nNumber, pick } from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {AppTerms, Colors, WorkItemStateTypeDisplayName, WorkItemStateTypes} from "../../config";
import {
  getDefaultMetricKey,
  getSelectedMetricDisplayName,
  projectDeliveryCycleFlowMetricsMeta,
} from "../../helpers/metricsMeta";
import {getHistogramCategories, isClosed} from "../../../projects/shared/helper/utils";
import {tooltipHtml_v2} from "../../../../framework/viz/charts/tooltip";

function getChartTitle(metric, stateType) {
  const metricDisplayName = getSelectedMetricDisplayName(metric, stateType);
  if (stateType === WorkItemStateTypes.closed) {
    return `${metricDisplayName} Variability`;
  } else {
    return `${metricDisplayName} Distribution`;
  }
}

function getNewSubtitle(count, specsOnly, stateType) {
  const item = specsOnly ? AppTerms.spec.display : AppTerms.card.display;
  return`${count} ${item}${count > 1 ? "s" : ""} in ${WorkItemStateTypeDisplayName[stateType]}`;
}

function getWorkItemTitle(stateType, specsOnly) {
  if (isClosed(stateType)) {
    if (specsOnly) {
      return `${AppTerms.specs.display} Closed`;
    } else {
      return `${AppTerms.cards.display} Closed`;
    }
  } else {
    if (specsOnly) {
      return `${AppTerms.specs.display}`;
    } else {
      return `All ${AppTerms.cards.display}`;
    }
  }
}

export const WorkItemsDetailHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "series", "selectedMetric", "specsOnly", "stateType"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({
    specsOnly,
    intl,
    series,
    colWidthBoundaries,
    stateType,
    selectedMetric = getDefaultMetricKey(stateType),
    onPointClick,
    clearFilters,
    chartConfig
  }) => {
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        animation: false,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: chartConfig?.title || getChartTitle(selectedMetric, stateType),
      },
      subtitle: {
        text: chartConfig?.subtitle,
      },
      xAxis: {
        title: {
          text: chartConfig?.xAxisTitle || getSelectedMetricDisplayName(selectedMetric, stateType),
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
          const uom = this.series.userOptions.id === "effort" ? "FTE Days" : "days";

          return chartConfig?.tooltip?.(this, getWorkItemTitle(stateType, specsOnly), intl) || tooltipHtml_v2({
            header: `${this.series.name}: ${this.point.category}`,
            body: [
              [getWorkItemTitle(stateType, specsOnly), this.point.y],
              [`Average ${this.series.name}: `, `${i18nNumber(intl, this.point.options.total / this.point.y, 2)} ${uom}`],
            ],
          });
        },
      },
      series: series,
      plotOptions: {
        series: {
          stacking: 'normal',
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
                // update subtitle
                this.series.chart.setSubtitle({text: getNewSubtitle(this.y, specsOnly, stateType)});

                onPointClick({category, selectedMetric});
              },
            },
          },
          events: {
            legendItemClick: chartConfig?.legendItemClick || function () {
              clearFilters();
              // reset subtitle on series change
              this.chart.setSubtitle({text: this.chart.userOptions.subtitle.text});

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
