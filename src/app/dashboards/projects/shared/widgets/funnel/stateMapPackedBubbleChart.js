/*
This file is a template for creating new chart components. Not intended to be used directly,
use it as a guide on how to structure a new chart component file. Copy/Paste modify as needed.
 */
import {Chart, tooltipHtml} from "../../../../../framework/viz/charts";
import {DefaultSelectionEventHandler} from "../../../../../framework/viz/charts/eventHandlers/defaultSelectionHandler";
import {Colors} from "../../../../shared/config";

// uncomment this line and add the relative path to src/app/dashboards/shared/config.js
// import {Colors} from "../../config";

// Return an array of  HighChart series data structures from the
// passed in props.
function getSeries(stateMap) {
  const {stateMaps = []} = stateMap;
  const obj = stateMaps.reduce((acc, {state, stateType}) => {
    if (acc[stateType] === undefined) {
      acc[stateType] = [state];
    } else {
      acc[stateType].push(state);
    }
    return acc;
  }, {});

  const colors = [
    "rgba(200, 100, 100, 0.8)",
    "rgba(0, 40, 130, 0.8)",
    "rgba(0,100,100, 0.8)",
    "rgba(200, 100, 200, 0.8)",
    "rgba(70,220,50,0.8)",
  ];
  const volumes = {
    created: 1,
    Backlog: 2,
    "Selected for Development": 6,
    DESIGN: 7,
    "READY-FOR-DEVELOPMENT": 8,
    "In Progress": 5,
    "Code-Review-Needed": 9,
    "DEV-DONE": 4,
    ACCEPTED: 3,
    REJECTED: 10,
    Done: 11,
    ABANDONED: 12,
    "DEPLOYED-TO-STAGING": 15,
    RELEASED: 13,
    ROADMAP: 18,
    Closed: 14,
  };

  return Object.entries(obj).map(([stateType, states], index) => {
    return {
      name: stateType,
      color: colors[index],
      data: states.map((state) => ({name: state, shortName: state, value: volumes[state]})),
    };
  });
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
  getConfig: ({stateMap, title, subtitle, intl, view}) => {
    const series = getSeries(stateMap);
    return {
      chart: {
        type: "packedbubble",
        height: "100%",
        backgroundColor: Colors.Chart.backgroundColor,
        panning: true,
        panKey: "shift",
        zoomType: "xy",
      },
      title: {
        text: title || "Title",
        align: "left",
      },
      subtitle: {
        text: subtitle || `State Map`,
        align: "left",
      },
      xAxis: {
        type: "linear",

        title: {
          text: "X",
        },
      },
      yAxis: {
        type: "linear",

        title: {
          text: "x",
        },
      },

      tooltip: {
        useHTML: true,
        hideDelay: 50,
        formatter: function () {
          const {point} = this;
          return tooltipHtml({
            header: `${point.name}`,
            body: [[`${point.shortName}`, `${point.value}`]],
          });
        },
      },
      series: [...series],
      plotOptions: {
        packedbubble: {
          minSize: "15%",
          maxSize: "50%",
          useSimulation: true,
          Draggable: true,
          layoutAlgorithm: {
            initialPositionRadius: 100,
            splitSeries: true,
            parentNodeLimit: true,
            dragBetweenSeries: true,
            parentNodeOptions: {
              bubblePadding: 20,
            },
          },
          dataLabels: {
            enabled: true,
            format: "{point.shortName}",
            parentNodeFormat: "{point.series.name}",
          },
          point: {
            events: {
              dragStart: function (e) {
                console.log("event", e);
                debugger;
              },
              drag: function (e) {
                // Returning false stops the drag and drops. Example:
                /*
                    if (e.newPoint && e.newPoint.x < 300) {
                        return false;
                    }
                    */
                var status = 'Dragging "' + (this.name || this.id) + '". ' + e.numNewPoints + " point(s) selected.";

                // If more than one point is being updated, see
                // e.newPoints for a hashmap of these. Here we just add
                // info if there is a single point.
                if (e.newPoint) {
                  status += " New x/x2/y: " + e.newPoint.x + "/" + e.newPoint.x2 + "/" + e.newPoint.y;
                }

                // setDragStatus(status);
              },
              drop: function (e) {
                console.log("dropEvent", e);
                debugger;
                // The default action here runs point.update on the
                // new points. Return false to stop this. Here we stop
                // the "Group A" points from being moved to the
                // "Prototyping" row.
                if (this.groupId === "Group A" && e.newPoints[this.id].newValues.y === 0) {
                  // setDragStatus("Drop was blocked by event handler.");
                  return false;
                }

                // setDragStatus("Dropped " + e.numNewPoints + " point(s)");
              },
            },
          },
        },
        series: {
          cursor: "pointer",
        },
      },
      legend: {
        title: {
          text: "Legend",
          style: {
            fontStyle: "italic",
          },
        },
        align: "right",
        layout: "vertical",
        verticalAlign: "middle",
        itemMarginBottom: 3,
        enabled: false,
      },
    };
  },
});
