import { COL_TYPES } from "../../../../../components/tables/tableCols";
import {Chart} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {tooltipHtml_v2} from "../../../../../framework/viz/charts/tooltip";
import {Colors, itemsAllDesc} from "../../../config";

function getSeries({data, colId}) {
  return {
    name: colId,
    data: data.map((i) => ({y: i})),
  };
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

export const ValueStreamDistributionChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),

  getConfig: ({title, subtitle, intl, view, specsOnly, colData, colId, headerName, histogramSeries}) => {
    const colDataMap = mapArrToObj(colData);
    const categories = Object.keys(colDataMap).map((x) => COL_TYPES[colId].transform?.(x) ?? x);

    const colValues = Object.values(colDataMap);
    const seriesObj = getSeries({data: colValues, colId, intl, view});

    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        animation: false,
        panKey: "shift",
        zoomType: "xy",
        type: "column",
      },
      title: {
        text: title,
        align: "center",
      },
      subtitle: {
        text: subtitle,
        align: "center",
      },
      xAxis: {
        labels: {
          useHTML: true,
        },
        categories: categories,
      },
      yAxis: {
        softMin: 0,

        title: {
          text: itemsAllDesc(specsOnly),
        },
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml_v2({
            header: `${headerName}: ${this.x}`,
            body: [[itemsAllDesc(specsOnly), this.y]],
          });
        },
      },
      series: [seriesObj],
      plotOptions: {
        series: {
          animation: false,
          stacking: "normal",
          allowPointSelect: true,
          cursor: "pointer",
          states: {
            select: {
              color: null,
              opacity: 0.5,
            },
          },
        },
      },
      legend: {
        enabled: false,
      },
    };
  },
});
