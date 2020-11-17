import { Chart, tooltipHtml } from '../../../../framework/viz/charts';
import { buildIndex, pick, elide } from '../../../../helpers/utility';
import { DefaultSelectionEventHandler } from '../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler';

import { Colors } from '../../../shared/config';

// Return an array of  HighChart series data structures from the
// passed in props.
function getSeries(intl, view) {
  return [];
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
  getConfig: ({ title, subtitle, intl, view }) => {
    const series = getSeries(intl, view);
    return {
      chart: {
        type: 'bar',
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
        categories: ['Apples', 'Bananas', 'Oranges'],
      },
      yAxis: {
        title: {
          text: 'Fruit eaten',
        },
      },
      series: [
        {
          name: 'Jane',
          data: [1, 0, 4],
        },
        {
          name: 'John',
          data: [5, 7, 3],
        },
      ],
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
        enabled: true,
      },
    };
  },
});
