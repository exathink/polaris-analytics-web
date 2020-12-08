import {Chart, Highcharts} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors, WorkItemStateTypeColor, WorkItemStateTypeDisplayName} from "../../../../shared/config";
import {actionTypes} from "./workItemStateTypeMapView";

require("highcharts/modules/draggable-points")(Highcharts);

function getAllStateTypeKeys() {
  return Object.keys(WorkItemStateTypeDisplayName);
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
      data: Object.entries(WorkItemStateTypeDisplayName).map(([key, displayValue], index) => {
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
  // removing unmapped from legal stateTypes
  const {unmapped: _, ...legalStateTypes} = WorkItemStateTypeDisplayName;

  const unMappedKey = "unmapped";

  return workItemStateMappings.map((x) => {
    if (x.stateType === null) {
      return {...x, stateType: unMappedKey};
    } else if (legalStateTypes[x.stateType] === undefined) {
      // we are here, means, x.stateType is not null and also its not one of legal state types
      throw new Error(`${x.stateType} is not one of legal stateTypes.`);
    }

    return x;
  });
}

export const WorkItemStateTypeMapChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),

  getConfig: ({workItemSources, workItemSourceKey, updateDraftState, title, subtitle, intl, view}) => {
    const {name: workItemSourceName, workItemStateMappings} = workItemSources.find(x => x.key === workItemSourceKey);
    // cleanup workItemStateMappings
    const stateMappings = sanitizeStateMappings(workItemStateMappings);
    const series = getSeries(stateMappings);

    const allStateTypeKeys = getAllStateTypeKeys();
    const allStateTypeDisplayValues = Object.values(WorkItemStateTypeDisplayName);

    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        animation: false,
      },
      title: {
        text: `Work Item State to Phase Map`,
      },
      subtitle: {
        text: `Drag a state to its desired phase to edit mapping`
      },
      xAxis: {
        categories: allStateTypeDisplayValues,
        title: {
          text: 'Phase'
        }

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

                // moving to unmapped category from other categories is not allowed
                if(newCategoryIndex === 0){
                  return false;
                }
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
