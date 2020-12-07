import {Chart, Highcharts} from "../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors, WorkItemStateTypeColor} from "../../config";
import {actionTypes} from "./workItemStateTypeMapView";
import {ALL_STATE_TYPES} from "./workItemStateTypeMapWidget";

require("highcharts/modules/draggable-points")(Highcharts);

function getAllStateTypeKeys() {
  return ALL_STATE_TYPES.map((x) => x.key);
}

function getSeries(workItemStateMappings) {
  const allStateTypeKeys = getAllStateTypeKeys();

  return [
    // creating a series for each item to resolve the stacking issue
    ...workItemStateMappings.map((item) => {
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
      data: ALL_STATE_TYPES.map(({key, displayValue}, index) => {
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

function sanitizeStateMappings(workItemStateMappings) {
  const allStateTypeKeys = getAllStateTypeKeys();
  const [{key: unMappedKey}] = ALL_STATE_TYPES;

  return workItemStateMappings.map((x) => {
    if (!allStateTypeKeys.includes(x.stateType)) {
      return {...x, stateType: unMappedKey};
    }
    return x;
  });
}

export const WorkItemStateTypeMapChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),

  getConfig: ({workItemStateMappings, updateDraftState, title, subtitle, intl, view}) => {
    // cleanup workItemStateMappings
    const stateMappings = sanitizeStateMappings(workItemStateMappings);
    const series = getSeries(stateMappings);

    const allStateTypeKeys = getAllStateTypeKeys();
    const allStateTypeDisplayValues = ALL_STATE_TYPES.map((x) => x.displayValue);

    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        animation: false,
      },
      title: {
        text: "Map UnMapped States",
      },
      xAxis: {
        categories: allStateTypeDisplayValues,
      },
      yAxis: {
        visible: false,
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
                const newCategoryIndex = e.newPoint.x;
                const newPointName = e.newPoints[this.id].point.name;

                // update dropped point here
                const keyValuePair = {};
                keyValuePair[newPointName] = allStateTypeKeys[newCategoryIndex];
                updateDraftState({type: actionTypes.UPDATE_WORKITEM_SOURCE, payload: {keyValuePair}});
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
