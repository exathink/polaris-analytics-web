
import {Chart} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import { assignWorkItemStateColor, Colors, itemsDesc, workItemFlowTypeColor } from "../../config";
import { tooltipHtml_v2 } from "../../../../framework/viz/charts/tooltip";
import { getSingularPlural, i18nNumber, pick } from "../../../../helpers/utility";

function getStateCounts(items) {
  const obj = items.reduce((acc, item) => {
    if (acc[item.state] != null) {
      acc[item.state].count += 1;
      acc[item.state].totalAge += item.cycleTime;
    } else {
      acc[item.state] = {count: 1, totalAge: item.cycleTime, timeInState: item.timeInState, stateType: item.stateType, flowType: item.flowType };
    }
    return acc;
  }, {});
  return obj;
}

function compare(a, b) {
  if (a[1].flowType < b[1].flowType) {
    return -1;
  }
  if (a[1].flowType > b[1].flowType) {
    return 1;
  }
  return 0;
}

// Return an array of  HighChart series data structures from the
// passed in props.
function getSeries(items, specsOnly) {
  return [
    {
      key: "wipQueSize",
      showInLegend: false,
      dataLabels: [
        {
          align: "right",
          format: `{y} ${itemsDesc(specsOnly)}`,
        },
      ],
      data: Object.entries(getStateCounts(items))
        .sort(compare)
        .map((e, index) => {
          return {name: e[0], y: e[1].count, color: workItemFlowTypeColor(e[1].flowType), totalAge: e[1].totalAge, timeInState: e[1].timeInState};
        }),
    },
  ];
}

export const WipQueueSizeChart = Chart({
  chartUpdateProps: (props) => pick(props, "items", "specsOnly", "stageName"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),
  getConfig: ({items, stageName, specsOnly, onPointClick, intl}) => {
    const series = getSeries(items, specsOnly);
    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy',
        type: "bar"
      },
      title: {
        text: `Queue Size: ${items.length} ${itemsDesc(specsOnly)} in ${stageName}` || 'Title',
        align: 'left',
      },
      subtitle: {
        text: ``,
        align: 'left',
      },
      xAxis: {
        type: 'linear',
        categories: Object.entries(getStateCounts(items)).sort(compare).flatMap(e => e[0])
      },
      yAxis: {
        type: 'linear',
        allowDecimals: false,
        title: {
            text: itemsDesc(specsOnly)
        }
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          let avgAge = 0;
          let avgTime = 0;
          if (this.point.totalAge != null && this.point.totalAge > 0 && this.point.y > 0) {
             avgAge = i18nNumber(intl, this.point.totalAge/this.point.y, 1);
          }
          if (this.point.timeInState != null && this.point.timeInState > 0 && this.point.y > 0) {
            avgTime = i18nNumber(intl, this.point.timeInState / this.point.y, 1);
          }

          return tooltipHtml_v2({
            header: `${this.point.category}`,
            body: [
              [`Queue Size: `, `${this.point.y} ${itemsDesc(specsOnly)}`],
              [`Avg. Age: `, `${avgAge} ${getSingularPlural(avgAge, "Day")}`],
              [`Avg. Time in State: `, `${avgTime} ${getSingularPlural(avgTime, "Day")}`]
            ]
          })
        }
      },
      series: series,
      plotOptions: {
        bar: {
          maxPointWidth: 50
        },
        series: {
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
                onPointClick?.(this);
              },
            },
          },
          dataLabels: {
            enabled: true,
            inside: true
        }
        }
      },
      legend: {
        title: {
          text: '',
          style: {
            fontStyle: 'italic'
          }
        },
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemMarginBottom: 3,
        enabled: true
      },
    }
  }

});