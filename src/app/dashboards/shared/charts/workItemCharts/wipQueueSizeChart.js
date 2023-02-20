
import {Chart} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors, itemsDesc, WorkItemStateTypeColor} from "../../config";
import { tooltipHtml_v2 } from "../../../../framework/viz/charts/tooltip";

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
    data: Object.entries(getStateCounts(items)).map(e => {
        return {name: e[0], y: e[1].count, color: WorkItemStateTypeColor[e[1].stateType]};
    }),
  },]
}

export const WipQueueSizeChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map(point => point),
  getConfig: ({title, subtitle, intl, view, items, stageName, specsOnly}) => {
    const series = getSeries(items);
    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy',
        type: "column"
      },
      title: {
        text: `${items.length} ${itemsDesc(specsOnly)} in ${stageName}` || 'Title',
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
              [``, `${this.point.y}`],
            ]
          })
        }
      },
      series: [
        ...series
      ],
      plotOptions: {
        series: {
          animation: false
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