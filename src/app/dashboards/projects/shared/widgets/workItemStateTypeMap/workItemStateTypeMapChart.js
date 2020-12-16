import {Chart, Highcharts} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors, WorkItemStateTypeColor, WorkItemStateTypeDisplayName} from "../../../../shared/config";
import {actionTypes} from "./constants";

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
  const {...legalStateTypes} = WorkItemStateTypeDisplayName;

  return workItemStateMappings.map((x) => {
    if (x.stateType === null) {
      return {...x, stateType: "unmapped"};
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

  getConfig: ({workItemSource, updateDraftState, title, subtitle, intl, view, viewerContext, organizationKey}) => {
    const workItemStateMappings = workItemSource ? workItemSource.workItemStateMappings : [];
    const stateMappings = sanitizeStateMappings(workItemStateMappings);
    const series = getSeries(stateMappings);

    const allStateTypeKeys = getAllStateTypeKeys();
    const allStateTypeDisplayValues = Object.values(WorkItemStateTypeDisplayName);

    const isOrgOwner = viewerContext.isOrganizationOwner(organizationKey);
    
    return {
      chart: {
        backgroundColor: Colors.Chart.backgroundColor,
        animation: false,
      },
      title: {
        text: `Value Stream Mapping`,
      },
      subtitle: {
        text: isOrgOwner ? `Drag a work item state to its desired phase to edit mapping.` : ``,
      },
      xAxis: {
        categories: allStateTypeDisplayValues,
        title: {
          text: "Phase",
        },
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
              drag: function (e) {
                // not org owner, shouldn't be able to drag
                if (!isOrgOwner) {
                  return false;
                }
              },
              drop: function (e) {
                // not org owner, shouldn't be able to drop
                if (!isOrgOwner) {
                  return false;
                }

                // 'this' here represents point being dragged.
                const point = this;

                const newCategoryIndex = e.newPoint.x;
                // resize of state bar should not update parent draft state
                // stops resize of state bar
                if (newCategoryIndex === undefined) {
                  return false;
                }

                const prevCategory = point.x;
                // dropping on the same stateType should not update parent draft state
                if (newCategoryIndex === prevCategory) {
                  return false;
                }

                // moving to unmapped category from other categories is not allowed
                if (newCategoryIndex === 0) {
                  return false;
                }
                // update dropped point here
                const keyValuePair = {};
                keyValuePair[point.name] = allStateTypeKeys[newCategoryIndex];
                updateDraftState({type: actionTypes.UPDATE_WORKITEM_SOURCE, payload: {keyValuePair}});
              },
            },
          },
          dataLabels: {
            enabled: true,
            align: "center",
            y: -2,
            style: {
              fontSize: "9px",
            },
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
      time: {
        useUTC: false,
      },
    };
  },
});
