import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors} from "../../config";
import {getTimePeriod, allPairs, getCategories} from "../../../projects/shared/helper/utils";

function getSeries({intl, colWidthBoundaries, points, selectedMetric, metricsMeta}) {
  const allPairsData = allPairs(colWidthBoundaries);
  const data = new Array(allPairsData.length).fill({y:0, total: 0});
  points.forEach((y) => {
    for (let i = 0; i < allPairsData.length; i++) {
      const [x1, x2] = allPairsData[i];
      if (y >= x1 && y < x2) {
        data[i] = {y: data[i].y + 1, total: data[i].total + y};

        // we found the correct bucket, no need to traverse entire loop now
        break;
      }
    }
  });
  return [
    {
      name: metricsMeta[selectedMetric].display,
      data: data,
      dataLabels: {
        enabled: true,
        formatter: function () {
          const fractionVal = this.point.y / points.length;
          if (fractionVal === 0) {
            return "";
          } else {
            const percentVal = i18nNumber(intl, fractionVal*100, 2);
            return `${percentVal}%`;
          }
        },
      },
    },
  ];
}

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

    const series = getSeries({intl, colWidthBoundaries, selectedMetric, points, metricsMeta});
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
        categories: getCategories(colWidthBoundaries),
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
            header: `${metricsMeta[selectedMetric].display}: ${getTimePeriod(days, before)} <br/><br/> ${
              this.point.category
            }`,
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
      series: series,
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
