
import {Chart} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {assignWorkItemStateColor, Colors, itemsDesc} from "../../config";
import { tooltipHtml_v2 } from "../../../../framework/viz/charts/tooltip";
import { pick } from "../../../../helpers/utility";

function getStateCounts(items) {
    const obj = items.reduce((acc, item) => {
        if (acc[item.state]!=null) {
            acc[item.state].count += 1;
        }else {
            acc[item.state] = {count: 1, stateType: item.stateType};
        }
        return acc;
    }, {});
    return obj;

}
// Return an array of  HighChart series data structures from the
// passed in props.
function getSeries(items) {
  return [{
    key: "wipQueSize",
    showInLegend: false,
    data: Object.entries(getStateCounts(items)).map((e, index) => {
        return {name: e[0], y: e[1].count, color: assignWorkItemStateColor(e[1].stateType, index)};
    }),
  },]
}

export const WipQueueSizeChart = Chart({
  chartUpdateProps: (props) => pick(props, "items", "specsOnly", "stageName"),
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),
  getConfig: ({items, stageName, specsOnly, onPointClick}) => {
    const series = getSeries(items);
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
        categories: Object.keys(getStateCounts(items))
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
          return tooltipHtml_v2({
            header: `${this.point.category}`,
            body: [
              [`Queue Size: `, `${this.point.y} ${itemsDesc(specsOnly)}`]
            ]
          })
        }
      },
      series: [
        ...series
      ],
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