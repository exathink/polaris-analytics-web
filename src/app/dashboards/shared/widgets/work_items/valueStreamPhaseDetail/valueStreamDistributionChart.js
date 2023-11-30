import { COL_TYPES } from "../../../../../components/tables/tableCols";
import {Chart} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {tooltipHtml_v2} from "../../../../../framework/viz/charts/tooltip";
import {Colors, WorkItemStateTypeColor, itemsDesc} from "../../../config";
import {i18nNumber, pick} from "../../../../../helpers/utility";
import { getSelectedMetricKey } from "../../../helpers/metricsMeta";

const isTagsColumn = col => ["custom_type", "component", "custom_tags"].includes(col);
const isTeamsColumn = col => col === "teams";
function getNewSubtitle(count, specsOnly) {
  return `${count} ${itemsDesc(specsOnly)}`;
}

function getSeries({data, name}) {
  return {
    name: name,
    data: data,
  };
}

export function getSeriesPoints({arr, colId, stateType}) {
  const metricKey = getSelectedMetricKey(colId, stateType);
  const newArr = arr
    .map((x) => {
      if (isTagsColumn(metricKey)) {
        return {...x, [metricKey]: COL_TYPES[metricKey].valueGetter(x["tags"])};
      }
      if (isTeamsColumn(metricKey)) {
        return {...x, [metricKey]: COL_TYPES[metricKey].valueGetter(x["teamNodeRefs"])};
      }
      return x;
    })
    .sort((a, b) => {
      if (COL_TYPES[metricKey]?.sorter) {
        return COL_TYPES[metricKey]?.sorter(a[metricKey], b[metricKey]);
      }

      return (a[metricKey] == null || (Array.isArray(a[metricKey]) && a[metricKey].length === 0) ? -1 : 1)
    });
  return newArr.reduce((acc, item) => {
    let colIdValue = item[metricKey] ?? "Unassigned";
    if (Array.isArray(colIdValue) && colIdValue.length === 0) {
      colIdValue = "Unassigned";
    }

    if (Array.isArray(colIdValue) && colIdValue.length > 0) {
      colIdValue.forEach(x => {
        if (acc[x] != null) {
          acc[x] = {...acc[x], y: acc[x].y + 1, bucket: [...acc[x].bucket, item]};
        } else {
          acc[x] = {id: x, y: 1, color: COL_TYPES[metricKey]?.color?.(x) ?? WorkItemStateTypeColor[stateType], bucket: [item]};
        }    
      })
    } else {
      if (acc[colIdValue] != null) {
        acc[colIdValue] = {...acc[colIdValue], y: acc[colIdValue].y + 1, bucket: [...acc[colIdValue].bucket, item]};
      } else {
        acc[colIdValue] = {id: colIdValue, y: 1, color: COL_TYPES[metricKey]?.color?.(colIdValue) ?? WorkItemStateTypeColor[stateType], bucket: [item]};
      }
    }

    return acc;
  }, {});
}

export const ValueStreamDistributionChart = Chart({
  chartUpdateProps: (props) => pick(props, "title", "colData", "colId", "headerName", "stateType"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),

  getConfig: ({title, subtitle, intl, view, specsOnly, colData, colId, headerName, stateType, onPointClick}) => {
    const colDataMap = getSeriesPoints({arr: colData, colId, stateType});

    const categories = Object.keys(colDataMap).map((x) => COL_TYPES[colId].transformCategoryLabels?.(x) ?? x);
    const colValues = Object.values(colDataMap);
    const seriesObj = getSeries({data: colValues, name: headerName});

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
          text: itemsDesc(specsOnly),
        },
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          return tooltipHtml_v2({
            header: `${this.x}`,
            body: [
              ["", `${this.y} ${itemsDesc(specsOnly)} (${i18nNumber(intl, (this.point.y / colData.length)*100, 0)}%)`, ]
            ]
          });
        },
      },
      series: [seriesObj],
      plotOptions: {
        series: {
          animation: false,
          stacking: "normal",
          allowPointSelect: true,
          maxPointWidth: 70,
          cursor: "pointer",
          states: {
            select: {
              color: null,
              opacity: 0.5,
            },
          },
          point: {
            events: {
              click: function () {
                const selectedFilter = this.options.id;
                const selectedMetric = this.series.userOptions.name;

                // set subtitle
                this.series.chart.setSubtitle({text: getNewSubtitle(this.y, specsOnly)});

                onPointClick?.({...this, selectedMetric, selectedFilter});
              },
            },
          },
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.point.y === 0 || colData.length === 0) {
                return "";
              } else {
                const fractionVal = this.point.y / colData.length;
                const percentVal = i18nNumber(intl, fractionVal * 100, 2);
                return `${percentVal}%`;
              }
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
