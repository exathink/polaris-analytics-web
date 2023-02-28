import { Chart, Highcharts, tooltipHtml } from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {
  Colors,
  sanitizeStateMappings,
  WorkItemStateTypeColor,
  WorkItemStateTypeDisplayName,
  WorkItemTypeDisplayName
} from "../../../../shared/config";
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
            y: 2,
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

export const WorkItemStateTypeMapChart = Chart({
  chartUpdateProps: (props) => props,
  eventHandler: DefaultSelectionEventHandler,
  mapPoints: (points, _) => points.map((point) => point),

  getConfig: ({workItemSource, updateDraftState, title, subtitle, intl, view, enableEdits}) => {
    const workItemStateMappings = workItemSource ? workItemSource.workItemStateMappings : [];
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
        text: `Delivery Process Mapping`,
      },
      subtitle: {
        text: enableEdits ? `Drag a workflow state to its desired phase.` : ``,
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
                if (!enableEdits) {
                  return false;
                }
              },
              drop: function (e) {
                // not org owner, shouldn't be able to drop
                if (!enableEdits) {
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
        useHTML: true,
        followPointer: false,
        hideDelay: 0,
        formatter: function () {
          return tooltipHtml({
            header: `Current Mapping`,
            body: [
              ['Workflow State: ',this.point.name],
              ['Phase: ', this.point.category]

            ],
          })
        }
      },
      series: series,
      time: {
        useUTC: false,
      },
    };
  },
});
