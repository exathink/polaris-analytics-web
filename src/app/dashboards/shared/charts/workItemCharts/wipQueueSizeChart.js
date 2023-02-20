/*
This file is a template for creating new chart components. Not intended to be used directly,
use it as a guide on how to structure a new chart component file. Copy/Paste modify as needed.
 */
import {Chart, tooltipHtml} from "../../../../framework/viz/charts";
import {buildIndex, pick, elide} from "../../../../helpers/utility";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";

// uncomment this line and add the relative path to src/app/dashboards/shared/config.js
import {Colors} from "../../config";

// Return an array of  HighChart series data structures from the
// passed in props.
function getSeries(intl, view) {
  return []
}

export const WipQueueSizeChart = Chart({
  // Update this function to choose which props will cause the chart config to be regenerated.
  chartUpdateProps: (props) => props,

  // Leave this as is unless you want to create a different selection handler than the default one.
  eventHandler: DefaultSelectionEventHandler,

  // when the default selection handler calls its application callback, it calls this
  // mapper to map point objects into domain objects for the application. Attach domain objects to the series data
  // points and map them back here.
  mapPoints: (points, _) => points.map(point => point),

  // These are the minimal props passed by the Chart component. Add
  // all the additional domain props you will pass to React component here so that
  // you can use them in building the config.
  getConfig: ({title, subtitle, intl, view}) => {
    const series = getSeries(intl, view);
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
        hideDelay: 50,
        formatter: function () {
          // This is the standard way we display tool tips.
          // A header string followed by a two column table with name, value pairs.
          // The strings can be HTML.
          return tooltipHtml({
            header: ``,
            body: [
              [``, ``],
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
          text: 'Legend',
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