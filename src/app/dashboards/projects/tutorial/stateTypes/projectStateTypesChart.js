import { Chart, tooltipHtml } from '../../../../framework/viz/charts';
import { buildIndex, pick, elide } from '../../../../helpers/utility';
import { DefaultSelectionEventHandler } from '../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler';
import {Highcharts} from "../../../../framework/viz/charts/chartWrapper";

import {
  Colors,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemStateTypeSortOrder,
} from '../../../shared/config';

require('highcharts/modules/funnel')(Highcharts);
// Return an array of  HighChart series data structures from the
// passed in props.
function getSeries(workItemStateTypeCounts, intl, view, type) {
  console.log(Object.keys(workItemStateTypeCounts));
  return [
    {
      key: `stateTypes`,
      id: `stateTypes`,
      name: `stateTypes`,
      type: type,
      // its not the best way to handle this, for now lets keep this way for learning purpose
      data: Object.keys(type='funnel' ? WorkItemStateTypeDisplayName: workItemStateTypeCounts)
        .map((stateType) => ({
          name: WorkItemStateTypeDisplayName[stateType],
          y: workItemStateTypeCounts[stateType],
          color: WorkItemStateTypeColor[stateType],
          stateType: stateType,
        }))
        // sort in descending order (exercise1)
        // .sort(
        //   (p1, p2) => p2.y - p1.y
        // )
        // sort in canonical order (exercise2)
        .sort(
          (p1, p2) =>
            WorkItemStateTypeSortOrder[p1.stateType] -
            WorkItemStateTypeSortOrder[p2.stateType]
        ),
        showInLegend: true
    },
  ];
}

export const ProjectStateTypesChart = Chart({
  // Update this function to choose which props will cause the chart config to be regenerated.
  chartUpdateProps: (props) => props,

  // Leave this as is unless you want to create a different selection handler than the default one.
  eventHandler: DefaultSelectionEventHandler,

  // when the default selection handler calls its application callback, it calls this
  // mapper to map point objects into domain objects for the application. Attach domain objects to the series data
  // points and map them back here.
  mapPoints: (points, _) => points.map((point) => point),

  // These are the minimal props passed by the Chart component. Add
  // all the additional domain props you will pass to React component here so that
  // you can use them in building the config.

  // trying demo example from highcharts.
  getConfig: ({ workItemStateTypeCounts, title, subtitle, intl, view, type }) => {
    const series = getSeries(workItemStateTypeCounts, intl, view, type);
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
        text: title || 'Title',
        align: 'left',
      },
      subtitle: {
        text: subtitle || `Subtitle`,
        align: 'left',
      },
      xAxis: {
        type: 'category',

        title: {
          text: 'State Type',
        },
      },
      yAxis: {
        type: 'linear',

        title: {
          text: 'x',
        },
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          // This is the standard way we display tool tips.
          // A header string followed by a two column table with name, value pairs.
          // The strings can be HTML.
          const { stateType, y } = this.point;
          return tooltipHtml({
            header: `State Type: ${WorkItemStateTypeDisplayName[stateType]}`,
            body: [[`Number of Items:`, `${intl.formatNumber(y)}`]],
          });
        },
      },
      series: [...series],
      plotOptions: {
        // not the best way, for now keeping it for learning purpose
        series: type = 'funnel' ? {
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b> ({point.y:,.0f})',
            softConnector: true,
            color: 'black'
          },
          center: ['45%', '50%'],
          neckWidth: '25%',
          neckHeight: '45%',
          width: '80%'
        }: {
          animation: false,
        },
      },
      legend: {
        title: {
          text: 'Legend',
          style: {
            fontStyle: 'italic',
          },
        },
        align: 'right',
        layout: 'vertical',
        verticalAlign: 'middle',
        itemMarginBottom: 3,
        enabled: false,
      },
    };
  },
});
