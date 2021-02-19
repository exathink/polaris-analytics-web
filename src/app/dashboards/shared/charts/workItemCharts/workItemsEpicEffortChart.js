import {Chart, Highcharts, tooltipHtml} from "../../../../framework/viz/charts";
import {buildIndex, pick, localNow} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

import {Colors} from "../../config";

require('highcharts/modules/treemap')(Highcharts);

function getSeries(workItems, specsOnly, intl, view) {
  const workItemsByEpic = buildIndex(workItems, workItem => workItem.epicName || 'No Epic');


  return [{
    type: 'treemap',
    layoutAlgorithm: 'squarified',
    name: 'Closed',
    //color: '#ddd6e2',

    data: Object.keys(workItemsByEpic).map(
      epicName => ({
        name: epicName,
        value: specsOnly ? workItemsByEpic[epicName].reduce(
          (totalEffort, workItem) => totalEffort + workItem.effort,
          0
        ) : workItemsByEpic[epicName].length,
        epic: {
          name: epicName,
          key: workItemsByEpic[epicName][0].epicKey
        },
        workItems: workItemsByEpic[epicName]
      })
    ),
    dataLabels: {
      enabled: true,
      useHTML: true,

      formatter: function () {
        return `<div style="text-align: center;">${this.point.name}<br/>${intl.formatNumber(this.point.value, {maximumSignificantDigits: 2})} ${specsOnly ? `Dev-Days` : `Cards`}</div>`;
      }
    }
  }]
}

export const WorkItemsEpicEffortChart = Chart({
  // Update this function to choose which props will cause the chart config to be regenerated.
  chartUpdateProps: (props) => pick(props, 'workItems', 'specsOnly', 'activeOnly', 'days', 'title', 'subtitle'),

  // Leave this as is unless you want to create a different selection handler than the default one.
  eventHandler: DefaultSelectionEventHandler,

  // when the default selection handler calls its application callback, it calls this
  // mapper to map point objects into domain objects for the application. Attach domain objects to the series data
  // points and map them back here.
  mapPoints: (points, _) => points.map(point => point.workItem),

  // These are the minimal props passed by the Chart component. Add
  // all the additional domain props you will pass to React component here so that
  // you can use them in building the config.
  getConfig: ({workItems, specsOnly, activeOnly, days, title, subtitle, intl, view}) => {
    const series = getSeries(workItems, specsOnly, intl, view);

    return {
      chart: {
        // some default options we include on all charts, but might want to
        // specialize in some cases.
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: 'shift',
        zoomType: 'xy',

      },
      title: {
        text: title || `Epics: ${activeOnly ? 'Work In Progress' : ''}${days ? `Last ${days} days` : ''}`,
        align: 'left',
      },
      subtitle: {
        text: `${specsOnly ? '% EffortOUT ' : '% Volume '} by Epic: ${localNow(intl)}`,
        align: 'left',
      },
      xAxis: {
        type: 'linear',

        title: {
          text: 'X'
        }
      },
      yAxis: {
        type: 'linear',

        title: {
          text: 'x'
        },
      },


      tooltip: {
        useHTML: true,
        outside: true,
        hideDelay: 50,
        formatter: function () {
          const {name, value, workItems} = this.point;
          return tooltipHtml({
            header: `${name}`,
            body: [
              [`Effort`, `${intl.formatNumber(value)} Dev-Days`],
              [`Cards`, `${workItems.length}`],
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
        },
        treemap: {},
        legend: {
          title: {
            text: 'Legend',
            style: {
              fontStyle: 'italic'
            }
          },
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle',
          itemMarginBottom: 3,
          enabled: false
        },
      }
    }
  }
});