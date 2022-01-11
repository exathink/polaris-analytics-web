import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {i18nNumber, pick} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors} from "../../config";
import {allPairs, getCategories} from "../../../projects/shared/helper/utils";
import { getWorkItemDurations } from "../../widgets/work_items/clientSideFlowMetrics";

function getSeries({intl, colWidthBoundaries, workItemsWithAggregateDurations, selectedMetric, metricsMeta}) {
  const allPairsData = allPairs(colWidthBoundaries);
  const data = new Array(allPairsData.length).fill({y: 0, total: 0});
  workItemsWithAggregateDurations.map(w => w[selectedMetric]).forEach((y) => {
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
          const fractionVal = this.point.y / workItemsWithAggregateDurations.length;
          if (fractionVal === 0) {
            return "";
          } else {
            const percentVal = i18nNumber(intl, fractionVal * 100, 2);
            return `${percentVal}%`;
          }
        },
      },
    },
  ];
}

export const WorkItemsDurationsHistogramChart = Chart({
  chartUpdateProps: (props) => pick(props, "model", "selectedMetric", "specsOnly"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),
  getConfig: ({workItems, intl, colWidthBoundaries, selectedMetric, metricsMeta}) => {
    const workItemsWithAggregateDurations = getWorkItemDurations(workItems);


    const series = getSeries({intl, colWidthBoundaries, selectedMetric, workItemsWithAggregateDurations, metricsMeta});
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
          
          return "Subtitle Test"
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
          return tooltipHtml({
            header: `${metricsMeta[selectedMetric].display}} `,
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
