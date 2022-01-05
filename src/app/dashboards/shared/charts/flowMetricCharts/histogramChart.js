import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors} from "../../config";
import {pairwise} from "../../../projects/shared/helper/utils";

function getCategories(colWidthBoundaries) {
  const res = pairwise(colWidthBoundaries);
  const [min, max] = [res[0][0], res[res.length - 1][1]];
  const middle = res.map((x) => `${x[0]} - ${x[1]} days`);
  const start = `< ${min} days`;
  const end = `${max} + days`;
  return [start, ...middle, end];
}

function getSeries({colWidthBoundaries, points, selectedMetric}) {
  const res = pairwise(colWidthBoundaries);
  const [min, max] = [res[0][0], res[res.length - 1][1]];
  const data = [[0, min], ...res, [max, Infinity]].map((x) => {
    const [x1, x2] = x;
    return points.filter((y) => y >= x1 && y < x2).length;
  });
  return [
    {
      name: selectedMetric,
      data: data,
    },
  ];
}

export const DeliveryCyclesHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "model", "selectedMetric", "specsOnly"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({colWidthBoundaries, selectedMetric, model, metricsMeta, days, defectsOnly, specsOnly}) => {
    const points = model
      .filter((cycle) => cycle.workItemType !== "epic")
      .map((cycle) => metricsMeta[selectedMetric].value(cycle));

    const candidateCycles = model.filter((cycle) => cycle.workItemType !== "epic");

    const workItemsWithNullCycleTime = candidateCycles.filter((x) => !Boolean(x.cycleTime)).length;

    const series = getSeries({colWidthBoundaries, selectedMetric, points});
    return {
      chart: {
        type: "column",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: metricsMeta[selectedMetric].display,
      },
      subtitle: {
        text: (function () {
          const subTitle = defectsOnly
            ? `${candidateCycles.length} Defects closed in the last ${days} days`
            : ` ${candidateCycles.length} ${specsOnly ? "Specs" : "Cards"} closed in the last ${days} days`;
          // When showing cycle time we also report total with no cycle time if they exist.
          return selectedMetric === "cycleTime" && workItemsWithNullCycleTime > 0
            ? `${subTitle} (${workItemsWithNullCycleTime} with no cycle time)`
            : subTitle;
        })(),
      },
      xAxis: {
        title: {
          text: selectedMetric,
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
            header: `${this.point.series.name}: ${this.point.category}`,
            body: [[`Specs Closed: `, `${this.point.y}`]],
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
