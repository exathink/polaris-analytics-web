/*
This file is a template for creating new chart components. Not intended to be used directly,
use it as a guide on how to structure a new chart component file. Copy/Paste modify as needed.
 */
import {Chart} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {WorkItemStateTypeColor, Colors} from "../../config";

export const Highcharts = require("highcharts/highstock");
require("highcharts/modules/draggable-points")(Highcharts);

function getSeries({stateMaps, allStateTypes}) {
  const allStateTypeKeys = allStateTypes.map((x) => x.key);

  return [
    // leaving the commented code here, till its finalized.
    // {
    //   name: "UnMapped States",
    //   type: "column",
    //   data: stateMaps.map((item) => {
    //     return {
    //       name: item.state,
    //       y: 1.2,
    //       x: allStateTypeKeys.indexOf(item.stateType),
    //       color: WorkItemStateTypeColor[item.stateType],
    //     };
    //   }),
    // },
    
    // creating a series for each item to resolve the stacking issue
    ...stateMaps.map((item) => {
      return {
        name: item.state,
        type: "column",
        showInLegend: false,
        data: [
          {
            name: item.state,
            y: 1.2,
            x: allStateTypeKeys.indexOf(item.stateType),
            color: WorkItemStateTypeColor[item.stateType],
          },
        ],
      };
    }),
    {
      name: "State Types",
      type: "column",
      showInLegend: false,
      data: allStateTypes.map(({key, displayValue}, index) => {
        return {
          name: displayValue,
          y: 1.2,
          x: index,
          pointWidth: 100,
          color: WorkItemStateTypeColor[key],
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

export const WorkItemStateTypeMapChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),

  getConfig: ({initialStateTypeMapping, setDraftState, title, subtitle, intl, view}) => {
    const series = getSeries(initialStateTypeMapping);
    const allStateTypeKeys = initialStateTypeMapping.allStateTypes.map((x) => x.key);
    const allStateTypeDisplayValues = initialStateTypeMapping.allStateTypes.map((x) => x.displayValue);

    return {
      chart: {
        animation: false,
      },
      title: {
        text: "Map UnMapped States",
      },
      xAxis: {
        categories: allStateTypeDisplayValues,
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
            dragMinX: 0,
            dragMaxX: 5,
            liveRedraw: false,
          },
          point: {
            events: {
              drop: function (e) {
                // this is workaround till we find better solution.
                const currentMappingData = e.target.series.chart.series.filter(s => s.name!=="State Types").flatMap(s => s.data).reduce((acc, p) => {
                  acc[p.name] = p.category;
                  return acc;
                }, {});

                const newCategoryIndex = e.newPoint.x;
                const newPointName = e.newPoints[this.id].point.name;

                // update dropped point here
                currentMappingData[newPointName] = allStateTypeKeys[newCategoryIndex];
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
        enabled: false,
      },
      series: series,
    };
  },
});
