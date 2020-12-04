/*
This file is a template for creating new chart components. Not intended to be used directly,
use it as a guide on how to structure a new chart component file. Copy/Paste modify as needed.
 */
import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {WorkItemStateTypeColor, Colors} from "../../../../shared/config";

export const Highcharts = require("highcharts/highstock");
require("highcharts/modules/draggable-points")(Highcharts);


function getSeries({stateMaps, allStateTypes}) {
  return [
    {
      name: "Mapped States",
      type: "column",
      data: stateMaps.map((item) => {
        return {
          name: item.state,
          y: 1.2,
          x: allStateTypes.indexOf(item.stateType),
          color: WorkItemStateTypeColor[item.stateType],
        };
      }),
    },
    {
      name: "State Types",
      type: "column",
      data: allStateTypes.map((item, _index) => {
        return {
          name: item,
          y: 1.2,
          x: _index,
          pointWidth: 100,
          color: WorkItemStateTypeColor[item],
          dragDrop: {
            draggableX: false,
            draggableY: false,
          },
          dataLabels: {
            enabled: false,
          },
        };
      }),
    },
  ];
}

export const StateMapPackedBubbleChart = Chart({
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
  getConfig: ({initialStateTypeMapping, setDraftState, title, subtitle, intl, view}) => {
    const series = getSeries(initialStateTypeMapping);
    const {allStateTypes} = initialStateTypeMapping;
    return {
      chart: {
        animation: false,
      },
      title: {
        text: "Map UnMapped States",
      },
      xAxis: {
        categories: allStateTypes,
      },
      yAxis: {
        softMin: 0,
        softMax: 20,
      },
      plotOptions: {
        series: {
          cursor: "move",
          stickyTracking: true,
          dragDrop: {
            draggableX: true,
            draggableY: true,
            dragMinY: 0,
            dragMaxY: 20,
            // dragMinX: 0,
            // dragMaxX: 6,
            liveRedraw: false,
          },
          point: {
            events: {
              drop: function (e) {
                const currentMappingData = e.target.series.data.reduce((acc, p) => {
                  acc[p.name] = p.category;
                  return acc;
                }, {});

                const newCategoryIndex = e.newPoint.x;
                const newPointName = e.newPoints[this.id].point.name;

                // update dropped point here
                currentMappingData[newPointName] = allStateTypes[newCategoryIndex];
                setDraftState(currentMappingData);
              },
            },
          },
          dataLabels: {
            enabled: true,
            format: "{point.name}",
          },
        },
        column: {
          stacking: "normal",
          minPointLength: 2,
        },
      },
      tooltip: {
        valueDecimals: 2,
      },
      series: series,
    };
  },
});
