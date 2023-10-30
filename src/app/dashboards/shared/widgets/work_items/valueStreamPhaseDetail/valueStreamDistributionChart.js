import { COL_TYPES } from "../../../../../components/tables/tableCols";
import {Chart} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {tooltipHtml_v2} from "../../../../../framework/viz/charts/tooltip";
import {Colors, WorkItemStateTypeColor, itemsAllDesc} from "../../../config";

function getSeries({data, colId}) {
  return {
    name: colId,
    data: data,
  };
}

export function getSeriesPoints({arr, colId, stateType}) {
  return arr.reduce((acc, item) => {
    if (acc[item] != null) {
      acc[item].y = acc[item].y + 1;
    } else {
      acc[item] = {y: 1, color: COL_TYPES[colId]?.color?.(item) ?? WorkItemStateTypeColor[stateType]};
    }
    return acc;
  }, {});
}

export const ValueStreamDistributionChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),

  getConfig: ({title, subtitle, intl, view, specsOnly, colData, colId, headerName, stateType}) => {
    const colDataMap = getSeriesPoints({arr: colData, colId, stateType});
    const categories = Object.keys(colDataMap).map((x) => COL_TYPES[colId].transform?.(x) ?? x);

    const colValues = Object.values(colDataMap);
    const seriesObj = getSeries({data: colValues, colId});

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
