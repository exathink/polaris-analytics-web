import {Chart} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {tooltipHtml_v2} from "../../../../../framework/viz/charts/tooltip";

import {Colors, itemsDesc} from "../../../config";
import {COL_TYPES} from "./valueStreamPhaseDetailView";

function getSeries({data, intl, view}) {
  return [
    {
      name: "Tokyo",
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
export function groupColData(colData) {
  // implement, create categories of < 1day, 1-3 days etc
  const transformedColData = colData.map((item) => {});
  return colData;
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
      colDataMap = groupColData(colData);
    }
    const [categories, colValues] = [Object.keys(colDataMap), Object.values(colDataMap)];

    const series = getSeries({data: colValues, intl, view});
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
        align: "left",
      },
      subtitle: {
        text: subtitle || `Subtitle`,
        align: "left",
      },
      xAxis: {
        type: "linear",

        title: {
          text: "X",
        },
        categories: categories,
      },
      yAxis: {
        type: "linear",

        title: {
          text: "x",
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
