import {Chart} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {tooltipHtml_v2} from "../../../../../framework/viz/charts/tooltip";

import {Colors, itemsDesc} from "../../../config";
import { getCorrectPair } from "../wip/cycleTimeLatency/cycleTimeLatencyUtils";
import {COL_TYPES} from "./valueStreamPhaseDetailView";

function getSeries({data, colId}) {
  return [
    {
      name: colId,
      data: data,
    },
  ];
}

export function mapArrToObj(arr) {
  return arr.reduce((acc, item) => {
    if (acc[item] != null) {
      acc[item] = acc[item] + 1;
    } else {
      acc[item] = 1;
    }
    return acc;
  }, {});
}
export function groupColData({colData, colId}) {
  // implement, create categories of < 1day, 1-3 days etc
  const transformedColData = colData
    .sort((a, b) => a - b)
    .map((item) => {
      const pair = getCorrectPair({value: item, metric: colId});
      return pair;
    });
  const colDataMap = mapArrToObj(transformedColData);

  return colDataMap;
}

export const ValueStreamDistributionChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),

  getConfig: ({title, subtitle, intl, view, specsOnly, colData, colId}) => {
    let colDataMap;
    if (COL_TYPES[colId] === "category") {
      colDataMap = mapArrToObj(colData);
    } else {
      colDataMap = groupColData({colData, colId});
    }
    const [categories, colValues] = [Object.keys(colDataMap), Object.values(colDataMap)];

    const series = getSeries({data: colValues, colId, intl, view});
    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
        type: "column",
      },
      title: {
        text: title || "Title",
        align: "center",
      },
      subtitle: {
        text: subtitle || `Subtitle`,
        align: "center",
      },
      xAxis: {
        type: "linear",

        title: {
          // text: "X",
        },
        categories: categories,
      },
      yAxis: {
        type: "linear",

        title: {
          text: itemsDesc(specsOnly),
        },
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          debugger;
          return tooltipHtml_v2({
            header: this.x,
            body: [[itemsDesc(specsOnly), this.y]],
          });
        },
      },
      series: [...series],
      plotOptions: {
        series: {
          animation: false,
        },
      },
      legend: {
        title: {
          text: "Legend",
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
